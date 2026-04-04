import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { parseIdParam } from "@/lib/pagination";
import { readJson } from "@/lib/read-json";
import { paymentService } from "@/lib/services/payment.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderIdRaw = searchParams.get("orderId");
    if (!orderIdRaw) {
      return NextResponse.json(
        { error: "orderId query parameter is required" },
        { status: 400 }
      );
    }
    const orderID = parseIdParam(orderIdRaw, "order id");
    const data = await paymentService.listByOrder(orderID);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await readJson<{
      orderID: number;
      customerID: number;
      amount: string | number;
      paymentMethod?: string | null;
      paymentStatus?: string | null;
      transactionId?: string | null;
    }>(req);
    if (
      body.orderID === undefined ||
      body.customerID === undefined ||
      body.amount === undefined
    ) {
      return NextResponse.json(
        { error: "orderID, customerID, and amount are required" },
        { status: 400 }
      );
    }
    const created = await paymentService.create(body);
    return jsonOk(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
