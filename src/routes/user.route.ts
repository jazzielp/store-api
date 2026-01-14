import express, { type Router } from "express";
import { validate } from "@/middlewares/validate";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "@/schemas/user.schema.ts";
import * as UserController from "@/controllers/user.controller";

const routes: Router = express.Router();
routes.get("/", UserController.getAll);
routes.get("/:id", validate(getUserSchema), UserController.getById);
routes.post("/", validate(createUserSchema), UserController.create);
routes.put(
  "/:id",
  validate(getUserSchema),
  validate(updateUserSchema),
  UserController.update
);
routes.delete("/:id", validate(getUserSchema), UserController.remove);

export default routes;
