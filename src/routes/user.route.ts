import express, { type Router } from "express";
import { validate } from "@/middlewares/validate";
import { authenticate } from "@/middlewares/auth";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "@/schemas/user.schema.ts";
import * as UserController from "@/controllers/user.controller";
import { asyncHandler } from "@/utils/asyncHandler";

const routes: Router = express.Router();
routes.get("/", authenticate, asyncHandler(UserController.getAll));
routes.get(
  "/:id",
  authenticate,
  validate(getUserSchema),
  asyncHandler(UserController.getById),
);
routes.post(
  "/",
  authenticate,
  validate(createUserSchema),
  asyncHandler(UserController.create),
);
routes.put(
  "/:id",
  authenticate,
  validate(getUserSchema),
  validate(updateUserSchema),
  asyncHandler(UserController.update),
);
routes.delete(
  "/:id",
  authenticate,
  validate(getUserSchema),
  asyncHandler(UserController.remove),
);

export default routes;
