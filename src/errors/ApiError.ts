export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR"
  | "AUTH_ERROR"
  | "FORBIDDEN"
  | "CONFLICT";

export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

export class ApiError extends Error {
  statusCode: number;
  code: ErrorCode;
  details?: unknown;

  constructor(
    statusCode: number,
    code: ErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    // Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new ApiError(400, "BAD_REQUEST", message, details);
  }

  static notFound(message = "Resource not found", details?: unknown) {
    return new ApiError(404, "NOT_FOUND", message, details);
  }

  static conflict(message = "Conflict", details?: unknown) {
    return new ApiError(409, "CONFLICT", message, details);
  }

  static internal(message = "Internal server error", details?: unknown) {
    return new ApiError(500, "INTERNAL_SERVER_ERROR", message, details);
  }
}
