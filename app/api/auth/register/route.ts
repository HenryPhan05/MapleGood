import { NextResponse } from "next/server";

import { handleRouteError, jsonOk } from "@/lib/api-response";
import { readJson } from "@/lib/read-json";
import { customerService } from "@/lib/services/customer.service";

export async function POST(req: Request) {
  try {
    const body = await readJson<{
      firstName: string;
      lastName: string;
      email: string;
      phone?: string | null;
      password: string;
      address?: string | null;
      city?: string | null;
      province?: string | null;
      postalCode?: string | null;
      country?: string | null;
    }>(req);
    
    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return NextResponse.json(
        { error: "firstName, lastName, email, and password are required" },
        { status: 400 }
      );
    }
    
    const customer = await customerService.create({
      ...body,
      role: "CUSTOMER",
    });
    
    return jsonOk({
      message: "Registration successful",
      customer,
    }, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}