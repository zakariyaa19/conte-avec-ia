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
