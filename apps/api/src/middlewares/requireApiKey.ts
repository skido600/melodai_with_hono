import type { Context, Next } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../configs";
import { apiKeys } from "../configs/schema";
import { decryptKey } from "../utils/hmac";

export async function requireApiKey(c: Context, next: Next) {
  try {
    // Accept:
    // x-api-key: melodia_xxxxx
    // Authorization: Bearer melodia_xxxxx

    const bearer = c.req.header("authorization")?.replace(/^Bearer\s+/i, "");

    const apiKey = c.req.header("x-api-key") ?? bearer;

    if (!apiKey || !apiKey.startsWith("melodia_")) {
      return c.json(
        {
          success: false,
          message: "Missing or invalid API key",
          data: null,
        },
        401,
      );
    }

    // Get active API keys
    const records = await db
      .select({
        id: apiKeys.id,
        userId: apiKeys.userId,
        active: apiKeys.active,
        encryptedKey: apiKeys.encryptedKey,
      })
      .from(apiKeys)
      .where(eq(apiKeys.active, true));

    // Decrypt and compare
    const record = records.find((record) => {
      try {
        const decryptedKey = decryptKey(record.encryptedKey);
        return decryptedKey === apiKey;
      } catch {
        return false;
      }
    });

    if (!record) {
      return c.json(
        {
          success: false,
          message: "Invalid API key",
          data: null,
        },
        401,
      );
    }

    // Update lastUsedAt without blocking the request
    db.update(apiKeys)
      .set({
        lastUsedAt: new Date(),
      })
      .where(eq(apiKeys.id, record.id))
      .catch((err) => {
        console.error("lastUsedAt update failed:", err);
      });

    // Make user available to handlers
    c.set("userId", {
      id: record.userId,
    });

    await next();
  } catch (error) {
    console.error("API key auth error:", error);

    return c.json(
      {
        success: false,
        message: "Authentication failed",
        data: null,
      },
      500,
    );
  }
}
