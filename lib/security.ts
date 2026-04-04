export function sanitizeForLogging(input: unknown): unknown {
  if (typeof input !== "object" || input === null) {
    return input;
  }

  const sensitiveKeys = ["password", "token", "secret", "key", "authorization"];
  const sanitized = { ...input as Record<string, unknown> };

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = "[REDACTED]";
    }
  }

  return sanitized;
}

export function getClientIP(request: Request): string | undefined {
  const headers = request.headers;
  
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("x-client-ip") ||
    undefined
  );
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function generateSecureId(): string {
  return crypto.randomUUID();
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string, 
  maxRequests: number, 
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const existing = rateLimitMap.get(key);

  if (!existing || now > existing.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: existing.resetTime };
  }

  existing.count++;
  return { allowed: true, remaining: maxRequests - existing.count, resetTime: existing.resetTime };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);