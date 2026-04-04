import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { paymentService } from "@/lib/services/payment.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const paymentID = parseIdParam(id, "payment id");
    const data = await paymentService.getById(paymentID);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const paymentID = parseIdParam(id, "payment id");
    const body = await readJson<{ paymentStatus: string }>(req);
    if (!body.paymentStatus) {
      return NextResponse.json(
        { error: "paymentStatus is required" },
        { status: 400 }
      );
    }
    const data = await paymentService.updateStatus(
      paymentID,
      body.paymentStatus
    );
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}
