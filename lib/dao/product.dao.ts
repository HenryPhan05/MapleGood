import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { ProductRow } from "@/types/db";

export const productDao = {
  async findById(
    productID: number,
    conn?: PoolConnection
  ): Promise<ProductRow | null> {
    const rows = await runQuery<ProductRow[]>(
      "SELECT * FROM Product WHERE productID = ? AND isDeleted = FALSE LIMIT 1",
      [productID],
      conn
    );
    return rows[0] ?? null;
  },

  async list(
    limit: number,
    offset: number,
    activeOnly: boolean,
    conn?: PoolConnection
  ): Promise<ProductRow[]> {
    const where = activeOnly
      ? "isDeleted = FALSE AND isActive = TRUE"
      : "isDeleted = FALSE";
    return runQuery<ProductRow[]>(
      `SELECT * FROM Product WHERE ${where} ORDER BY productID DESC LIMIT ? OFFSET ?`,
      [limit, offset],
      conn
    );
  },

  async search(
    query: string,
    limit: number,
    offset: number,
    conn?: PoolConnection
  ): Promise<ProductRow[]> {
    const pattern = `%${query}%`;
    return runQuery<ProductRow[]>(
      `SELECT * FROM Product WHERE isDeleted = FALSE AND isActive = TRUE AND (productName LIKE ? OR brand LIKE ? OR description LIKE ?) ORDER BY productID DESC LIMIT ? OFFSET ?`,
      [pattern, pattern, pattern, limit, offset],
      conn
    );
  },

  async insert(
    data: {
      productName: string;
      description?: string | null;
      price: string | number;
      stockQuantity?: number;
      imageURL?: string | null;
      brand?: string | null;
      model?: string | null;
      specifications?: string | null;
      isActive?: boolean;
    },
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      `INSERT INTO Product (productName, description, price, stockQuantity, imageURL, brand, model, specifications, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.productName,
        data.description ?? null,
        String(data.price),
        data.stockQuantity ?? 0,
        data.imageURL ?? null,
        data.brand ?? null,
        data.model ?? null,
        data.specifications ?? null,
        data.isActive ?? true,
      ],
      conn
    );
    return res.insertId;
  },

  async update(
    productID: number,
    data: Partial<{
      productName: string;
      description: string | null;
      price: string | number;
      stockQuantity: number;
      version: number;
      imageURL: string | null;
      brand: string | null;
      model: string | null;
      specifications: string | null;
      isActive: boolean;
    }>,
    conn?: PoolConnection
  ): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [];
    if (data.productName !== undefined) {
      fields.push("productName = ?");
      values.push(data.productName);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.price !== undefined) {
      fields.push("price = ?");
      values.push(String(data.price));
    }
    if (data.stockQuantity !== undefined) {
      fields.push("stockQuantity = ?");
      values.push(data.stockQuantity);
    }
    if (data.version !== undefined) {
      fields.push("version = ?");
      values.push(data.version);
    }
    if (data.imageURL !== undefined) {
      fields.push("imageURL = ?");
      values.push(data.imageURL);
    }
    if (data.brand !== undefined) {
      fields.push("brand = ?");
      values.push(data.brand);
    }
    if (data.model !== undefined) {
      fields.push("model = ?");
      values.push(data.model);
    }
    if (data.specifications !== undefined) {
      fields.push("specifications = ?");
      values.push(data.specifications);
    }
    if (data.isActive !== undefined) {
      fields.push("isActive = ?");
      values.push(data.isActive);
    }
    if (!fields.length) return;
    values.push(productID);
    await runExecute(
      `UPDATE Product SET ${fields.join(", ")} WHERE productID = ? AND isDeleted = FALSE`,
      values,
      conn
    );
  },

  async softDelete(productID: number, conn?: PoolConnection): Promise<void> {
    await runExecute(
      "UPDATE Product SET isDeleted = TRUE WHERE productID = ?",
      [productID],
      conn
    );
  },

  async tryDecrementStock(
    productID: number,
    quantity: number,
    conn?: PoolConnection
  ): Promise<boolean> {
    const res = await runExecute(
      "UPDATE Product SET stockQuantity = stockQuantity - ? WHERE productID = ? AND isDeleted = FALSE AND isActive = TRUE AND stockQuantity >= ?",
      [quantity, productID, quantity],
      conn
    );
    return res.affectedRows === 1;
  },
};
