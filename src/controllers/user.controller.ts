import type { Request, Response } from "express";
import type { NewUser } from "@/type";
import * as UserModel from "@/models/user.model";

export const getAll = async (req: Request, res: Response) => {
  const users = await UserModel.findAll();
  return res.json(users);
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json(user);
};

export const create = async (req: Request, res: Response) => {
  const body = req.body as NewUser;
  const created = await UserModel.createProduct(body);
  return res.status(201).json(created);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const patch = req.body as Partial<NewUser>;
  const updated = await UserModel.updateProduct(id, patch);
  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await UserModel.deleteProduct(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};
