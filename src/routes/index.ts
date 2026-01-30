import express, { type Application } from "express";
import productRoutes from "./products.route";
import brandRoutes from "./brands.route";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";

export function routerApi(app: Application): void {
  const router = express.Router();
  app.use("/api/v1", router);

  router.use("/products", productRoutes);
  router.use("/brands", brandRoutes);
  router.use("/users", userRoutes);
  router.use("/auth", authRoutes);
}
