import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { wishlistService } from "@/lib/services/wishlist.service";

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
    const data = await wishlistService.listForCustomer(customerID);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await readJson<{
      customerID: number;
      wishlistName?: string | null;
    }>(req);
    if (body.customerID === undefined || body.customerID === null) {
      return NextResponse.json(
        { error: "customerID is required" },
        { status: 400 }
      );
    }
    const created = await wishlistService.create(
      body.customerID,
      body.wishlistName
    );
    return jsonOk(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
