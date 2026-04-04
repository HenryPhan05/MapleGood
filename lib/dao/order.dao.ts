import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { OrderRow } from "@/types/db";

const T = "`Order`";

export const orderDao = {
  async findById(
    orderID: number,
    conn?: PoolConnection
  ): Promise<OrderRow | null> {
    const rows = await runQuery<OrderRow[]>(
      `SELECT * FROM ${T} WHERE orderID = ? AND isDeleted = FALSE LIMIT 1`,
      [orderID],
      conn
    );
    return rows[0] ?? null;
  },

  async listByCustomer(
    customerID: number,
    limit: number,
    offset: number,
    conn?: PoolConnection
  ): Promise<OrderRow[]> {
    return runQuery<OrderRow[]>(
      `SELECT * FROM ${T} WHERE customerID = ? AND isDeleted = FALSE ORDER BY orderID DESC LIMIT ? OFFSET ?`,
      [customerID, limit, offset],
      conn
    );
  },

  async insert(
    data: {
      customerID: number;
      totalAmount: string | number;
      orderStatus?: string | null;
      shippingAddress?: string | null;
      shippingCity?: string | null;
      shippingProvince?: string | null;
      shippingPostalCode?: string | null;
      shippingCountry?: string | null;
    },
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      `INSERT INTO ${T} (customerID, totalAmount, orderStatus, shippingAddress, shippingCity, shippingProvince, shippingPostalCode, shippingCountry)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.customerID,
        String(data.totalAmount),
        data.orderStatus ?? "PENDING",
        data.shippingAddress ?? null,
        data.shippingCity ?? null,
        data.shippingProvince ?? null,
        data.shippingPostalCode ?? null,
        data.shippingCountry ?? "Canada",
      ],
      conn
    );
    return res.insertId;
  },

  async update(
    orderID: number,
    data: Partial<{
      orderStatus: string | null;
      totalAmount: string | number;
      version: number;
      shippingAddress: string | null;
      shippingCity: string | null;
      shippingProvince: string | null;
      shippingPostalCode: string | null;
      shippingCountry: string | null;
    }>,
    conn?: PoolConnection
  ): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [];
    if (data.orderStatus !== undefined) {
      fields.push("orderStatus = ?");
      values.push(data.orderStatus);
    }
    if (data.totalAmount !== undefined) {
      fields.push("totalAmount = ?");
      values.push(String(data.totalAmount));
    }
    if (data.version !== undefined) {
      fields.push("version = ?");
      values.push(data.version);
    }
    if (data.shippingAddress !== undefined) {
      fields.push("shippingAddress = ?");
      values.push(data.shippingAddress);
    }
    if (data.shippingCity !== undefined) {
      fields.push("shippingCity = ?");
      values.push(data.shippingCity);
    }
    if (data.shippingProvince !== undefined) {
      fields.push("shippingProvince = ?");
      values.push(data.shippingProvince);
    }
    if (data.shippingPostalCode !== undefined) {
      fields.push("shippingPostalCode = ?");
      values.push(data.shippingPostalCode);
    }
    if (data.shippingCountry !== undefined) {
      fields.push("shippingCountry = ?");
      values.push(data.shippingCountry);
    }
    if (!fields.length) return;
    values.push(orderID);
    await runExecute(
      `UPDATE ${T} SET ${fields.join(", ")} WHERE orderID = ? AND isDeleted = FALSE`,
      values,
      conn
    );
  },

  async softDelete(orderID: number, conn?: PoolConnection): Promise<void> {
    await runExecute(`UPDATE ${T} SET isDeleted = TRUE WHERE orderID = ?`, [orderID], conn);
  },
};
