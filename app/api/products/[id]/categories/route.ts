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
    const data = await catalogService.listProductCategories(productID);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const productID = parseIdParam(id, "product id");
    const body = await readJson<{ categoryID: number }>(req);
    if (body.categoryID === undefined || body.categoryID === null) {
      return NextResponse.json(
        { error: "categoryID is required" },
        { status: 400 }
      );
    }
    const data = await catalogService.linkProductToCategory(
      productID,
      body.categoryID
    );
    return jsonOk(data, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const productID = parseIdParam(id, "product id");
    const { searchParams } = new URL(req.url);
    const categoryID = parseIdParam(
      searchParams.get("categoryId") ?? undefined,
      "category id"
    );
    await catalogService.unlinkProductFromCategory(productID, categoryID);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return handleRouteError(e);
  }
}
