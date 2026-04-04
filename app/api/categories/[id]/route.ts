import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { catalogService } from "@/lib/services/catalog.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const categoryID = parseIdParam(id, "category id");
    const data = await catalogService.getCategory(categoryID);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const categoryID = parseIdParam(id, "category id");
    const body = await readJson<{
      categoryName?: string;
      description?: string | null;
      parentCategoryID?: number | null;
    }>(req);
    const data = await catalogService.updateCategory(categoryID, body);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const categoryID = parseIdParam(id, "category id");
    await catalogService.deleteCategory(categoryID);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return handleRouteError(e);
  }
}
