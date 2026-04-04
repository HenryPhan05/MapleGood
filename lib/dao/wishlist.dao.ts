import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { WishlistRow } from "@/types/db";

export const wishlistDao = {
  async findById(
    wishlistID: number,
    conn?: PoolConnection
  ): Promise<WishlistRow | null> {
    const rows = await runQuery<WishlistRow[]>(
      "SELECT * FROM Wishlist WHERE wishlistID = ? LIMIT 1",
      [wishlistID],
      conn
    );
    return rows[0] ?? null;
  },

  async listByCustomer(
    customerID: number,
    conn?: PoolConnection
  ): Promise<WishlistRow[]> {
    return runQuery<WishlistRow[]>(
      "SELECT * FROM Wishlist WHERE customerID = ? ORDER BY wishlistID ASC",
      [customerID],
      conn
    );
  },

  async insert(
    data: { customerID: number; wishlistName?: string | null },
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      "INSERT INTO Wishlist (customerID, wishlistName) VALUES (?, ?)",
      [data.customerID, data.wishlistName ?? "My Wishlist"],
      conn
    );
    return res.insertId;
  },

  async updateName(
    wishlistID: number,
    wishlistName: string,
    conn?: PoolConnection
  ): Promise<void> {
    await runExecute(
      "UPDATE Wishlist SET wishlistName = ? WHERE wishlistID = ?",
      [wishlistName, wishlistID],
      conn
    );
  },
};
