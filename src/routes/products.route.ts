import express, { type Router } from "express";
import { validate } from "@/middlewares/validate";
import { authenticate } from "@/middlewares/auth";
import {
  createProdcutSchema,
  getProductSchema,
  updateProductSchema,
} from "@/schemas/product.schema";
import * as ProductController from "@/controllers/product.controller";

const routes: Router = express.Router();

routes.get("/", ProductController.getAll);
routes.get("/:id", validate(getProductSchema), ProductController.getById);
routes.post(
  "/",
  authenticate,
  validate(createProdcutSchema),
  ProductController.create
);
routes.put(
  "/:id",
  authenticate,
  validate(getProductSchema),
  validate(updateProductSchema),
  ProductController.update
);
routes.delete(
  "/:id",
  authenticate,
  validate(getProductSchema),
  ProductController.remove
);

export default routes;
