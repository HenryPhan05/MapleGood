import { HttpError } from "@/lib/http-error";

export function parsePagination(searchParams: URLSearchParams) {
  const rawLimit = Number(searchParams.get("limit") ?? 20);
  const rawOffset = Number(searchParams.get("offset") ?? 0);
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 20;
  const offset =
    Number.isFinite(rawOffset) && rawOffset >= 0 ? Math.floor(rawOffset) : 0;
  return { limit, offset };
}

export function parseIdParam(value: string | undefined, label: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) {
    throw new HttpError(400, `Invalid ${label}`);
  }
  return n;
}