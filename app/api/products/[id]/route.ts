import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { catalogService } from "@/lib/services/catalog.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const productID = parseIdParam(id, "product id");
    const data = await catalogService.getProduct(productID);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const productID = parseIdParam(id, "product id");
    const body = await readJson<{
      productName?: string;
      description?: string | null;
      price?: string | number;
      stockQuantity?: number;
      version?: number;
      imageURL?: string | null;
      brand?: string | null;
      model?: string | null;
      specifications?: string | null;
      isActive?: boolean;
    }>(req);
    const data = await catalogService.updateProduct(productID, body);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const productID = parseIdParam(id, "product id");
    await catalogService.deleteProduct(productID);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return handleRouteError(e);
  }
}
