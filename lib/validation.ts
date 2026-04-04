import { HttpError } from "@/lib/http-error";

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new HttpError(400, "Invalid email format");
  }
}

export function validatePrice(price: string | number): number {
  const num = Number(price);
  if (!Number.isFinite(num) || num < 0) {
    throw new HttpError(400, "Price must be a positive number");
  }
  return Math.round(num * 100) / 100;
}

export function validateQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new HttpError(400, "Quantity must be a positive integer");
  }
}

export function validateRating(rating: number): void {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new HttpError(400, "Rating must be between 1 and 5");
  }
}

export function validatePhone(phone: string | null | undefined): void {
  if (phone !== null && phone !== undefined && phone.trim() !== "") {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,20}$/;
    if (!phoneRegex.test(phone)) {
      throw new HttpError(400, "Invalid phone number format");
    }
  }
}

export function validatePostalCode(postalCode: string | null | undefined, country?: string | null | undefined): void {
  if (postalCode !== null && postalCode !== undefined && postalCode.trim() !== "") {
    if (!country || country === "Canada") {
      const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
      if (!canadianPostalRegex.test(postalCode)) {
        throw new HttpError(400, "Invalid Canadian postal code format");
      }
    }
  }
}

export function sanitizeString(input: string | null | undefined, maxLength?: number): string | null {
  if (!input || typeof input !== "string") {
    return null;
  }
  
  const trimmed = input.trim();
  if (trimmed === "") {
    return null;
  }
  
  if (maxLength && trimmed.length > maxLength) {
    throw new HttpError(400, `Input exceeds maximum length of ${maxLength} characters`);
  }
  
  return trimmed;
}