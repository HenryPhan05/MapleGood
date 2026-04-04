import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { WishlistItemRow } from "@/types/db";

export const wishlistItemDao = {
  async listByWishlist(
    wishlistID: number,
    conn?: PoolConnection
  ): Promise<WishlistItemRow[]> {
    return runQuery<WishlistItemRow[]>(
      "SELECT * FROM WishlistItems WHERE wishlistID = ? ORDER BY wishlistItemID ASC",
      [wishlistID],
      conn
    );
  },

  async insert(
    data: { wishlistID: number; productID: number },
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      "INSERT INTO WishlistItems (wishlistID, productID) VALUES (?, ?)",
      [data.wishlistID, data.productID],
      conn
    );
    return res.insertId;
  },

  async delete(
    wishlistID: number,
    productID: number,
    conn?: PoolConnection
  ): Promise<void> {
    await runExecute(
      "DELETE FROM WishlistItems WHERE wishlistID = ? AND productID = ?",
      [wishlistID, productID],
      conn
    );
  },
};
