import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { PaymentRow } from "@/types/db";

export const paymentDao = {
  async findById(
    paymentID: number,
    conn?: PoolConnection
  ): Promise<PaymentRow | null> {
    const rows = await runQuery<PaymentRow[]>(
      "SELECT * FROM Payment WHERE paymentID = ? LIMIT 1",
      [paymentID],
      conn
    );
    return rows[0] ?? null;
  },

  async listByOrder(
    orderID: number,
    conn?: PoolConnection
  ): Promise<PaymentRow[]> {
    return runQuery<PaymentRow[]>(
      "SELECT * FROM Payment WHERE orderID = ? ORDER BY paymentID DESC",
      [orderID],
      conn
    );
  },

  async insert(
    data: {
      orderID: number;
      customerID: number;
      amount: string | number;
      paymentMethod?: string | null;
      paymentStatus?: string | null;
      transactionId?: string | null;
    },
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      `INSERT INTO Payment (orderID, customerID, amount, paymentMethod, paymentStatus, transactionId)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.orderID,
        data.customerID,
        String(data.amount),
        data.paymentMethod ?? null,
        data.paymentStatus ?? "PENDING",
        data.transactionId ?? null,
      ],
      conn
    );
    return res.insertId;
  },

  async updateStatus(
    paymentID: number,
    paymentStatus: string,
    conn?: PoolConnection
  ): Promise<void> {
    await runExecute(
      "UPDATE Payment SET paymentStatus = ? WHERE paymentID = ?",
      [paymentStatus, paymentID],
      conn
    );
  },
};
