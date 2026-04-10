import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parsePagination } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { catalogService } from "@/lib/services/catalog.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const { limit, offset } = parsePagination(searchParams);
    const q = searchParams.get("q")?.trim() ?? "";
    if (q) {
      const data = await catalogService.searchProducts(q, limit, offset);
      return jsonOk(data);
    }
    const activeOnly = searchParams.get("activeOnly") !== "false";
    const data = await catalogService.listProducts(limit, offset, activeOnly);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await readJson<{
      productName: string;
      description?: string | null;
      price: string | number;
      stockQuantity?: number;
      imageURL?: string | null;
      brand?: string | null;
      model?: string | null;
      specifications?: string | null;
      isActive?: boolean;
    }>(req);
    if (!body.productName || body.price === undefined || body.price === null) {
      return NextResponse.json(
        { error: "productName and price are required" },
        { status: 400 }
      );
    }
    const created = await catalogService.createProduct(body);
    return jsonOk(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
