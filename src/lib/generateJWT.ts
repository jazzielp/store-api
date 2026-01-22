import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/config";

export const generateJWT = (payload: any) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "1h",
  });
  return token;
};
