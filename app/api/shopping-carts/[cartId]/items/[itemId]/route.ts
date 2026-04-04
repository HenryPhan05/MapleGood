import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { cartService } from "@/lib/services/cart.service";

type Ctx = { params: Promise<{ cartId: string; itemId: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { cartId, itemId } = await ctx.params;
    const cartID = parseIdParam(cartId, "cart id");
    const cartItemID = parseIdParam(itemId, "cart item id");
    const body = await readJson<{ customerID: number; quantity: number }>(req);
    if (body.customerID === undefined || body.quantity === undefined) {
      return NextResponse.json(
        { error: "customerID and quantity are required" },
        { status: 400 }
      );
    }
    const data = await cartService.setItemQuantity(
      cartID,
      body.customerID,
      cartItemID,
      body.quantity
    );
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const { cartId, itemId } = await ctx.params;
    const cartID = parseIdParam(cartId, "cart id");
    const cartItemID = parseIdParam(itemId, "cart item id");
    const { searchParams } = new URL(req.url);
    const customerID = parseIdParam(
      searchParams.get("customerId") ?? undefined,
      "customer id"
    );
    const data = await cartService.removeItem(
      cartID,
      customerID,
      cartItemID
    );
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}
