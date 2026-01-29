import express, { type Router } from "express";
import { validate } from "@/middlewares/validate";
import { authenticate } from "@/middlewares/auth";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "@/schemas/user.schema.ts";
import * as UserController from "@/controllers/user.controller";

const routes: Router = express.Router();
routes.get("/", authenticate, UserController.getAll);
routes.get(
  "/:id",
  authenticate,
  validate(getUserSchema),
  UserController.getById,
);
routes.post(
  "/",
  authenticate,
  validate(createUserSchema),
  UserController.create,
);
routes.put(
  "/:id",
  authenticate,
  validate(getUserSchema),
  validate(updateUserSchema),
  UserController.update,
);
routes.delete(
  "/:id",
  authenticate,
  validate(getUserSchema),
  UserController.remove,
);

export default routes;
