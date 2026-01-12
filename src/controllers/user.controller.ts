import type { Request, Response } from "express";
import type { NewUser } from "@/type";
import * as UserModel from "@/models/user.model";

export const getAll = async (req: Request, res: Response) => {
  const users = await UserModel.findAll();
  return res.json(users);
};

export const create = async (req: Request, res: Response) => {
  const body = req.body as NewUser;
  const created = await UserModel.createProduct(body);
  return res.status(201).json(created);
};
