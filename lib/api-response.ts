import { NextResponse } from "next/server";

import { HttpError } from "@/lib/http-error";

export function jsonOk<T>(data: T, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(data, { status, headers });
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(e: unknown) {
  if (e instanceof HttpError) {
    return jsonError(e.message, e.status);
  }

  console.error("Unhandled route error:", e);

  if (typeof e === "object" && e !== null && "code" in e) {
    const dbError = e as { code: string; message?: string };

    switch (dbError.code) {
      case "ER_NO_SUCH_TABLE":
      case "ER_BAD_FIELD_ERROR":
      case "ER_PARSE_ERROR":
        return jsonError("Service temporarily unavailable", 503);
      case "ER_ACCESS_DENIED_ERROR":
      case "ER_DBACCESS_DENIED_ERROR":
        return jsonError("Service temporarily unavailable", 503);
      case "ECONNREFUSED":
      case "ETIMEDOUT":
        return jsonError("Service temporarily unavailable", 503);
      default:
        break;
    }
  }
  
  return jsonError("Internal Server Error", 500);
}
