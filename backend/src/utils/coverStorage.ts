import { uploadCoverToCloudinary } from './cloudinaryService';

export async function saveCoverImage(base64Data: string): Promise<{ url: string }> {
  // Strip data URI prefix if present (e.g. "data:image/png;base64,")
  const raw = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  const buffer = Buffer.from(raw, 'base64');

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const publicId = `cover-${uniqueSuffix}`;

  const url = await uploadCoverToCloudinary(buffer, publicId);
  return { url };
}
