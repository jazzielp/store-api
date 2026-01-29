import express, { type Router } from "express";
import { validate } from "@/middlewares/validate";
import { authenticate } from "@/middlewares/auth";
import {
  createProdcutSchema,
  getProductSchema,
  updateProductSchema,
} from "@/schemas/product.schema";
import * as ProductController from "@/controllers/product.controller";
import { asyncHandler } from "@/utils/asyncHandler";

const routes: Router = express.Router();

routes.get("/", asyncHandler(ProductController.getAll));
routes.get(
  "/:id",
  validate(getProductSchema),
  asyncHandler(ProductController.getById),
);
routes.post(
  "/",
  authenticate,
  validate(createProdcutSchema),
  asyncHandler(ProductController.create),
);
routes.put(
  "/:id",
  authenticate,
  validate(getProductSchema),
  validate(updateProductSchema),
  asyncHandler(ProductController.update),
);
routes.delete(
  "/:id",
  authenticate,
  validate(getProductSchema),
  asyncHandler(ProductController.remove),
);

export default routes;
