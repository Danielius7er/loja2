import type { APIRoute } from "astro";
import { getSessionFromCookie } from "../../../lib/auth";
import {
  loadProducts,
  saveProducts,
  validateProductInput,
} from "../../../lib/products-store";

export const prerender = false;

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export const PUT: APIRoute = async ({ params, request }) => {
  const cookie = request.headers.get("cookie");
  if (!getSessionFromCookie(cookie)) return unauthorized();

  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), { status: 400 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const input = validateProductInput(body);
    if (!input) {
      return new Response(JSON.stringify({ error: "Invalid product data" }), {
        status: 400,
      });
    }

    const products = await loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    products[index] = { id, ...input };
    await saveProducts(products);
    return new Response(JSON.stringify(products[index]));
  } catch {
    return new Response(JSON.stringify({ error: "Bad request" }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const cookie = request.headers.get("cookie");
  if (!getSessionFromCookie(cookie)) return unauthorized();

  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), { status: 400 });
  }

  const products = await loadProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  await saveProducts(filtered);
  return new Response(JSON.stringify({ ok: true }));
};
