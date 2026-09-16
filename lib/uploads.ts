import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOC_TYPES = ["application/pdf"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;  // 5MB
const MAX_DOC_BYTES   = 10 * 1024 * 1024; // 10MB

export interface SavedFile {
  url: string;      // public path e.g. /uploads/profiles/abc.jpg
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Save an uploaded file to /public/uploads/<folder>/<uuid>.<ext>
 * - Images are re-encoded with sharp → compressed JPEG
 * - PDFs are saved as-is
 * - Everything else is rejected
 */
export async function saveUpload(
  file: File,
  folder: string
): Promise<SavedFile> {
  if (!file || file.size === 0) {
    throw new Error("Empty file");
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isPdf = ALLOWED_DOC_TYPES.includes(file.type);

  if (!isImage && !isPdf) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  const max = isImage ? MAX_IMAGE_BYTES : MAX_DOC_BYTES;
  if (file.size > max) {
    throw new Error(`File too large (max ${max / 1024 / 1024}MB)`);
  }

  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });

  const id = randomUUID();
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  let outputBuffer: Buffer;
  let ext: string;

  if (isImage) {
    outputBuffer = await sharp(inputBuffer)
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    ext = "jpg";
  } else {
    outputBuffer = inputBuffer;
    ext = "pdf";
  }

  const filename = `${id}.${ext}`;
  const fullPath = path.join(dir, filename);
  await writeFile(fullPath, outputBuffer);

  return {
    url: `/uploads/${folder}/${filename}`,
    filename,
    size: outputBuffer.length,
    mimeType: isImage ? "image/jpeg" : "application/pdf",
  };
}

/**
 * Save multiple files, returns array of saved metadata.
 * Silently skips null/undefined files.
 */
export async function saveUploads(
  files: { key: string; file: File | null }[],
  folder: string
): Promise<Record<string, SavedFile>> {
  const out: Record<string, SavedFile> = {};
  for (const { key, file } of files) {
    if (!file || file.size === 0) continue;
    out[key] = await saveUpload(file, folder);
  }
  return out;
}