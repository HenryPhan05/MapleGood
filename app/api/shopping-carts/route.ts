import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { cartService } from "@/lib/services/cart.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerIdRaw = searchParams.get("customerId");
    if (!customerIdRaw) {
      return NextResponse.json(
        { error: "customerId query parameter is required" },
        { status: 400 }
      );
    }
    const customerID = parseIdParam(customerIdRaw, "customer id");
    const data = await cartService.getOrCreateForCustomer(customerID);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}
