"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, User, Loader2 } from "lucide-react";

interface PhotoUploadProps {
  onPhotoSelect: (file: File, preview: string) => void;
  onPhotoRemove?: () => void;
  currentPhoto?: string | null;
  label?: string;
  required?: boolean;
  maxSize?: number;
}

export default function PhotoUpload({
  onPhotoSelect,
  onPhotoRemove,
  currentPhoto,
  label = "Profile Photo",
  required = false,
  maxSize = 10,
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }

    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Image size must be less than ${maxSize}MB.`);
      return;
    }

    setError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      onPhotoSelect(file, previewUrl);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onPhotoRemove) {
      onPhotoRemove();
    }
    setError(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="photo-upload">
      <label className="photo-upload-label">
        {label} {required && <span className="photo-required">*</span>}
      </label>

      <div className="photo-upload-container">
        {preview ? (
          <div className="photo-preview">
            <img
              src={preview}
              alt="Profile photo"
              className="photo-preview-image"
            />
            <div className="photo-preview-overlay">
              <button
                type="button"
                className="photo-preview-btn photo-change-btn"
                onClick={handleClick}
              >
                <Camera size={16} />
                Change
              </button>
              <button
                type="button"
                className="photo-preview-btn photo-remove-btn"
                onClick={handleRemove}
              >
                <X size={16} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="photo-upload-area" onClick={handleClick}>
            <div className="photo-upload-icon">
              <User size={48} className="photo-upload-user-icon" />
            </div>
            <div className="photo-upload-text">
              <Upload size={20} />
              <span>Tap to upload a photo</span>
              <small>JPG, PNG, WebP • Max {maxSize}MB</small>
            </div>
            {isUploading && (
              <div className="photo-upload-loading">
                <Loader2 size={24} className="spin" />
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          onChange={handleFileSelect}
          className="photo-upload-input"
          required={required && !preview}
        />
      </div>

      {error && (
        <div className="photo-error">
          <X size={16} />
          <span>{error}</span>
        </div>
      )}

      <style jsx>{`
        .photo-upload {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .photo-upload-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .photo-required {
          color: #ef4444;
        }

        .photo-upload-container {
          position: relative;
        }

        .photo-upload-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 32px;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: #f9fafb;
          min-height: 180px;
        }

        .photo-upload-area:hover {
          border-color: #059669;
          background: #ecfdf5;
        }

        .photo-upload-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photo-upload-user-icon {
          color: #9ca3af;
        }

        .photo-upload-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #6b7280;
        }

        .photo-upload-text span {
          font-size: 14px;
          font-weight: 500;
        }

        .photo-upload-text small {
          font-size: 12px;
          color: #9ca3af;
        }

        .photo-upload-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
        }

        .photo-preview {
          position: relative;
          width: 160px;
          height: 160px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
        }

        .photo-preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .photo-preview:hover .photo-preview-overlay {
          opacity: 1;
        }

        .photo-preview-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .photo-change-btn {
          background: white;
          color: #1f2937;
        }

        .photo-change-btn:hover {
          background: #f3f4f6;
        }

        .photo-remove-btn {
          background: #ef4444;
          color: white;
        }

        .photo-remove-btn:hover {
          background: #dc2626;
        }

        .photo-upload-input {
          display: none;
        }

        .photo-error {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #dc2626;
          font-size: 13px;
          padding: 8px 12px;
          background: #fef2f2;
          border-radius: 6px;
          border: 1px solid #fecaca;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}