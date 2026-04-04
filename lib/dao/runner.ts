import type { RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";

import { mutate, query } from "@/db/mysql";

export async function runQuery<T extends RowDataPacket[]>(
  sql: string,
  params: unknown[] = [],
  conn?: PoolConnection
): Promise<T> {
  if (conn) {
    const [rows] = await conn.query<T>(sql, params);
    return rows;
  }
  const [rows] = await query<T>(sql, params);
  return rows;
}

export async function runExecute(
  sql: string,
  params: readonly unknown[] = [],
  conn?: PoolConnection
) {
  return mutate(sql, params, conn);
}
