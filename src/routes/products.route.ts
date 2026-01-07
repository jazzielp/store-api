import express, { type Request, type Response, type Router } from "express";
const routes: Router = express.Router();

type Product = { id: number; name: string; price: number };
type NewProduct = { name: string; price: number };

let products: Product[] = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 150 },
  { id: 3, name: "Product C", price: 200 },
];

function getNextId(): number {
  return products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
}

routes.get("/", (req: Request, res: Response) => {
  return res.json(products);
});

routes.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  return res.json(product);
});

routes.post("/", (req: Request, res: Response) => {
  const body = req.body as Partial<NewProduct>;
  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.price !== "number"
  ) {
    return res.status(400).json({ error: "Invalid product payload" });
  }

  const newProduct: Product = {
    id: getNextId(),
    name: body.name,
    price: body.price,
  };
  products.push(newProduct);
  return res.status(201).json(newProduct);
});

routes.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const body = req.body as Partial<NewProduct>;
  if (
    !body ||
    (body.name !== undefined && typeof body.name !== "string") ||
    (body.price !== undefined && typeof body.price !== "number")
  ) {
    return res.status(400).json({ error: "Invalid product payload" });
  }

  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  const updated: Product = { ...products[idx], ...body } as Product;
  products[idx] = updated;
  return res.json(updated);
});

routes.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  products = products.filter((p) => p.id !== id);
  return res.status(204).send();
});

export default routes;
