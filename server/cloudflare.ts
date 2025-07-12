import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'crypto';

// Cloudflare R2 configuration using S3-compatible API
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'timgrow';
const PUBLIC_URL_BASE = 'https://pub-602cc23a8f4ab34c83e1a455e0c3813e.r2.dev';

export interface UploadResult {
  url: string;
  key: string;
}

export class CloudflareImageService {
  /**
   * Upload an image to Cloudflare R2
   */
  async uploadImage(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadResult> {
    try {
      // Generate unique filename
      const fileExtension = originalName.split('.').pop() || 'jpg';
      const key = `services/${randomUUID()}.${fileExtension}`;
      
      const upload = new Upload({
        client: r2Client,
        params: {
          Bucket: BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
          CacheControl: 'public, max-age=31536000', // 1 year cache
        },
      });

      await upload.done();
      
      // Construct public URL
      const url = `${PUBLIC_URL_BASE}/${key}`;
      
      return { url, key };
    } catch (error) {
      console.error('Failed to upload image to Cloudflare R2:', error);
      throw new Error('Image upload failed');
    }
  }

  /**
   * Delete an image from Cloudflare R2
   */
  async deleteImage(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });
      
      await r2Client.send(command);
    } catch (error) {
      console.error('Failed to delete image from Cloudflare R2:', error);
      // Don't throw error for delete failures to avoid breaking the main flow
    }
  }

  /**
   * Extract key from Cloudflare URL
   */
  extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1); // Remove leading slash
    } catch {
      return null;
    }
  }
}

export const cloudflareService = new CloudflareImageService();