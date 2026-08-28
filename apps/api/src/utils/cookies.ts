import { setCookie, deleteCookie } from "hono/cookie";
import type { Context } from "hono";

const isProduction = process.env.NODE_ENV === "production";
export const FIFTEEN_MINUTES_SECONDS = 15 * 60;
export function setAuthCookies(
  c: Context,
  accessToken: string,
  refreshToken: string,
) {
  // setCookie(c, "accessToken", accessToken, {
  //   httpOnly: true,
  //   secure: isProduction,
  //   sameSite: "None"

  //   path: "/",
  //   maxAge: 15 * 60,
  // });
  setCookie(c, "accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "None",
    path: "/",
    maxAge: FIFTEEN_MINUTES_SECONDS,
  });

  // setCookie(c, "refreshToken", refreshToken, {
  //   httpOnly: true,
  //   secure: isProduction,
  //   sameSite: "None"

  //   path: "/",
  //   maxAge: 7 * 24 * 60 * 60,
  // });
  setCookie(c, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "None",

    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookies(c: Context) {
  deleteCookie(c, "accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "None",
    path: "/",
  });

  deleteCookie(c, "refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "None",
    path: "/",
  });
}
