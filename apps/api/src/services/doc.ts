import type { Context } from "hono";
import crypto from "node:crypto";
import { db } from "../configs";
import { apiKeys } from "../configs/schema";
import { encryptKey, decryptKey } from "../utils/hmac";
import { desc, eq, and } from "drizzle-orm";

export async function generateApiKey(c: Context) {
  try {
    const authUser = c.get("userId");

    if (!authUser?.id) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
          data: null,
        },
        401,
      );
    }

    const userId = authUser.id;

    const { name } = await c.req.json();

    const trimmedName = name?.trim();

    if (!trimmedName) {
      return c.json(
        {
          success: false,
          message: "API key name is required",
          data: null,
        },
        400,
      );
    }
    const existingKey = await db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(and(eq(apiKeys.userId, userId), eq(apiKeys.name, trimmedName)))
      .limit(1);
    if (existingKey.length > 0) {
      return c.json(
        {
          success: false,
          message: "You already have an API key with this name",
          data: null,
        },
        409,
      );
    }
    // Generate the actual API key
    const apiKey = `melodia_${crypto.randomBytes(32).toString("hex")}`;

    // Only store the hash in the database
    // Encrypt the API key before storing it
    const encryptedKey = encryptKey(apiKey);

    const [newApiKey] = await db
      .insert(apiKeys)
      .values({
        userId,
        name: name.trim(),
        encryptedKey,
      })
      .returning({
        id: apiKeys.id,
        name: apiKeys.name,
        createdAt: apiKeys.createdAt,
      });

    return c.json({
      success: true,
      message: "API key generated successfully",
      data: {
        id: newApiKey.id,
        name: newApiKey.name,
        apiKey, // return actual key only once
        createdAt: newApiKey.createdAt,
      },
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
    const authUser = c.get("userId");

    if (!authUser?.id) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
          data: null,
        },
        401,
      );
    }

    const userId = authUser.id;

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        active: apiKeys.active,
        createdAt: apiKeys.createdAt,
        lastUsedAt: apiKeys.lastUsedAt,
        encryptedKey: apiKeys.encryptedKey,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .orderBy(desc(apiKeys.createdAt));
    const decryptedKeys = keys.map((key) => ({
      id: key.id,
      name: key.name,
      apiKey: decryptKey(key.encryptedKey),
      active: key.active,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
    }));
    return c.json({
      success: true,
      message: "API keys fetched successfully",
      data: decryptedKeys,
    });
  } catch (error) {
    console.error("Get API keys error:", error);

    return c.json(
      {
        success: false,
        message: "Could not get API keys",
        data: null,
      },
      500,
    );
  }
}

export async function deleteApiKey(c: Context) {
  try {
    const authUser = c.get("userId");

    if (!authUser?.id) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
          data: null,
        },
        401,
      );
    }

    const userId = authUser.id;

    const keyId = c.req.param("id");

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
