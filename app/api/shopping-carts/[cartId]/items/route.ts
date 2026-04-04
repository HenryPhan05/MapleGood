import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { cartService } from "@/lib/services/cart.service";

type Ctx = { params: Promise<{ cartId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { cartId } = await ctx.params;
    const id = parseIdParam(cartId, "cart id");
    const data = await cartService.getCartById(id);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { cartId } = await ctx.params;
    const id = parseIdParam(cartId, "cart id");
    const body = await readJson<{
      customerID: number;
      productID: number;
      quantity?: number;
    }>(req);
    if (
      body.customerID === undefined ||
      body.productID === undefined
    ) {
      return NextResponse.json(
        { error: "customerID and productID are required" },
        { status: 400 }
      );
    }
    const data = await cartService.addItem(
      id,
      body.customerID,
      body.productID,
      body.quantity ?? 1
    );
    return jsonOk(data, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
