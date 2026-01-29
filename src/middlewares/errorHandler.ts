import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError, type ErrorResponse } from "@/errors/ApiError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
) => {
  console.error(err);

  if (err instanceof ZodError) {
    console.log("error issues:", err.issues);
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
  }

  if (err instanceof ApiError) {
    const { statusCode, code, message, details } = err;
    return res.status(statusCode).json({
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  });
};
