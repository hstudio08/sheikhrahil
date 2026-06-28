"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { CloudinaryImage } from "@/types";

interface ImageUploadProps {
  value: CloudinaryImage | null;
  onChange: (value: CloudinaryImage | null) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image" }: ImageUploadProps) {
  const onUpload = (result: any) => {
    if (result.event !== "success") return;
    
    const info = result.info;
    onChange({
      publicId: info.public_id,
      url: info.secure_url,
      width: info.width,
      height: info.height,
      format: info.format,
    });
  };

  // Force scroll unlock when the widget closes
  const handleClose = () => {
    document.body.style.overflow = "";
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">
        {label}
      </span>
      
      {value ? (
        <div className="relative rounded-sm overflow-hidden border border-border group w-fit">
          <Image
            src={value.url}
            alt="Uploaded preview"
            width={300}
            height={300}
            className="object-cover w-auto h-48"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange(null)}
              className="bg-white text-destructive p-2 rounded-sm hover:bg-red-50 transition-colors"
              title="Remove Image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            maxFiles: 1,
            resourceType: "image",
            clientAllowedFormats: ["jpeg", "jpg", "png", "webp"],
          }}
          onSuccess={onUpload}
          onClose={handleClose}
        >
          {({ open }) => {
            return (
              <button
                type="button"
                onClick={() => open?.()}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-sm hover:bg-white hover:border-primary/30 transition-all text-muted-foreground hover:text-primary"
              >
                <ImagePlus className="w-6 h-6 mb-2" />
                <span className="text-sm font-sans">Click to upload media</span>
              </button>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
}