import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { ShoppingCartRow } from "@/types/db";

export const shoppingCartDao = {
  async findByCustomer(
    customerID: number,
    conn?: PoolConnection
  ): Promise<ShoppingCartRow | null> {
    const rows = await runQuery<ShoppingCartRow[]>(
      "SELECT * FROM ShoppingCart WHERE customerID = ? LIMIT 1",
      [customerID],
      conn
    );
    return rows[0] ?? null;
  },

  async findById(
    cartID: number,
    conn?: PoolConnection
  ): Promise<ShoppingCartRow | null> {
    const rows = await runQuery<ShoppingCartRow[]>(
      "SELECT * FROM ShoppingCart WHERE cartID = ? LIMIT 1",
      [cartID],
      conn
    );
    return rows[0] ?? null;
  },

  async insert(
    data: { customerID: number; expiresAt?: Date | null },
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      "INSERT INTO ShoppingCart (customerID, expiresAt) VALUES (?, ?)",
      [data.customerID, data.expiresAt ?? null],
      conn
    );
    return res.insertId;
  },

  async updateExpiresAt(
    cartID: number,
    expiresAt: Date | null,
    conn?: PoolConnection
  ): Promise<void> {
    await runExecute(
      "UPDATE ShoppingCart SET expiresAt = ? WHERE cartID = ?",
      [expiresAt, cartID],
      conn
    );
  },
};
