import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { CartItemRow } from "@/types/db";

export const cartItemDao = {
  async listByCart(
    cartID: number,
    conn?: PoolConnection
  ): Promise<CartItemRow[]> {
    return runQuery<CartItemRow[]>(
      "SELECT * FROM CartItems WHERE cartID = ? ORDER BY cartItemID ASC",
      [cartID],
      conn
    );
  },

  async findByCartAndProduct(
    cartID: number,
    productID: number,
    conn?: PoolConnection
  ): Promise<CartItemRow | null> {
    const rows = await runQuery<CartItemRow[]>(
      "SELECT * FROM CartItems WHERE cartID = ? AND productID = ? LIMIT 1",
      [cartID, productID],
      conn
    );
    return rows[0] ?? null;
  },

  async insert(
    data: { cartID: number; productID: number; quantity?: number },
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      "INSERT INTO CartItems (cartID, productID, quantity) VALUES (?, ?, ?)",
      [data.cartID, data.productID, data.quantity ?? 1],
      conn
    );
    return res.insertId;
  },

  async updateQuantity(
    cartItemID: number,
    quantity: number,
    conn?: PoolConnection
  ): Promise<void> {
    await runExecute(
      "UPDATE CartItems SET quantity = ? WHERE cartItemID = ?",
      [quantity, cartItemID],
      conn
    );
  },

  async delete(cartItemID: number, conn?: PoolConnection): Promise<void> {
    await runExecute(
      "DELETE FROM CartItems WHERE cartItemID = ?",
      [cartItemID],
      conn
    );
  },
};
