import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { app } from "@/index.ts";
import { prisma } from "@/lib/prisma";
import * as UserModel from "@/models/user.model";
import type { NewProduct, Product } from "@/types/type";

describe("Product test", () => {
  let server: any;
  let baseURL: string;
  let authURL: string;
  let authCookie = "";
  let seededProductId: number;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    const port = address.port;
    baseURL = `http://localhost:${port}/api/v1/products`;
    authURL = `http://localhost:${port}/api/v1/auth/login`;

    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    const userEmail = `product-test-${Date.now()}@example.com`;
    const userPassword = "secret123";

    await UserModel.createUser({
      fullname: "Product Test",
      email: userEmail,
      password: userPassword,
    });

    const loginRes = await fetch(authURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    });

    const setCookie = loginRes.headers.get("set-cookie");
    if (!setCookie) {
      throw new Error("Login failed: missing auth cookie");
    }
    authCookie = setCookie.split(";")[0] ?? "";

    const seeded = await prisma.product.create({
      data: {
        name: "Seed Product",
        description: "Seed description",
        price: 100,
      },
    });
    seededProductId = seeded.id;
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
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
    const newProduct: NewProduct = {
      name: "Product D",
      description: "Product D description",
      price: 250,
    };
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify(newProduct),
    });
    expect(response.status).toBe(201);
    const createdProduct = (await response.json()) as Product;
    expect(createdProduct).toHaveProperty("id");
    expect(createdProduct.name).toBe(newProduct.name);
    expect(createdProduct.price).toBe(newProduct.price);
  });

  test("GET /products/:id - should return a product by ID", async () => {
    const response = await fetch(`${baseURL}/${seededProductId}`);
    expect(response.status).toBe(200);
    const product = (await response.json()) as Product;
    expect(product).toHaveProperty("id", seededProductId);
  });

  test("GET /products/:id - should return 404 for non-existing product", async () => {
    const response = await fetch(`${baseURL}/9999`);
    expect(response.status).toBe(404);
    const error = (await response.json()) as { error: { message: string } };
    expect(error).toHaveProperty("error");
    expect(error.error).toHaveProperty("message", "Product not found");
  });

  test("POST /products - should return 400 for invalid product payload", async () => {
    const invalidProduct = { name: "Invalid Product" }; // Missing price
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify(invalidProduct),
    });
    expect(response.status).toBe(400);
    const error = (await response.json()) as { error: { message: string } };
    expect(error).toHaveProperty("error");
    expect(error.error).toHaveProperty("message", "Failed to validate");
  });
});
