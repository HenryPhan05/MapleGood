import { NextResponse } from "next/server";

import { handleRouteError, jsonError, jsonOk } from "@/lib/api-response";
import { parseIdParam, parsePagination } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { reviewService } from "@/lib/services/review.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productIdRaw = searchParams.get("productId");
    if (!productIdRaw) {
      return jsonError("productId query parameter is required", 400);
    }
    const productID = parseIdParam(productIdRaw, "product id");
    const { limit, offset } = parsePagination(searchParams);
    const data = await reviewService.listByProduct(productID, limit, offset);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await readJson<{
      customerID: number;
      productID: number;
      rating: number;
      reviewText?: string | null;
    }>(req);
    if (
      body.customerID === undefined ||
      body.productID === undefined ||
      body.rating === undefined
    ) {
      return NextResponse.json(
        { error: "customerID, productID, and rating are required" },
        { status: 400 }
      );
    }
    const data = await reviewService.upsert(body);
    return jsonOk(data, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
