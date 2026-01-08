import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { app } from "@/index.ts";
import type { NewProduct, Product } from "@/type";

describe("Product test", () => {
  let server: any;
  let baseURL: string;

  beforeAll(() => {
    server = app.listen(0);
    const address = server.address();
    const port = address.port;
    baseURL = `http://localhost:${port}/api/v1/products`;
  });

  afterAll(() => {
    server.close();
  });

  test("GET /products - should return all products", async () => {
    const response = await fetch(baseURL);
    expect(response.status).toBe(200);
    const products = (await response.json()) as Product[];
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test("POST /products - should create a new product", async () => {
    const newProduct: NewProduct = { name: "Product D", price: 250 };
    const response = await fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    expect(response.status).toBe(201);
    const createdProduct = (await response.json()) as Product;
    expect(createdProduct).toHaveProperty("id");
    expect(createdProduct.name).toBe(newProduct.name);
    expect(createdProduct.price).toBe(newProduct.price);
  });

  test("GET /products/:id - should return a product by ID", async () => {
    const response = await fetch(`${baseURL}/1`);
    expect(response.status).toBe(200);
    const product = (await response.json()) as Product;
    expect(product).toHaveProperty("id", 1);
  });

  test("GET /products/:id - should return 404 for non-existing product", async () => {
    const response = await fetch(`${baseURL}/9999`);
    expect(response.status).toBe(404);
    const error = await response.json();
    expect(error).toHaveProperty("error", "Product not found");
  });

  test("POST /products - should return 400 for invalid product payload", async () => {
    const invalidProduct = { name: "Invalid Product" }; // Missing price
    const response = await fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidProduct),
    });
    expect(response.status).toBe(400);
    const error = await response.json();
    expect(error).toHaveProperty("error", "Failed to validate");
  });
});
