import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/config";
import { ApiError } from "@/errors/ApiError";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Intentar obtener el token de la cookie primero
  let token = req.cookies.token;

  // Si no está en cookie, buscar en el header Authorization
  if (!token) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const [scheme, headerToken] = authHeader.split(" ");

      if (scheme === "Bearer" && headerToken) {
        token = headerToken;
      }
    }
  }

  // Si no hay token en ningún lado
  if (!token) {
    return next(
      new ApiError(401, "AUTH_ERROR", "Authorization token required"),
    );
  }

  if (!JWT_SECRET) {
    return next(
      new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "JWT secret is not configured",
      ),
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);

    if (typeof decoded === "string") {
      return next(new ApiError(401, "AUTH_ERROR", "Invalid token payload"));
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    }; // Guardar los datos del usuario en el request
    return next();
  } catch (error) {
    return next(new ApiError(401, "AUTH_ERROR", "Invalid or expired token"));
  }
};
