import type { Context } from "hono";
import crypto from "node:crypto";
import { db } from "../configs";
import { apiKeys } from "../configs/schema";
import { hashApiKey } from "../utils/hmac";
import { desc, eq, and } from "drizzle-orm";

export async function generateApiKey(c: Context) {
  try {
    const userId = c.get("userId");

    if (!userId) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
          data: null,
        },
        401,
      );
    }

    const { name } = await c.req.json();

    if (!name?.trim()) {
      return c.json(
        {
          success: false,
          message: "API key name is required",
          data: null,
        },
        400,
      );
    }

    const apiKey = `mel_${crypto.randomBytes(32).toString("hex")}`;

    const keyHash = hashApiKey(apiKey);

    const [newApiKey] = await db
      .insert(apiKeys)
      .values({
        userId,
        name: name.trim(),
        keyHash,
      })
      .returning({
        id: apiKeys.id,
        name: apiKeys.name,
        createdAt: apiKeys.createdAt,
      });

    return c.json({
      success: true,
      message: "API key generated successfully",
      data: { name: name.trim(), apiKey: keyHash },
    });
  } catch (error) {
    console.error("Generate API key error:", error);

    return c.json(
      {
        success: false,
        message: "Could not generate API key",
        data: null,
      },
      500,
    );
  }
}

export async function getMyApiKeys(c: Context) {
  try {
    const userId = c.get("userId");
    if (!userId) {
      return c.json(
        { success: false, message: "Unauthorized", data: null },
        401,
      );
    }
    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        active: apiKeys.active,
        apiKey: apiKeys.keyHash,
        createdAt: apiKeys.createdAt,
        lastUsedAt: apiKeys.lastUsedAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .orderBy(desc(apiKeys.createdAt));

    return c.json({
      success: true,
      message: "API keys fetched successfully",
      data: keys,
    });
  } catch (error) {
    console.error("Get API keys error:", error);
    return c.json(
      { success: false, message: "Could not get API keys", data: error },
      500,
    );
  }
}

export async function deleteApiKey(c: Context) {
  try {
    const userId = c.get("userId");
    const keyId = c.req.param("id");

    if (!userId) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
          data: null,
        },
        401,
      );
    }

    if (!keyId) {
      return c.json(
        {
          success: false,
          message: "API key ID is required",
          data: null,
        },
        400,
      );
    }

    const [deletedKey] = await db
      .delete(apiKeys)
      .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)))
      .returning({
        id: apiKeys.id,
      });

    if (!deletedKey) {
      return c.json(
        {
          success: false,
          message: "API key not found",
          data: null,
        },
        404,
      );
    }

    return c.json({
      success: true,
      message: "API key deleted successfully",
      data: deletedKey,
    });
  } catch (error) {
    console.error("Delete API key error:", error);

    return c.json(
      {
        success: false,
        message: "Could not delete API key",
        data: null,
      },
      500,
    );
  }
}
