import type { APIRoute } from "astro";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getSessionFromCookie } from "../../lib/auth";

export const prerender = false;

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
  const cookie = request.headers.get("cookie");
  if (!getSessionFromCookie(cookie)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: "No file" }), { status: 400 });
    }

    if (!ALLOWED.has(file.type) || file.size > MAX_BYTES) {
      return new Response(JSON.stringify({ error: "Invalid file" }), { status: 400 });
    }

    const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const imagesDir = path.join(process.cwd(), "public", "images");
    await mkdir(imagesDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(imagesDir, safeName), buffer);

    const url = `/images/${safeName}`;
    return new Response(JSON.stringify({ url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
  }
};
