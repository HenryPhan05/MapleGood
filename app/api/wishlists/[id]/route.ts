import { handleRouteError, jsonError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { wishlistService } from "@/lib/services/wishlist.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const wishlistID = parseIdParam(id, "wishlist id");
    const { searchParams } = new URL(req.url);
    const customerIdRaw = searchParams.get("customerId");
    if (!customerIdRaw) {
      return jsonError("customerId query parameter is required", 400);
    }
    const customerID = parseIdParam(customerIdRaw, "customer id");
    const data = await wishlistService.getWithItems(wishlistID, customerID);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const wishlistID = parseIdParam(id, "wishlist id");
    const body = await readJson<{
      customerID: number;
      wishlistName: string;
    }>(req);
    if (body.customerID === undefined || !body.wishlistName) {
      return jsonError("customerID and wishlistName are required", 400);
    }
    const data = await wishlistService.rename(
      wishlistID,
      body.customerID,
      body.wishlistName
    );
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}
