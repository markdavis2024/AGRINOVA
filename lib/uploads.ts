import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export class UploadError extends Error {}

/**
 * Saves an uploaded File to public/uploads/<folder>/ with a random
 * filename and returns the public URL to store on the User row.
 *
 * NOTE: this stores files on local disk, which works for local dev
 * and a single-server deployment but not for serverless platforms
 * with an ephemeral filesystem (e.g. Vercel). Swap this for S3 /
 * Supabase Storage / Cloudinary before deploying there.
 */
export async function saveUpload(file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadError(
      "Only JPG, PNG, WEBP or PDF files are accepted."
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new UploadError("Files must be under 5MB.");
  }

  const extension = file.type === "application/pdf" ? "pdf" : file.type.split("/")[1];
  const filename = `${randomUUID()}.${extension}`;
  const folderPath = path.join(UPLOAD_ROOT, folder);

  await mkdir(folderPath, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(folderPath, filename), bytes);

  return `/uploads/${folder}/${filename}`;
}
