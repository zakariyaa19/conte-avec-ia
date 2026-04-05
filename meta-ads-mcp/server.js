import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const META_API_VERSION = "v21.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

// Read config from environment
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

if (!ACCESS_TOKEN || !AD_ACCOUNT_ID) {
  console.error("Missing META_ACCESS_TOKEN or META_AD_ACCOUNT_ID environment variables");
  process.exit(1);
}

// Helper: Meta API request
async function metaApi(endpoint, params = {}, method = "GET", body = null) {
  const url = new URL(`${META_BASE_URL}${endpoint}`);
  url.searchParams.set("access_token", ACCESS_TOKEN);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }

  const opts = { method, headers: {} };
  if (body && method !== "GET") {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.error) {
    throw new Error(`Meta API Error: ${data.error.message} (code ${data.error.code})`);
  }
  return data;
}

// Format currency from cents
function formatCurrency(value, currency = "EUR") {
  return `${(parseFloat(value) || 0).toFixed(2)} ${currency}`;
}

// ═══════════════════════════════════
// MCP SERVER
// ═══════════════════════════════════

const server = new McpServer({
  name: "meta-ads",
  version: "1.0.0",
});

// ── TOOL: Get account overview ──
server.tool(
  "meta_account_overview",
  "Get Meta Ads account overview: total spend, campaigns count, account status",
  {},
  async () => {
    const account = await metaApi(`/${AD_ACCOUNT_ID}`, {
      fields: "name,account_status,currency,amount_spent,balance,spend_cap,business_name",
    });

    const campaigns = await metaApi(`/${AD_ACCOUNT_ID}/campaigns`, {
      fields: "id",
      limit: 0,
      summary: "total_count",
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              account_name: account.name,
              business_name: account.business_name,
              status: account.account_status === 1 ? "ACTIVE" : "INACTIVE",
              currency: account.currency,
              total_spent: formatCurrency(account.amount_spent / 100, account.currency),
              balance: account.balance ? formatCurrency(account.balance / 100, account.currency) : "N/A",
              spend_cap: account.spend_cap ? formatCurrency(account.spend_cap / 100, account.currency) : "No cap",
              total_campaigns: campaigns.summary?.total_count || 0,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// ── TOOL: Get campaigns performance ──
server.tool(
  "meta_campaigns",
  "Get all campaigns with performance metrics. Use date_preset for quick ranges or time_range for custom dates.",
  {
    date_preset: z
      .enum([
        "today",
        "yesterday",
        "this_month",
        "last_month",
        "last_7d",
        "last_14d",
        "last_30d",
        "last_90d",
      ])
      .optional()
      .describe("Quick date range preset (default: last_7d)"),
    time_range_since: z.string().optional().describe("Custom start date YYYY-MM-DD"),
    time_range_until: z.string().optional().describe("Custom end date YYYY-MM-DD"),
    status_filter: z
      .enum(["ACTIVE", "PAUSED", "ALL"])
      .optional()
      .describe("Filter by status (default: ALL)"),
  },
  async ({ date_preset, time_range_since, time_range_until, status_filter }) => {
    const params = {
      fields:
        "name,status,objective,daily_budget,lifetime_budget,budget_remaining,start_time,updated_time",
      limit: 50,
    };

    if (status_filter && status_filter !== "ALL") {
      params.filtering = JSON.stringify([
        { field: "effective_status", operator: "IN", value: [status_filter] },
      ]);
    }

    const campaigns = await metaApi(`/${AD_ACCOUNT_ID}/campaigns`, params);

    // Get insights for each campaign
    const insightParams = {
      fields:
        "campaign_name,spend,impressions,clicks,cpc,cpm,ctr,reach,frequency,actions,cost_per_action_type,conversions,purchase_roas",
      level: "campaign",
      limit: 50,
    };

    if (time_range_since && time_range_until) {
      insightParams.time_range = JSON.stringify({
        since: time_range_since,
        until: time_range_until,
      });
    } else {
      insightParams.date_preset = date_preset || "last_7d";
    }

    const insights = await metaApi(`/${AD_ACCOUNT_ID}/insights`, insightParams);

    // Merge campaign data with insights
    const insightsMap = {};
    for (const i of insights.data || []) {
      insightsMap[i.campaign_name] = i;
    }

    const result = (campaigns.data || []).map((c) => {
      const insight = insightsMap[c.name] || {};
      const leads = (insight.actions || []).find((a) => a.action_type === "lead")?.value || 0;
      const purchases = (insight.actions || []).find(
        (a) => a.action_type === "purchase" || a.action_type === "omni_purchase"
      )?.value || 0;
      const costPerLead = (insight.cost_per_action_type || []).find(
        (a) => a.action_type === "lead"
      )?.value || null;
      const costPerPurchase = (insight.cost_per_action_type || []).find(
        (a) => a.action_type === "purchase" || a.action_type === "omni_purchase"
      )?.value || null;

      return {
        name: c.name,
        id: c.id,
        status: c.status,
        objective: c.objective,
        daily_budget: c.daily_budget ? formatCurrency(c.daily_budget / 100) : "N/A",
        spend: insight.spend ? formatCurrency(insight.spend) : "0.00 EUR",
        impressions: parseInt(insight.impressions || 0),
        clicks: parseInt(insight.clicks || 0),
        ctr: insight.ctr ? `${parseFloat(insight.ctr).toFixed(2)}%` : "0%",
        cpc: insight.cpc ? formatCurrency(insight.cpc) : "N/A",
        cpm: insight.cpm ? formatCurrency(insight.cpm) : "N/A",
        reach: parseInt(insight.reach || 0),
        frequency: insight.frequency ? parseFloat(insight.frequency).toFixed(2) : "0",
        leads: parseInt(leads),
        purchases: parseInt(purchases),
        cost_per_lead: costPerLead ? formatCurrency(costPerLead) : "N/A",
        cost_per_purchase: costPerPurchase ? formatCurrency(costPerPurchase) : "N/A",
        roas: insight.purchase_roas?.[0]?.value
          ? parseFloat(insight.purchase_roas[0].value).toFixed(2)
          : "N/A",
      };
    });

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── TOOL: Get ad sets performance ──
server.tool(
  "meta_adsets",
  "Get ad sets with performance metrics for a specific campaign or all",
  {
    campaign_id: z.string().optional().describe("Filter by campaign ID"),
    date_preset: z
      .enum(["today", "yesterday", "last_7d", "last_14d", "last_30d"])
      .optional()
      .describe("Date range (default: last_7d)"),
    status_filter: z.enum(["ACTIVE", "PAUSED", "ALL"]).optional(),
  },
  async ({ campaign_id, date_preset, status_filter }) => {
    const endpoint = campaign_id
      ? `/${campaign_id}/adsets`
      : `/${AD_ACCOUNT_ID}/adsets`;

    const params = {
      fields:
        "name,status,daily_budget,lifetime_budget,targeting,optimization_goal,bid_strategy,start_time",
      limit: 50,
    };

    if (status_filter && status_filter !== "ALL") {
      params.filtering = JSON.stringify([
        { field: "effective_status", operator: "IN", value: [status_filter] },
      ]);
    }

    const adsets = await metaApi(endpoint, params);

    // Get insights
    const insightEndpoint = campaign_id
      ? `/${campaign_id}/insights`
      : `/${AD_ACCOUNT_ID}/insights`;

    const insights = await metaApi(insightEndpoint, {
      fields:
        "adset_name,adset_id,spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,actions,cost_per_action_type",
      level: "adset",
      date_preset: date_preset || "last_7d",
      limit: 50,
    });

    const insightsMap = {};
    for (const i of insights.data || []) {
      insightsMap[i.adset_id] = i;
    }

    const result = (adsets.data || []).map((as) => {
      const insight = insightsMap[as.id] || {};
      return {
        name: as.name,
        id: as.id,
        status: as.status,
        daily_budget: as.daily_budget ? formatCurrency(as.daily_budget / 100) : "N/A",
        optimization_goal: as.optimization_goal,
        bid_strategy: as.bid_strategy,
        spend: insight.spend ? formatCurrency(insight.spend) : "0.00 EUR",
        impressions: parseInt(insight.impressions || 0),
        clicks: parseInt(insight.clicks || 0),
        ctr: insight.ctr ? `${parseFloat(insight.ctr).toFixed(2)}%` : "0%",
        cpc: insight.cpc ? formatCurrency(insight.cpc) : "N/A",
        reach: parseInt(insight.reach || 0),
        frequency: insight.frequency ? parseFloat(insight.frequency).toFixed(2) : "0",
        targeting_summary: as.targeting
          ? {
              age_min: as.targeting.age_min,
              age_max: as.targeting.age_max,
              genders: as.targeting.genders,
              geo: as.targeting.geo_locations?.countries,
            }
          : null,
      };
    });

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── TOOL: Get individual ads performance ──
server.tool(
  "meta_ads",
  "Get individual ads performance with creative details",
  {
    campaign_id: z.string().optional().describe("Filter by campaign ID"),
    adset_id: z.string().optional().describe("Filter by ad set ID"),
    date_preset: z
      .enum(["today", "yesterday", "last_7d", "last_14d", "last_30d"])
      .optional(),
    status_filter: z.enum(["ACTIVE", "PAUSED", "ALL"]).optional(),
  },
  async ({ campaign_id, adset_id, date_preset, status_filter }) => {
    const endpoint = adset_id
      ? `/${adset_id}/ads`
      : campaign_id
        ? `/${campaign_id}/ads`
        : `/${AD_ACCOUNT_ID}/ads`;

    const params = {
      fields: "name,status,creative{title,body,image_url,thumbnail_url,video_id,call_to_action_type,object_story_spec}",
      limit: 50,
    };

    if (status_filter && status_filter !== "ALL") {
      params.filtering = JSON.stringify([
        { field: "effective_status", operator: "IN", value: [status_filter] },
      ]);
    }

    const ads = await metaApi(endpoint, params);

    // Get insights
    const insightLevel = adset_id || campaign_id || AD_ACCOUNT_ID;
    const insights = await metaApi(`/${insightLevel}/insights`, {
      fields:
        "ad_name,ad_id,spend,impressions,clicks,ctr,cpc,cpm,reach,actions,cost_per_action_type",
      level: "ad",
      date_preset: date_preset || "last_7d",
      limit: 50,
    });

    const insightsMap = {};
    for (const i of insights.data || []) {
      insightsMap[i.ad_id] = i;
    }

    const result = (ads.data || []).map((ad) => {
      const insight = insightsMap[ad.id] || {};
      return {
        name: ad.name,
        id: ad.id,
        status: ad.status,
        creative_title: ad.creative?.title,
        creative_body: ad.creative?.body?.substring(0, 150),
        cta: ad.creative?.call_to_action_type,
        spend: insight.spend ? formatCurrency(insight.spend) : "0.00 EUR",
        impressions: parseInt(insight.impressions || 0),
        clicks: parseInt(insight.clicks || 0),
        ctr: insight.ctr ? `${parseFloat(insight.ctr).toFixed(2)}%` : "0%",
        cpc: insight.cpc ? formatCurrency(insight.cpc) : "N/A",
        reach: parseInt(insight.reach || 0),
      };
    });

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── TOOL: Update campaign budget ──
server.tool(
  "meta_update_campaign_budget",
  "Update the daily or lifetime budget of a campaign",
  {
    campaign_id: z.string().describe("Campaign ID to update"),
    daily_budget: z.number().optional().describe("New daily budget in euros (e.g. 15.00)"),
    lifetime_budget: z.number().optional().describe("New lifetime budget in euros"),
    status: z.enum(["ACTIVE", "PAUSED"]).optional().describe("Change campaign status"),
  },
  async ({ campaign_id, daily_budget, lifetime_budget, status }) => {
    const params = {};
    if (daily_budget !== undefined) params.daily_budget = Math.round(daily_budget * 100);
    if (lifetime_budget !== undefined) params.lifetime_budget = Math.round(lifetime_budget * 100);
    if (status) params.status = status;

    const url = new URL(`${META_BASE_URL}/${campaign_id}`);
    url.searchParams.set("access_token", ACCESS_TOKEN);
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }

    const res = await fetch(url.toString(), { method: "POST" });
    const data = await res.json();

    if (data.error) {
      return {
        content: [{ type: "text", text: `Error: ${data.error.message}` }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Campaign ${campaign_id} updated successfully. Changes: ${JSON.stringify(params)}`,
        },
      ],
    };
  }
);

// ── TOOL: Update ad set ──
server.tool(
  "meta_update_adset",
  "Update an ad set: budget, status, bid",
  {
    adset_id: z.string().describe("Ad set ID to update"),
    daily_budget: z.number().optional().describe("New daily budget in euros"),
    status: z.enum(["ACTIVE", "PAUSED"]).optional().describe("Change ad set status"),
    bid_amount: z.number().optional().describe("New bid amount in euros"),
  },
  async ({ adset_id, daily_budget, status, bid_amount }) => {
    const params = {};
    if (daily_budget !== undefined) params.daily_budget = Math.round(daily_budget * 100);
    if (status) params.status = status;
    if (bid_amount !== undefined) params.bid_amount = Math.round(bid_amount * 100);

    const url = new URL(`${META_BASE_URL}/${adset_id}`);
    url.searchParams.set("access_token", ACCESS_TOKEN);
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }

    const res = await fetch(url.toString(), { method: "POST" });
    const data = await res.json();

    if (data.error) {
      return {
        content: [{ type: "text", text: `Error: ${data.error.message}` }],
        isError: true,
      };
    }

    return {
      content: [
        { type: "text", text: `Ad set ${adset_id} updated. Changes: ${JSON.stringify(params)}` },
      ],
    };
  }
);

// ── TOOL: Update ad status ──
server.tool(
  "meta_update_ad_status",
  "Pause or activate a specific ad",
  {
    ad_id: z.string().describe("Ad ID"),
    status: z.enum(["ACTIVE", "PAUSED"]).describe("New status"),
  },
  async ({ ad_id, status }) => {
    const url = new URL(`${META_BASE_URL}/${ad_id}`);
    url.searchParams.set("access_token", ACCESS_TOKEN);
    url.searchParams.set("status", status);

    const res = await fetch(url.toString(), { method: "POST" });
    const data = await res.json();

    if (data.error) {
      return {
        content: [{ type: "text", text: `Error: ${data.error.message}` }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: `Ad ${ad_id} is now ${status}` }],
    };
  }
);

// ── TOOL: Get daily breakdown ──
server.tool(
  "meta_daily_breakdown",
  "Get day-by-day performance breakdown for trend analysis",
  {
    campaign_id: z.string().optional().describe("Campaign ID (optional, default: all)"),
    date_preset: z
      .enum(["last_7d", "last_14d", "last_30d", "this_month", "last_month"])
      .optional()
      .describe("Date range (default: last_7d)"),
  },
  async ({ campaign_id, date_preset }) => {
    const endpoint = campaign_id ? `/${campaign_id}/insights` : `/${AD_ACCOUNT_ID}/insights`;

    const insights = await metaApi(endpoint, {
      fields: "spend,impressions,clicks,ctr,cpc,cpm,reach,actions,cost_per_action_type",
      date_preset: date_preset || "last_7d",
      time_increment: 1,
      level: "account",
      limit: 90,
    });

    const result = (insights.data || []).map((day) => {
      const purchases = (day.actions || []).find(
        (a) => a.action_type === "purchase" || a.action_type === "omni_purchase"
      )?.value || 0;
      const leads = (day.actions || []).find((a) => a.action_type === "lead")?.value || 0;
      const linkClicks = (day.actions || []).find(
        (a) => a.action_type === "link_click"
      )?.value || 0;

      return {
        date: day.date_start,
        spend: formatCurrency(day.spend),
        impressions: parseInt(day.impressions || 0),
        reach: parseInt(day.reach || 0),
        clicks: parseInt(day.clicks || 0),
        link_clicks: parseInt(linkClicks),
        ctr: `${parseFloat(day.ctr || 0).toFixed(2)}%`,
        cpc: day.cpc ? formatCurrency(day.cpc) : "N/A",
        cpm: day.cpm ? formatCurrency(day.cpm) : "N/A",
        leads: parseInt(leads),
        purchases: parseInt(purchases),
      };
    });

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── TOOL: Get audience demographics ──
server.tool(
  "meta_audience_insights",
  "Get audience breakdown by age, gender, country, or device",
  {
    campaign_id: z.string().optional(),
    breakdown: z
      .enum(["age", "gender", "country", "device_platform", "publisher_platform"])
      .describe("Dimension to break down by"),
    date_preset: z.enum(["last_7d", "last_14d", "last_30d"]).optional(),
  },
  async ({ campaign_id, breakdown, date_preset }) => {
    const endpoint = campaign_id ? `/${campaign_id}/insights` : `/${AD_ACCOUNT_ID}/insights`;

    const insights = await metaApi(endpoint, {
      fields: "spend,impressions,clicks,ctr,cpc,reach,actions,cost_per_action_type",
      date_preset: date_preset || "last_7d",
      breakdowns: breakdown,
      level: "account",
      limit: 50,
    });

    const result = (insights.data || []).map((row) => ({
      [breakdown]: row[breakdown],
      spend: formatCurrency(row.spend),
      impressions: parseInt(row.impressions || 0),
      clicks: parseInt(row.clicks || 0),
      ctr: `${parseFloat(row.ctr || 0).toFixed(2)}%`,
      cpc: row.cpc ? formatCurrency(row.cpc) : "N/A",
      reach: parseInt(row.reach || 0),
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ═══════════════════════════════════
// START SERVER
// ═══════════════════════════════════

const transport = new StdioServerTransport();
await server.connect(transport);
