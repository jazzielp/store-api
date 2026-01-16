import type { Request, Response } from "express";
import type { Login } from "@/type";
import * as UserModel from "@/models/user.model";
import { verifyPassword } from "@/lib/hashPassword";

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

  return res.json({ message: "Login successful" });
};
