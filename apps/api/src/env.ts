import { z } from "zod";
import "dotenv/config";

export const envSchema = z.object({
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  DATABASE_URL: z.string(),
  FRONTEND_URL: z.string(),
  BACKEND_URL: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
