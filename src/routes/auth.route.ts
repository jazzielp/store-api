import express, { type Router } from "express";

import { validate } from "@/middlewares/validate";
import { loginSchema } from "@/schemas/auth.schema";
import * as AuthController from "@/controllers/auth.controller";

const routes: Router = express.Router();

routes.post("/login", AuthController.login);

routes.post("/register", (req, res) => {});
routes.post("/logout", AuthController.logout);

export default routes;
