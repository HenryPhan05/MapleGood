import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { customerService } from "@/lib/services/customer.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const customerID = parseIdParam(id, "customer id");
    const data = await customerService.getById(customerID);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const customerID = parseIdParam(id, "customer id");
    const body = await readJson<{
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      address?: string | null;
      city?: string | null;
      province?: string | null;
      postalCode?: string | null;
      country?: string | null;
      password?: string;
    }>(req);
    const data = await customerService.update(customerID, body);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const customerID = parseIdParam(id, "customer id");
    await customerService.softDelete(customerID);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return handleRouteError(e);
  }
}
