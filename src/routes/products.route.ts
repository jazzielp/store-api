import express, { type Router } from "express";
import { validate } from "@/middlewares/validate";
import {
  createProdcutSchema,
  getProductSchema,
  updateProductSchema,
} from "@/schemas/product.schema";
import * as ProductController from "@/controllers/product.controller";

const routes: Router = express.Router();

routes.get("/", ProductController.getAll);
routes.get("/:id", validate(getProductSchema), ProductController.getById);
routes.post("/", validate(createProdcutSchema), ProductController.create);
routes.put(
  "/:id",
  validate(getProductSchema),
  validate(updateProductSchema),
  ProductController.update
);
routes.delete("/:id", validate(getProductSchema), ProductController.remove);

export default routes;
