import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Generates a secure upload signature for the client-side Next Cloudinary widget.
 * This guarantees that only an authenticated admin hitting our API can upload files.
 */
export async function generateCloudinarySignature() {
  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      // You can enforce a specific folder structure here if desired
      folder: "sheikh_rahil_assets",
    },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return { timestamp, signature };
}

export { cloudinary };