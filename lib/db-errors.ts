export function isDuplicateEntry(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code: string }).code === "ER_DUP_ENTRY"
  );
}

export function isConstraintViolation(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    ((e as { code: string }).code === "ER_NO_REFERENCED_ROW_2" ||
     (e as { code: string }).code === "ER_ROW_IS_REFERENCED_2")
  );
}