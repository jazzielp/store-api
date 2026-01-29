import type { Request, Response } from "express";
import type { NewUser } from "@/types/type";
import * as UserModel from "@/models/user.model";
import { ApiError } from "@/errors/ApiError";

export const getAll = async (req: Request, res: Response) => {
  const users = await UserModel.findAllUser();
  return res.json(users);
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id");
  }

  const user = await UserModel.findByIdUser(id);
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return res.json(user);
};

export const create = async (req: Request, res: Response) => {
  const body = req.body as NewUser;
  const created = await UserModel.createUser(body);
  return res.status(201).json(created);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id");
  }

  const patch = req.body as Partial<NewUser>;
  const updated = await UserModel.updateUser(id, patch);
  if (!updated) {
    throw ApiError.notFound("User not found");
  }

  return res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id");
  }

  await UserModel.deleteUser(id);
  // Si deleteUser lanza por not found, lo manejamos abajo o en el modelo
  return res.status(204).send();
};
