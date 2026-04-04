import { handleRouteError, jsonError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { wishlistService } from "@/lib/services/wishlist.service";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const wishlistID = parseIdParam(id, "wishlist id");
    const body = await readJson<{
      customerID: number;
      productID: number;
    }>(req);
    if (body.customerID === undefined || body.productID === undefined) {
      return jsonError("customerID and productID are required", 400);
    }
    const data = await wishlistService.addProduct(
      wishlistID,
      body.customerID,
      body.productID
    );
    return jsonOk(data, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const wishlistID = parseIdParam(id, "wishlist id");
    const { searchParams } = new URL(req.url);
    const customerID = parseIdParam(
      searchParams.get("customerId") ?? undefined,
      "customer id"
    );
    const productID = parseIdParam(
      searchParams.get("productId") ?? undefined,
      "product id"
    );
    const data = await wishlistService.removeProduct(
      wishlistID,
      customerID,
      productID
    );
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}
