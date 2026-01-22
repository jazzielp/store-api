import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/config";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Intentar obtener el token de la cookie primero
  let token = req.cookies.token;
  console.log("🚀 ~ authenticate ~ token:", token);

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
    return res.status(401).json({ error: "Authorization token required" });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret is not configured" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    console.log("🚀 ~ authenticate ~ decoded:", decoded);
    req.user = decoded; // Guardar los datos del usuario en el request
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
