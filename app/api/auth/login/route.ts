import { NextResponse } from "next/server";

import { setAuthCookie } from "@/lib/auth-cookie";
import { handleRouteError } from "@/lib/api-response";
import { HttpError } from "@/lib/http-error";
import { signAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/logger";
import { readJson } from "@/lib/read-json";
import { checkRateLimit, getClientIP } from "@/lib/security";
import { customerService } from "@/lib/services/customer.service";

export async function POST(req: Request) {
  const clientIP = getClientIP(req);

  try {
    const rateLimitKey = `login:${clientIP || "unknown"}`;
    const rateLimit = checkRateLimit(rateLimitKey, 5, 60000);

    if (!rateLimit.allowed) {
      logger.security.suspiciousActivity("Rate limit exceeded for login", {
        ip: clientIP,
        resetTime: new Date(rateLimit.resetTime).toISOString(),
      });
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetTime.toString(),
          },
        }
      );
    }

    const body = await readJson<{
      email: string;
      password: string;
    }>(req);

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const customer = await customerService.authenticate(
      body.email,
      body.password
    );

    logger.info("Successful login", {
      customerID: customer.customerID,
      ip: clientIP,
    });

    const token = signAccessToken({
      customerID: customer.customerID,
      email: customer.email,
      role: String(customer.role ?? "CUSTOMER"),
    });

    const res = NextResponse.json(
      {
        message: "Login successful",
        customer,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );
    setAuthCookie(res, token);
    return res;
  } catch (e) {
    if (e instanceof HttpError && e.status === 401) {
      logger.security.authFailure("invalid_credentials", clientIP);
    }
    return handleRouteError(e);
  }
}
