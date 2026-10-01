import { Context } from "hono";
import { google } from "googleapis";
import { getGoogleAuthUrl, oauth2Client } from "../utils/google.service";
import { generateTokens } from "../utils/auth_token";

import { getCookie, getSignedCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import { sessions, users } from "../configs/schema";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { db } from "../configs";
import { env } from "../env";

export class AuthController {
  static async googleUrl(c: Context) {
    const body = await c.req.json().catch(() => ({}));

    const url = getGoogleAuthUrl(body.redirectTo);

    return c.json({
      success: true,
      url,
    });
  }
  static async googleCallback(c: Context) {
    try {
      const code = c.req.query("code");

      if (!code) {
        return c.json(
          {
            message: "Missing google authorization code",
            data: null,
            success: false,
          },
          400,
        );
      }

      const { tokens } = await oauth2Client.getToken(code);

      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        version: "v2",
        auth: oauth2Client,
      });

      const { data } = await oauth2.userinfo.get();
      console.log("1 - Google callback");
      if (!data.email || !data.id) {
        return c.json(
          {
            message: "Invalid Google user data",
            data: null,
            success: false,
          },
          400,
        );
      }

      let user = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (!user) {
        const [newUser] = await db
          .insert(users)
          .values({
            providerId: data.id,
            name: data.name ?? data.email.split("@")[0],
            email: data.email,
            avatarUrl: data.picture,
            emailVerified: data.verified_email ?? false,
            emailVerifiedAt: data.verified_email ? new Date() : null,
            authMethod: "google",
          })
          .returning();

        user = newUser;
      }

      const { accessToken, refreshToken, refreshExpDate } =
        await generateTokens(user.id, user.email, user.name);

      await db.insert(sessions).values({
        userId: user.id,
        refreshToken,
        expiresAt: refreshExpDate,
      });

      await setAuthCookies(c, accessToken, refreshToken);
      const frontendurl = env.FRONTEND_URL;
      console.log(frontendurl, "frontend url");
      return c.redirect(`${frontendurl}/dashboard`, 302);
      // return c.json({
      //   success: true,
      //   message: "Google authentication successful",
      //   data: {
      //     accessToken: accessToken,
      //   },
      // });
    } catch (error) {
      console.error("Google authentication error:", error);
      return c.json(
        {
          success: false,
          message: "Google authentication failed",
          data: null,
        },
        500,
      );
    }
  }
  static async getMe(c: Context) {
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
      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return c.json(
          {
            success: false,
            message: "User not found",
            data: null,
          },
          404,
        );
      }

      return c.json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      console.error("Get me error:", error);

      return c.json(
        {
          success: false,
          message: "Could not get user",
          data: null,
        },
        500,
      );
    }
  }
  static async logout(c: Context) {
    try {
      const refreshToken = await getSignedCookie(
        c,
        env.COOKIE_SECRET,
        "refreshToken",
      );
      if (refreshToken) {
        await db
          .delete(sessions)
          .where(eq(sessions.refreshToken, refreshToken));
      }

      // Clear authentication cookies
      clearAuthCookies(c);
      return c.json({
        success: true,
        message: "Logged out successfully",
        data: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if DB deletion fails, don't leave the browser authenticated
      clearAuthCookies(c);

      return c.json(
        {
          success: false,
          message: "Could not logout",
          data: null,
        },
        500,
      );
    }
  }
}
