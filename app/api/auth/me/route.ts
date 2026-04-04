import { handleRouteError, jsonOk } from "@/lib/api-response";
import { HttpError } from "@/lib/http-error";
import { getTokenFromRequest, verifyAccessToken } from "@/lib/jwt";
import { customerService } from "@/lib/services/customer.service";

export async function GET(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      throw new HttpError(401, "Not authenticated");
    }
    const { customerID } = verifyAccessToken(token);
    const customer = await customerService.getById(customerID);
    return jsonOk(customer);
  } catch (e) {
    return handleRouteError(e);
  }
}
