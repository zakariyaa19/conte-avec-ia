import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadStream(buffer: Buffer, options: Record<string, any>): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result as { secure_url: string; public_id: string });
    });
    Readable.from(buffer).pipe(stream);
  });
}

export async function uploadPdfToCloudinary(buffer: Buffer, publicId: string): Promise<string> {
  const result = await uploadStream(buffer, {
    resource_type: 'raw',
    folder: 'conte-ia/pdfs',
    public_id: publicId,
    overwrite: true,
  });
  console.log(`[Cloudinary] PDF uploaded: ${result.public_id} (${buffer.length} bytes)`);
  return result.secure_url;
}

export async function uploadCoverToCloudinary(buffer: Buffer, publicId: string): Promise<string> {
  const result = await uploadStream(buffer, {
    resource_type: 'image',
    folder: 'conte-ia/covers',
    public_id: publicId,
    overwrite: true,
  });
  console.log(`[Cloudinary] Cover uploaded: ${result.public_id} (${buffer.length} bytes)`);
  return result.secure_url;
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'raw' | 'image' = 'raw'): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`[Cloudinary] Deleted: ${publicId}`);
  } catch (err: any) {
    console.warn(`[Cloudinary] Delete failed for ${publicId}:`, err.message);
  }
}

export function isCloudinaryUrl(url: string | null | undefined): boolean {
  return !!url && url.startsWith('http');
}

// Extrait le public_id + resource_type depuis une secure_url Cloudinary
// (le public_id n'est jamais stocke tel quel en base, seule l'URL l'est).
// Format : https://res.cloudinary.com/<cloud>/<resource_type>/upload/v<version>/<public_id>[.<ext>]
export function extractPublicIdFromUrl(url: string | null | undefined): { publicId: string; resourceType: 'image' | 'raw' } | null {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    const match = url.match(/res\.cloudinary\.com\/[^/]+\/(image|raw)\/upload\/v\d+\/(.+)$/);
    if (!match) return null;
    const resourceType = match[1] as 'image' | 'raw';
    let publicId = match[2];
    // Retirer l'extension finale (ex: .png) uniquement pour les images —
    // les fichiers raw (PDF) gardent leur public_id tel quel, sans extension ajoutee.
    if (resourceType === 'image') {
      publicId = publicId.replace(/\.[a-zA-Z0-9]+$/, '');
    }
    return { publicId, resourceType };
  } catch {
    return null;
  }
}

// Supprime tous les assets Cloudinary associes a une commande (couverture,
// illustrations, PDF). Best-effort : chaque suppression individuelle est
// deja tolerante aux erreurs (voir deleteFromCloudinary), donc un asset deja
// absent ou une URL non-Cloudinary n'interrompt pas les autres.
export async function deleteOrderCloudinaryAssets(order: {
  coverImageUrl?: string | null;
  pdfUrl?: string | null;
  illustrationUrlsJson?: string | null;
}): Promise<{ attempted: number; deleted: number }> {
  const urls: string[] = [];
  if (order.coverImageUrl) urls.push(order.coverImageUrl);
  if (order.pdfUrl) urls.push(order.pdfUrl);
  if (order.illustrationUrlsJson) {
    try {
      const illustrations = JSON.parse(order.illustrationUrlsJson);
      if (Array.isArray(illustrations)) urls.push(...illustrations.filter((u) => typeof u === 'string'));
    } catch { /* ignore parse errors */ }
  }

  let deleted = 0;
  for (const url of urls) {
    const parsed = extractPublicIdFromUrl(url);
    if (!parsed) continue;
    await deleteFromCloudinary(parsed.publicId, parsed.resourceType);
    deleted++;
  }
  return { attempted: urls.length, deleted };
}
