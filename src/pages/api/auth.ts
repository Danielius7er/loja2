import type { APIRoute } from "astro";
import {
  checkPassword,
  createSessionToken,
  sessionCookieHeader,
} from "../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as { password?: string };
    const password = String(body.password ?? "");

    if (!checkPassword(password)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = createSessionToken();
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": sessionCookieHeader(token),
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Bad request" }), { status: 400 });
  }
};
