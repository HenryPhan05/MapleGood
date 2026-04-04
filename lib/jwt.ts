import jwt from "jsonwebtoken";

import { HttpError } from "@/lib/http-error";

export const AUTH_COOKIE_NAME = "maplegood_token";

export type JwtUserPayload = {
  customerID: number;
  email: string;
  role: string;
};

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) {
    throw new Error("JWT_SECRET is not set");
  }
  return s;
}

export function signAccessToken(p: JwtUserPayload): string {
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
  return jwt.sign(
    { sub: String(p.customerID), email: p.email, role: p.role },
    getSecret(),
    {
      expiresIn,
      algorithm: "HS256",
    } as jwt.SignOptions
  );
}

export function verifyAccessToken(token: string): JwtUserPayload {
  try {
    const decoded = jwt.verify(token, getSecret()) as jwt.JwtPayload;
    const customerID = Number(decoded.sub);
    if (!Number.isInteger(customerID) || customerID <= 0) {
      throw new HttpError(401, "Invalid session");
    }
    const { email, role } = decoded;
    if (typeof email !== "string" || typeof role !== "string") {
      throw new HttpError(401, "Invalid session");
    }
    return { customerID, email, role };
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(401, "Invalid or expired session");
  }
}

export function getTokenFromRequest(req: Request): string | undefined {
  const raw = req.headers.get("cookie");
  if (!raw) return;

  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key === AUTH_COOKIE_NAME) {
      try {
        return decodeURIComponent(val);
      } catch {
        return val;
      }
    }
  }
}

export function authCookieMaxAgeSeconds(): number {
  const raw = process.env.JWT_EXPIRES_IN;
  if (!raw) return 60 * 60 * 24 * 7;
  const m = /^(\d+)([dhms])$/i.exec(raw.trim());
  if (!m) return 60 * 60 * 24 * 7;
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  if (u === "d") return n * 86400;
  if (u === "h") return n * 3600;
  if (u === "m") return n * 60;
  return n;
}
