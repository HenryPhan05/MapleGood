type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
}

export const logger = {
  info(message: string, context?: LogContext): void {
    console.log(formatLog("info", message, context));
  },

  warn(message: string, context?: LogContext): void {
    console.warn(formatLog("warn", message, context));
  },

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = error instanceof Error 
      ? { ...context, error: error.message, stack: error.stack }
      : { ...context, error };
    console.error(formatLog("error", message, errorContext));
  },

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(formatLog("debug", message, context));
    }
  },

  security: {
    authFailure(identifier: string, ip?: string): void {
      logger.warn("Authentication failure", { identifier, ip, type: "auth_failure" });
    },

    suspiciousActivity(message: string, context?: LogContext): void {
      logger.warn(`SECURITY: ${message}`, { ...context, type: "security" });
    },

    dataAccess(action: string, resource: string, userId?: number): void {
      logger.info("Data access", { action, resource, userId, type: "data_access" });
    },
  },
};