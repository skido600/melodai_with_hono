import type { Context, Next } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../configs";
import { apiKeys } from "../configs/schema";
import { hashApiKey } from "../utils/hmac";

export async function requireApiKey(c: Context, next: Next) {
  try {
    const apiKey = c.req.header("x-api-key");

    if (!apiKey) {
      return c.json(
        {
          success: false,
          message: "API key is required",
          data: null,
        },
        401,
      );
    }

    const [key] = await db
      .select({
        id: apiKeys.id,
        userId: apiKeys.userId,
        active: apiKeys.active,
      })
      .from(apiKeys)
      .where(eq(apiKeys.keyHash, apiKey))
      .limit(1);

    if (!key) {
      return c.json(
        {
          success: false,
          message: "Invalid API key",
          data: null,
        },
        401,
      );
    }

    if (!key.active) {
      return c.json(
        {
          success: false,
          message: "API key has been revoked",
          data: null,
        },
        401,
      );
    }

    c.set("apiKeyId", key.id);
    c.set("apiUserId", key.userId);

    await next();
  } catch (error) {
    console.error("API key middleware error:", error);

    return c.json(
      {
        success: false,
        message: "Could not verify API key",
        data: null,
      },
      500,
    );
  }
}
