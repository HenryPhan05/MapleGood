import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parsePagination } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { catalogService } from "@/lib/services/catalog.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const { limit, offset } = parsePagination(searchParams);
    const data = await catalogService.listCategories(limit, offset);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await readJson<{
      categoryName: string;
      description?: string | null;
      parentCategoryID?: number | null;
    }>(req);
    if (!body.categoryName) {
      return NextResponse.json(
        { error: "categoryName is required" },
        { status: 400 }
      );
    }
    const created = await catalogService.createCategory(body);
    return jsonOk(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
