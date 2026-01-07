import express, { type Request, type Response, type Router } from "express";
const routes: Router = express.Router();

type Product = { id: number; name: string; price: number };

const products: Product[] = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 150 },
  { id: 3, name: "Product C", price: 200 },
];

routes.get("/", (req: Request, res: Response) => {
  return res.json(products);
});

export default routes;
