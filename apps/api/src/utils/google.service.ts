import { google } from "googleapis";
import { env } from "../env";

export const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.Backend_url}/auth/google/callback`,
);

export const getGoogleAuthUrl = (redirectTo?: string) => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
  });
};
