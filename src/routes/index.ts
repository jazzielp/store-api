import express, { type Application } from "express";
import productRoutes from "./products.route";

export function routerApi(app: Application): void {
  const router = express.Router();
  app.use("/api/v1", router);

  router.use("/products", productRoutes);
}
