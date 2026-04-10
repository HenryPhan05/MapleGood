import { NextResponse } from "next/server"; // CORRECT
import { productDao } from "@/lib/dao/product.dao";

// GET route for listing products (you likely already have this)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const activeOnly = searchParams.get("activeOnly") === "true";

  try {
    const { searchParams } = new URL(req.url);
    const { limit, offset } = parsePagination(searchParams);
    const q = searchParams.get("q")?.trim() ?? "";
    if (q) {
      const data = await catalogService.searchProducts(q, limit, offset);
      return jsonOk(data);
    }
    const activeOnly = searchParams.get("activeOnly") !== "false";
    const data = await catalogService.listProducts(limit, offset, activeOnly);
    return jsonOk(data);
  } catch (e) {
    return handleRouteError(e);
  }
}

// POST route for ADDING new products
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic Validation
    if (!body.productName || !body.price || body.stockQuantity === undefined) {
      return NextResponse.json(
        { error: "Product name, price, and stock quantity are required." },
        { status: 400 }
      );
    }

    // Insert into Firestore database via your DAO
    const newProductId = await productDao.insert({
      productName: body.productName,
      brand: body.brand || null,
      model: body.model || null,
      price: String(body.price),
      stockQuantity: Number(body.stockQuantity),
      description: body.description || null,
      imageURL: body.imageURL || null,
      isActive: body.isActive ?? true,
      specifications: body.specifications || null,
    });

    return NextResponse.json(
      { message: "Product created successfully", id: newProductId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to save product to database." },
      { status: 500 }
    );
  }
}
