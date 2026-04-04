import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam, parsePagination } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { orderService } from "@/lib/services/order.service";

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
    const { limit, offset } = parsePagination(searchParams);
    const data = await orderService.listByCustomer(customerID, limit, offset);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await readJson<{
      customerID: number;
      items: { productID: number; quantity: number }[];
      shipping?: {
        shippingAddress?: string | null;
        shippingCity?: string | null;
        shippingProvince?: string | null;
        shippingPostalCode?: string | null;
        shippingCountry?: string | null;
      };
    }>(req);
    if (body.customerID === undefined || body.customerID === null) {
      return NextResponse.json(
        { error: "customerID is required" },
        { status: 400 }
      );
    }
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ error: "items array is required" }, { status: 400 });
    }
    const data = await orderService.create(body);
    return jsonOk(data, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
