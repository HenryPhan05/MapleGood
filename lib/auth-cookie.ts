import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, authCookieMaxAgeSeconds } from "@/lib/jwt";

const base = () =>
  ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  }) as const;

export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    ...base(),
    maxAge: authCookieMaxAgeSeconds(),
  });
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set(AUTH_COOKIE_NAME, "", {
    ...base(),
    maxAge: 0,
  });
}
