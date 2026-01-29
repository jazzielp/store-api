import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import { ApiError } from "@/errors/ApiError";

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(400, "VALIDATION_ERROR", "Failed to validate", {
            issues: error.issues.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          }),
        );
      }
      return next(error);
    }
  };
};
