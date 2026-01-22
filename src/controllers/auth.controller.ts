import type { Request, Response } from "express";
import type { Login } from "@/types/type";
import * as UserModel from "@/models/user.model";
import { verifyPassword } from "@/lib/hashPassword";
import { generateJWT } from "@/lib/generateJWT";

export const login = async (req: Request, res: Response) => {
  const body = req.body as Login;
  const user = await UserModel.findByEmailUser(body.email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isValidPassword = await verifyPassword(body.password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateJWT({ id: user.id, email: user.email });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.json({ message: "Login successful" });
};
