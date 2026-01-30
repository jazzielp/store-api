import type { Request, Response } from "express";
import type { NewBrand } from "@/types/type";
import * as BrandModel from "@/models/brand.model";
import { ApiError } from "@/errors/ApiError";

export const getAll = async (req: Request, res: Response) => {
  const brands = await BrandModel.findAll();
  return res.json(brands);
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id");
  }

  const brand = await BrandModel.findById(id);
  if (!brand) {
    throw ApiError.notFound("Brand not found");
  }

  return res.json(brand);
};

export const create = async (req: Request, res: Response) => {
  const body = req.body as NewBrand;
  const created = await BrandModel.createBrand(body);
  return res.status(201).json(created);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id");
  }

  const patch = req.body as Partial<NewBrand>;
  const updated = await BrandModel.updateBrand(id, patch);
  if (!updated) {
    throw ApiError.notFound("Brand not found");
  }

  return res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id");
  }

  const deleted = await BrandModel.deleteBrand(id);
  if (!deleted) {
    throw ApiError.notFound("Brand not found");
  }

  return res.status(204).send();
};
