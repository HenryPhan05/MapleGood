import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parsePagination } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { customerService } from "@/lib/services/customer.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const { limit, offset } = parsePagination(searchParams);
    const data = await customerService.list(limit, offset);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await readJson<{
      firstName: string;
      lastName: string;
      email: string;
      phone?: string | null;
      password: string;
      address?: string | null;
      city?: string | null;
      province?: string | null;
      postalCode?: string | null;
      country?: string | null;
    }>(req);
    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return NextResponse.json(
        { error: "firstName, lastName, email, password are required" },
        { status: 400 }
      );
    }
    const created = await customerService.create(body);
    return jsonOk(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
