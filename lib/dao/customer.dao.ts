import type { PoolConnection } from "mysql2/promise";

import { runExecute, runQuery } from "@/lib/dao/runner";
import type { CustomerRow } from "@/types/db";

export const customerDao = {
  async findById(
    customerID: number,
    conn?: PoolConnection
  ): Promise<CustomerRow | null> {
    const rows = await runQuery<CustomerRow[]>(
      "SELECT * FROM Customer WHERE customerID = ? AND isDeleted = FALSE LIMIT 1",
      [customerID],
      conn
    );
    return rows[0] ?? null;
  },

  async findByEmail(
    email: string,
    conn?: PoolConnection
  ): Promise<CustomerRow | null> {
    const rows = await runQuery<CustomerRow[]>(
      "SELECT * FROM Customer WHERE email = ? AND isDeleted = FALSE LIMIT 1",
      [email],
      conn
    );
    return rows[0] ?? null;
  },

  async list(
    limit: number,
    offset: number,
    conn?: PoolConnection
  ): Promise<CustomerRow[]> {
    return runQuery<CustomerRow[]>(
      "SELECT customerID, firstName, lastName, email, phone, address, city, province, postalCode, country, role, isDeleted, createdAt, updatedAt FROM Customer WHERE isDeleted = FALSE ORDER BY customerID DESC LIMIT ? OFFSET ?",
      [limit, offset],
      conn
    );
  },

  async insert(
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string | null;
      password: string;
      address?: string | null;
      city?: string | null;
      province?: string | null;
      postalCode?: string | null;
      country?: string | null;
      role?: string | null;
    },
    conn?: PoolConnection
  ): Promise<number> {
    const res = await runExecute(
      `INSERT INTO Customer (firstName, lastName, email, phone, password, address, city, province, postalCode, country, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.phone ?? null,
        data.password,
        data.address ?? null,
        data.city ?? null,
        data.province ?? null,
        data.postalCode ?? null,
        data.country ?? "Canada",
        data.role ?? "CUSTOMER",
      ],
      conn
    );
    return res.insertId;
  },

  async update(
    customerID: number,
    data: Partial<{
      firstName: string;
      lastName: string;
      phone: string | null;
      address: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      country: string | null;
      role: string | null;
      password: string;
    }>,
    conn?: PoolConnection
  ): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [];
    const map: Record<string, unknown> = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      country: data.country,
      role: data.role,
      password: data.password,
    };
    for (const [k, v] of Object.entries(map)) {
      if (v !== undefined) {
        fields.push(`${k} = ?`);
        values.push(v);
      }
    }
    if (!fields.length) return;
    values.push(customerID);
    await runExecute(
      `UPDATE Customer SET ${fields.join(", ")} WHERE customerID = ? AND isDeleted = FALSE`,
      values,
      conn
    );
  },

  async softDelete(customerID: number, conn?: PoolConnection): Promise<void> {
    await runExecute(
      "UPDATE Customer SET isDeleted = TRUE WHERE customerID = ?",
      [customerID],
      conn
    );
  },
};
