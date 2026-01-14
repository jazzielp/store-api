import express, { type Application } from "express";
import productRoutes from "./products.route.ts";
import userRoutes from "./user.route.ts";

export function routerApi(app: Application): void {
  const router = express.Router();
  app.use("/api/v1", router);

  router.use("/products", productRoutes);
  router.use("/users", userRoutes);
}
