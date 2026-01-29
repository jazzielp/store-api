import type { Request, Response } from "express";
import type { NewProduct } from "@/types/type";
import * as ProductModel from "@/models/product.model";
import { ApiError } from "@/errors/ApiError";

export const getAll = async (req: Request, res: Response) => {
  const products = await ProductModel.findAll();
  return res.json(products);
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id");
  }

  const product = await ProductModel.findById(id);
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  return res.json(product);
};

export const create = async (req: Request, res: Response) => {
  const body = req.body as NewProduct;
  const created = await ProductModel.createProduct(body);
  return res.status(201).json(created);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id");
  }

  const patch = req.body as Partial<NewProduct>;
  const updated = await ProductModel.updateProduct(id, patch);
  if (!updated) {
    throw ApiError.notFound("Product not found");
  }

  return res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id");
  }

  const deleted = await ProductModel.deleteProduct(id);
  if (!deleted) {
    throw ApiError.notFound("Product not found");
  }

  // 204 sin body
  return res.status(204).send();
};
