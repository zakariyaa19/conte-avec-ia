/**
 * WebViewBanner removed — we no longer ask users to leave the WebView.
 * Instead, we made everything work inside the WebView:
 * - safeStorage.ts handles sessionStorage/localStorage fallback
 * - Google OAuth is hidden (it's blocked by Google in WebViews)
 * - Stripe redirect uses window.location.href (works in WebView)
 * - Fallback retry if redirect fails
 *
 * This file exports a no-op component so existing imports don't break.
 */
export const WebViewBanner: React.FC = () => null;
