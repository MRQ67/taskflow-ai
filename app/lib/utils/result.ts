import { Result, ok, err } from "neverthrow";

export type AppError =
  | { type: "NOT_FOUND"; entity: string }
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "VALIDATION_ERROR"; fields: Record<string, string> }
  | { type: "NETWORK_ERROR"; message: string }
  | { type: "CONVEX_ERROR"; message: string }
  | { type: "UNKNOWN_ERROR"; message: string };

export function handleError(error: unknown): AppError {
  if (error instanceof Error) {
    // Check if it's a Convex error
    if (error.message.includes("ConvexError")) {
      return { type: "CONVEX_ERROR", message: error.message };
    }
    
    // Check if it's a network error
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return { type: "NETWORK_ERROR", message: error.message };
    }
    
    return { type: "UNKNOWN_ERROR", message: error.message };
  }
  
  if (typeof error === "string") {
    return { type: "UNKNOWN_ERROR", message: error };
  }
  
  return { type: "UNKNOWN_ERROR", message: "An unexpected error occurred" };
}

export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<Result<T, AppError>> {
  try {
    const result = await fn();
    return ok(result);
  } catch (error) {
    return err(handleError(error));
  }
}

export function tryCatchSync<T>(
  fn: () => T
): Result<T, AppError> {
  try {
    const result = fn();
    return ok(result);
  } catch (error) {
    return err(handleError(error));
  }
}

// Helper functions for common error types
export function notFoundError(entity: string): AppError {
  return { type: "NOT_FOUND", entity };
}

export function unauthorizedError(message: string): AppError {
  return { type: "UNAUTHORIZED", message };
}

export function validationError(fields: Record<string, string>): AppError {
  return { type: "VALIDATION_ERROR", fields };
}

export function networkError(message: string): AppError {
  return { type: "NETWORK_ERROR", message };
}

// Helper to format error messages for UI display
export function formatErrorMessage(error: AppError): string {
  switch (error.type) {
    case "NOT_FOUND":
      return `${error.entity} not found`;
    case "UNAUTHORIZED":
      return error.message;
    case "VALIDATION_ERROR":
      return Object.entries(error.fields)
        .map(([field, message]) => `${field}: ${message}`)
        .join(", ");
    case "NETWORK_ERROR":
      return `Network error: ${error.message}`;
    case "CONVEX_ERROR":
      return `Database error: ${error.message}`;
    case "UNKNOWN_ERROR":
      return error.message;
    default:
      return "An unexpected error occurred";
  }
}