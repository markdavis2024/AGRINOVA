import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
  "audio/webm",
  "audio/mp3",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
];

// Profile photo settings
const PROFILE_MAX_WIDTH = 500;
const PROFILE_MAX_HEIGHT = 500;
const PROFILE_QUALITY = 80;

export async function saveUpload(
  file: File,
  folder: string,
  options?: { resize?: boolean; maxWidth?: number; maxHeight?: number }
): Promise<string> {
  try {
    if (!file || !file.name) {
      throw new UploadError("No file provided.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new UploadError(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new UploadError("Only JPG, PNG, WebP, PDF, and audio files are allowed.");
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const extension = file.name.split(".").pop() ||
      (file.type.startsWith("audio/") ? "webm" : "jpg");
    let filename = `${timestamp}-${random}.${extension}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // Handle image resizing for profile photos
    if (
      folder === "profiles" &&
      file.type.startsWith("image/") &&
      options?.resize !== false
    ) {
      try {
        const maxWidth = options?.maxWidth || PROFILE_MAX_WIDTH;
        const maxHeight = options?.maxHeight || PROFILE_MAX_HEIGHT;

        const image = sharp(buffer);
        const metadata = await image.metadata();

        if (
          (metadata.width && metadata.width > maxWidth) ||
          (metadata.height && metadata.height > maxHeight)
        ) {
          buffer = await image
            .resize(maxWidth, maxHeight, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality: PROFILE_QUALITY })
            .toBuffer();

          filename = `${timestamp}-${random}.jpg`;
        }
      } catch (sharpError) {
        console.warn("Image processing failed, using original:", sharpError);
      }
    }

    await writeFile(path.join(uploadDir, filename), buffer);

    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    if (error instanceof UploadError) {
      throw error;
    }
    console.error("Upload error:", error);
    throw new UploadError("Failed to save file. Please try again.");
  }
}