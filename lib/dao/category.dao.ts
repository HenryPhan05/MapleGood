import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { CategoryRow } from "@/types/db";

export const categoryDao = {
  async findById(
    categoryID: number,
    conn?: PoolConnection
  ): Promise<CategoryRow | null> {
    const rows = await runQuery<CategoryRow[]>(
      "SELECT * FROM Category WHERE categoryID = ? AND isDeleted = FALSE LIMIT 1",
      [categoryID],
      conn
    );
    return rows[0] ?? null;
  },

  async list(limit: number, offset: number, conn?: PoolConnection) {
    return runQuery<CategoryRow[]>(
      "SELECT * FROM Category WHERE isDeleted = FALSE ORDER BY categoryID ASC LIMIT ? OFFSET ?",
      [limit, offset],
      conn
    );
  },

  async insert(
    data: {
      categoryName: string;
      description?: string | null;
      parentCategoryID?: number | null;
    },
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      "INSERT INTO Category (categoryName, description, parentCategoryID) VALUES (?, ?, ?)",
      [
        data.categoryName,
        data.description ?? null,
        data.parentCategoryID ?? null,
      ],
      conn
    );
    return res.insertId;
  },

  async update(
    categoryID: number,
    data: Partial<{
      categoryName: string;
      description: string | null;
      parentCategoryID: number | null;
    }>,
    conn?: PoolConnection
  ): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [];
    if (data.categoryName !== undefined) {
      fields.push("categoryName = ?");
      values.push(data.categoryName);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.parentCategoryID !== undefined) {
      fields.push("parentCategoryID = ?");
      values.push(data.parentCategoryID);
    }
    if (!fields.length) return;
    values.push(categoryID);
    await runExecute(
      `UPDATE Category SET ${fields.join(", ")} WHERE categoryID = ? AND isDeleted = FALSE`,
      values,
      conn
    );
  },

  async softDelete(categoryID: number, conn?: PoolConnection): Promise<void> {
    await runExecute(
      "UPDATE Category SET isDeleted = TRUE WHERE categoryID = ?",
      [categoryID],
      conn
    );
  },
};
