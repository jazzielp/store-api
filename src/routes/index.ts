import express, { type Application } from "express";
import productRoutes from "./products.route";

export function routerApi(app: Application): void {
  app.use("/products", productRoutes);
}
