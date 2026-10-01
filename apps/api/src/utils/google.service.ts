import { google } from "googleapis";
import { env } from "../env";
const GOOGLE_CALLBACK_URL = `${env.FRONTEND_URL}/api/auth/google/callback`;
console.log("GOOGLE_CALLBACK_URL", GOOGLE_CALLBACK_URL);
export const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
);

// export const getGoogleAuthUrl = (redirectTo?: string) => {
//   return oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: ["openid", "email", "profile"],
//   });
// };
export const getGoogleAuthUrl = (redirectTo?: string) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
  });

  console.log("GOOGLE OAUTH URL:", url);
  console.log(
    "GOOGLE REDIRECT URI:",
    `${env.BACKEND_URL}/auth/google/callback`,
  );

  return url;
};
