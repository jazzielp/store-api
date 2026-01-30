import express, { type Router } from "express";
import { validate } from "@/middlewares/validate";
import { authenticate } from "@/middlewares/auth";
import {
  createBrandSchema,
  getBrandSchema,
  updateBrandSchema,
} from "@/schemas/brand.schema";
import * as BrandController from "@/controllers/brand.controller";
import { asyncHandler } from "@/utils/asyncHandler";

const routes: Router = express.Router();

routes.get("/", asyncHandler(BrandController.getAll));
routes.get(
  "/:id",
  validate(getBrandSchema),
  asyncHandler(BrandController.getById),
);
routes.post(
  "/",
  authenticate,
  validate(createBrandSchema),
  asyncHandler(BrandController.create),
);
routes.put(
  "/:id",
  authenticate,
  validate(getBrandSchema),
  validate(updateBrandSchema),
  asyncHandler(BrandController.update),
);
routes.delete(
  "/:id",
  authenticate,
  validate(getBrandSchema),
  asyncHandler(BrandController.remove),
);

export default routes;
