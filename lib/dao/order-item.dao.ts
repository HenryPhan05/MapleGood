import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { OrderItemRow } from "@/types/db";

export const orderItemDao = {
  async listByOrder(
    orderID: number,
    conn?: PoolConnection
  ): Promise<OrderItemRow[]> {
    return runQuery<OrderItemRow[]>(
      "SELECT * FROM OrderItems WHERE orderID = ? ORDER BY orderItemID ASC",
      [orderID],
      conn
    );
  },

  async insert(
    data: {
      orderID: number;
      productID: number;
      quantity: number;
      unitPrice: string | number;
      subtotal: string | number;
      productNameSnapshot?: string | null;
    },
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      `INSERT INTO OrderItems (orderID, productID, quantity, unitPrice, subtotal, productNameSnapshot)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.orderID,
        data.productID,
        data.quantity,
        String(data.unitPrice),
        String(data.subtotal),
        data.productNameSnapshot ?? null,
      ],
      conn
    );
    return res.insertId;
  },
};
