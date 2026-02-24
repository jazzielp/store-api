import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { app } from "@/index.ts";
import { prisma } from "@/lib/prisma";
import * as UserModel from "@/models/user.model";
import type { Brand, NewBrand } from "@/types/type";

describe("Brand test", () => {
  let server: any;
  let baseURL: string;
  let authURL: string;
  let authCookie = "";
  let seededBrandId: number;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    const port = address.port;
    baseURL = `http://localhost:${port}/api/v1/brands`;
    authURL = `http://localhost:${port}/api/v1/auth/login`;

    await prisma.brand.deleteMany();
    await prisma.user.deleteMany();

    const userEmail = `brand-test-${Date.now()}@example.com`;
    const userPassword = "secret123";

    await UserModel.createUser({
      fullname: "Brand Test",
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

    const seeded = await prisma.brand.create({
      data: {
        name: "Seed Brand",
        description: "Seed description",
      },
    });
    seededBrandId = seeded.id;
  });

  afterAll(async () => {
    await prisma.brand.deleteMany();
    await prisma.user.deleteMany();
    server.close();
  });

  test("GET /brands - should return all brands", async () => {
    const response = await fetch(baseURL);
    expect(response.status).toBe(200);
    const brands = (await response.json()) as Brand[];
    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);
  });

  test("POST /brands - should create a new brand", async () => {
    const newBrand: Required<NewBrand> = {
      name: "Brand D",
      description: "Brand D description",
    };
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify(newBrand),
    });
    expect(response.status).toBe(201);
    const createdBrand = (await response.json()) as Brand;
    expect(createdBrand).toHaveProperty("id");
    expect(createdBrand.name).toBe(newBrand.name);
    expect(createdBrand.description).toBe(newBrand.description);
  });

  test("GET /brands/:id - should return a brand by ID", async () => {
    const response = await fetch(`${baseURL}/${seededBrandId}`);
    expect(response.status).toBe(200);
    const brand = (await response.json()) as Brand;
    expect(brand).toHaveProperty("id", seededBrandId);
  });

  test("GET /brands/:id - should return 404 for non-existing brand", async () => {
    const response = await fetch(`${baseURL}/9999`);
    expect(response.status).toBe(404);
    const error = (await response.json()) as { error: { message: string } };
    expect(error).toHaveProperty("error");
    expect(error.error).toHaveProperty("message", "Brand not found");
  });

  test("PUT /brands/:id - should update a brand", async () => {
    const brand = await prisma.brand.create({
      data: {
        name: "Update Brand",
        description: "Update description",
      },
    });

    const patch = { name: "Updated Brand" };
    const response = await fetch(`${baseURL}/${brand.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify(patch),
    });
    expect(response.status).toBe(200);
    const updatedBrand = (await response.json()) as Brand;
    expect(updatedBrand.name).toBe(patch.name);
  });

  test("DELETE /brands/:id - should remove a brand", async () => {
    const brand = await prisma.brand.create({
      data: {
        name: "Delete Brand",
        description: "Delete description",
      },
    });

    const response = await fetch(`${baseURL}/${brand.id}`, {
      method: "DELETE",
      headers: {
        Cookie: authCookie,
      },
    });
    expect(response.status).toBe(204);

    const missing = await fetch(`${baseURL}/${brand.id}`);
    expect(missing.status).toBe(404);
  });

  test("POST /brands - should return 400 for invalid brand payload", async () => {
    const invalidBrand = { description: "Missing name" };
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify(invalidBrand),
    });
    expect(response.status).toBe(400);
    const error = (await response.json()) as { error: { message: string } };
    expect(error).toHaveProperty("error");
    expect(error.error).toHaveProperty("message", "Failed to validate");
  });
});
