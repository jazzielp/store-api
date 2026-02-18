import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { app } from "@/index.ts";
import { prisma } from "@/lib/prisma";
import * as UserModel from "@/models/user.model";

describe("Users API - Full CRUD", () => {
  let server: any;
  const base = process.env.BASE_URL ?? "http://localhost:3000/api/v1";
  const baseURL = `${base}/users`;
  const authURL = `${base}/auth/login`;
  let authCookie = "";

  beforeAll(async () => {
    server = app.listen(3000);

    await prisma.user.deleteMany();

    const userEmail = `user-test-${Date.now()}@example.com`;
    const userPassword = "secret123";

    await UserModel.createUser({
      fullname: "User Test",
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
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    server.close();
  });

  test("Full CRUD flow for users", async () => {
    // CREATE
    const createPayload = {
      fullname: "Alice",
      email: "alice@example.com",
      password: "password123",
    };
    const createRes = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify(createPayload),
    });
    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as {
      id: number;
      fullname: string;
    };
    expect(created).toHaveProperty("id");
    expect(created.fullname).toBe(createPayload.fullname);
    const id = created.id;

    // GET ALL
    const listRes = await fetch(baseURL, {
      headers: {
        Cookie: authCookie,
      },
    });
    expect(listRes.status).toBe(200);
    const list = (await listRes.json()) as Array<{ id: number }>;
    expect(Array.isArray(list)).toBe(true);
    expect(list.some((u) => u.id === id)).toBe(true);

    // GET BY ID
    const getRes = await fetch(`${baseURL}/${id}`, {
      headers: {
        Cookie: authCookie,
      },
    });
    expect(getRes.status).toBe(200);
    const got = (await getRes.json()) as { id: number };
    expect(got.id).toBe(id);

    // UPDATE
    const patch = { fullname: "Alice Updated" };
    const updateRes = await fetch(`${baseURL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify(patch),
    });
    expect(updateRes.status).toBe(200);
    const updated = (await updateRes.json()) as { fullname: string };
    expect(updated.fullname).toBe(patch.fullname);

    // DELETE
    const delRes = await fetch(`${baseURL}/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: authCookie,
      },
    });
    // allow 200 or 204 depending on implementation
    expect([200, 204]).toContain(delRes.status);

    // GET BY ID should now 404
    const missing = await fetch(`${baseURL}/${id}`, {
      headers: {
        Cookie: authCookie,
      },
    });
    expect(missing.status).toBe(404);
  });
});
