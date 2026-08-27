import { Context } from "hono";
import cloudinary from "../configs/cloudinary";
export async function getMusicSignature(c: Context) {
  const timestamp = Math.floor(Date.now() / 1000);

  const folder = "melodia/music";

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return c.json({
    success: true,
    data: {
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    },
  });
}
