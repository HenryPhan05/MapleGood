import type { ResultSetHeader, QueryResult } from "mysql2";
import mysql, { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";

let pool: Pool | null = null;

function createPool(): Pool {
  const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
  } = process.env;

  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error(
      "Missing required MySQL environment variables (MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE)."
    );
  }

  return mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60_000,
    queueLimit: 0,
  });
}

export function getMysqlPool(): Pool {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

export async function query<T extends RowDataPacket[] = RowDataPacket[]>(
  sql: string,
  params: unknown[] = []
): Promise<[T, mysql.FieldPacket[]]> {
  const currentPool = getMysqlPool();
  return currentPool.query<T>(sql, params);
}

export async function mutate(
  sql: string,
  params: readonly unknown[] = [],
  conn?: PoolConnection
): Promise<ResultSetHeader> {
  const executor = conn ?? getMysqlPool();
  const [result] = await executor.execute<QueryResult>(
    sql,
    params as unknown as (string | number | boolean | Date | Buffer | null)[]
  );
  return result as ResultSetHeader;
}

export async function transaction<T>(
  fn: (conn: PoolConnection) => Promise<T>
): Promise<T> {
  const currentPool = getMysqlPool();
  const conn = await currentPool.getConnection();
  try {
    await conn.beginTransaction();
    const out = await fn(conn);
    await conn.commit();
    return out;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

