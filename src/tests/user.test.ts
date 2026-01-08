import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { app } from "@/index.ts";

describe("Users API - Full CRUD", () => {
  let server: any;
  const base = process.env.BASE_URL ?? "http://localhost:3000/api/v1";
  const baseURL = `${base}/users`;

  beforeAll(() => {
    server = app.listen(3000);
  });

  afterAll(() => {
    server.close();
  });

  test("Full CRUD flow for users", async () => {
    // CREATE
    const createPayload = { name: "Alice", email: "alice@example.com" };
    const createRes = await fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createPayload),
    });
    expect(createRes.status).toBe(201);
    const created = await createRes.json();
    expect(created).toHaveProperty("id");
    expect(created.name).toBe(createPayload.name);
    const id = created.id;

    // GET ALL
    const listRes = await fetch(baseURL);
    expect(listRes.status).toBe(200);
    const list = await listRes.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list.some((u: any) => u.id === id)).toBe(true);

    // GET BY ID
    const getRes = await fetch(`${baseURL}/${id}`);
    expect(getRes.status).toBe(200);
    const got = await getRes.json();
    expect(got.id).toBe(id);

    // UPDATE
    const patch = { name: "Alice Updated" };
    const updateRes = await fetch(`${baseURL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    expect(updateRes.status).toBe(200);
    const updated = await updateRes.json();
    expect(updated.name).toBe(patch.name);

    // DELETE
    const delRes = await fetch(`${baseURL}/${id}`, { method: "DELETE" });
    // allow 200 or 204 depending on implementation
    expect([200, 204]).toContain(delRes.status);

    // GET BY ID should now 404
    const missing = await fetch(`${baseURL}/${id}`);
    expect(missing.status).toBe(404);
  });
});
