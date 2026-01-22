import type { Request, Response } from "express";
import type { NewProduct } from "@/types/type";
import * as ProductModel from "@/models/product.model";

export const getAll = async (req: Request, res: Response) => {
  const products = await ProductModel.findAll();
  return res.json(products);
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const product = await ProductModel.findById(id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.json(product);
};

export const create = async (req: Request, res: Response) => {
  const body = req.body as NewProduct;
  const created = await ProductModel.createProduct(body);
  return res.status(201).json(created);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const patch = req.body as Partial<NewProduct>;
  const updated = await ProductModel.updateProduct(id, patch);
  if (!updated) return res.status(404).json({ error: "Product not found" });
  return res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const deleted = await ProductModel.deleteProduct(id);
  if (!deleted) return res.status(404).json({ error: "Product not found" });
  return res
    .status(204)
    .send(`El producto ${deleted.name} con id ${deleted.id} ha sido eliminado`);
};
