import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { ProductCategoryRow } from "@/types/db";

export const productCategoryDao = {
  async listByProduct(
    productID: number,
    conn?: PoolConnection
  ): Promise<ProductCategoryRow[]> {
    return runQuery<ProductCategoryRow[]>(
      "SELECT * FROM ProductCategory WHERE productID = ? ORDER BY id ASC",
      [productID],
      conn
    );
  },

  async listByCategory(
    categoryID: number,
    limit: number,
    offset: number,
    conn?: PoolConnection
  ): Promise<ProductCategoryRow[]> {
    return runQuery<ProductCategoryRow[]>(
      "SELECT * FROM ProductCategory WHERE categoryID = ? ORDER BY id ASC LIMIT ? OFFSET ?",
      [categoryID, limit, offset],
      conn
    );
  },

  async link(
    productID: number,
    categoryID: number,
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      "INSERT INTO ProductCategory (productID, categoryID) VALUES (?, ?)",
      [productID, categoryID],
      conn
    );
    return res.insertId;
  },

  async unlink(
    productID: number,
    categoryID: number,
    conn?: PoolConnection
  ): Promise<void> {
    await runExecute(
      "DELETE FROM ProductCategory WHERE productID = ? AND categoryID = ?",
      [productID, categoryID],
      conn
    );
  },
};
