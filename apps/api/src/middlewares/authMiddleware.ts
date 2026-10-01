import type { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import { verify, sign } from "hono/jwt";
import { and, eq } from "drizzle-orm";

import { env } from "../env";

import {
  clearAuthCookies,
  setAuthCookies,
  FIFTEEN_MINUTES_SECONDS,
} from "../utils/cookies";

import { db } from "../configs";
import { sessions, users } from "../configs/schema";

export async function requireAuth(c: Context, next: Next) {
  try {
    const accessToken = await getSignedCookie(
      c,
      env.COOKIE_SECRET,
      "accessToken",
    );

    const refreshToken = await getSignedCookie(
      c,
      env.COOKIE_SECRET,
      "refreshToken",
    );

    console.log("AUTH DEBUG");
    console.log("accessToken exists:", !!accessToken);
    console.log("refreshToken exists:", !!refreshToken);

    // 1. Access token
    if (accessToken) {
      try {
        const payload = await verify(
          accessToken,
          env.JWT_ACCESS_SECRET,
          "HS256",
        );

        console.log("ACCESS PAYLOAD:", payload);

        const userId = payload.id as string;

        if (!userId) {
          return clearAuthCookies(c);
        }

        c.set("userId", {
          id: userId,
        });

        return next();
      } catch (error) {
        console.log("Access token expired/invalid:", error);
      }
    }

    // 2. Refresh token
    if (!refreshToken) {
      return clearAuthCookies(c);
    }

    let refreshPayload;

    try {
      refreshPayload = await verify(
        refreshToken,
        env.JWT_REFRESH_SECRET,
        "HS256",
      );
    } catch {
      console.log("Refresh token expired/invalid");
      return clearAuthCookies(c);
    }

    const userId = refreshPayload.id as string;

    if (!userId) {
      return clearAuthCookies(c);
    }

    // 3. Check session
    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.refreshToken, refreshToken),
          eq(sessions.userId, userId),
        ),
      )
      .limit(1);

    if (!session) {
      console.log("Refresh token not found in database");
      return clearAuthCookies(c);
    }

    if (session.expiresAt < new Date()) {
      console.log("Refresh token expired in database");
      return clearAuthCookies(c);
    }

    // 4. Check user exists
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return clearAuthCookies(c);
    }

    // 5. Generate new access token
    const newAccessToken = await sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + FIFTEEN_MINUTES_SECONDS,
      },
      env.JWT_ACCESS_SECRET,
    );

    // 6. Set new access cookie
    await setAuthCookies(c, newAccessToken, refreshToken);

    c.set("userId", {
      id: user.id,
    });

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return clearAuthCookies(c);
  }
}
