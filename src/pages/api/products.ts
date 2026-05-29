import type { APIRoute } from "astro";
import { getSessionFromCookie } from "../../lib/auth";
import {
  loadProducts,
  saveProducts,
  nextId,
  validateProductInput,
} from "../../lib/products-store";

export const prerender = false;

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get("cookie");
  if (!getSessionFromCookie(cookie)) return unauthorized();

  const products = await loadProducts();
  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const cookie = request.headers.get("cookie");
  if (!getSessionFromCookie(cookie)) return unauthorized();

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const input = validateProductInput(body);
    if (!input) {
      return new Response(JSON.stringify({ error: "Invalid product data" }), {
        status: 400,
      });
    }

    const products = await loadProducts();
    const product = { id: nextId(products), ...input };
    products.push(product);
    await saveProducts(products);

    return new Response(JSON.stringify(product), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: "Bad request" }), { status: 400 });
  }
};
