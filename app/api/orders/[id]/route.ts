import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { orderService } from "@/lib/services/order.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const orderID = parseIdParam(id, "order id");
    const data = await orderService.getById(orderID);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const orderID = parseIdParam(id, "order id");
    const body = await readJson<{ orderStatus: string }>(req);
    if (!body.orderStatus) {
      return NextResponse.json(
        { error: "orderStatus is required" },
        { status: 400 }
      );
    }
    const data = await orderService.updateStatus(orderID, body.orderStatus);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const orderID = parseIdParam(id, "order id");
    await orderService.softDelete(orderID);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return handleRouteError(e);
  }
}
