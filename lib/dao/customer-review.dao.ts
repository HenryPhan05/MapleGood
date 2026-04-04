import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { CustomerReviewRow } from "@/types/db";

export const customerReviewDao = {
  async listByProduct(
    productID: number,
    limit: number,
    offset: number,
    conn?: PoolConnection
  ): Promise<CustomerReviewRow[]> {
    return runQuery<CustomerReviewRow[]>(
      "SELECT * FROM CustomerReviews WHERE productID = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [productID, limit, offset],
      conn
    );
  },

  async findByCustomerAndProduct(
    customerID: number,
    productID: number,
    conn?: PoolConnection
  ): Promise<CustomerReviewRow | null> {
    const rows = await runQuery<CustomerReviewRow[]>(
      "SELECT * FROM CustomerReviews WHERE customerID = ? AND productID = ? LIMIT 1",
      [customerID, productID],
      conn
    );
    return rows[0] ?? null;
  },

  async upsert(
    data: {
      customerID: number;
      productID: number;
      rating: number;
      reviewText?: string | null;
    },
    conn?: PoolConnection
  ): Promise<void> {
    await runExecute(
      `INSERT INTO CustomerReviews (customerID, productID, rating, reviewText)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), reviewText = VALUES(reviewText)`,
      [
        data.customerID,
        data.productID,
        data.rating,
        data.reviewText ?? null,
      ],
      conn
    );
  },
};
