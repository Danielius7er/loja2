import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Product, ProductVariant } from "../types/product";

const DATA_PATH = path.join(process.cwd(), "src", "data", "products.json");

function sanitizeImagePath(image: string): boolean {
  return image.startsWith("/images/") && !image.includes("..");
}

function sanitizeVariant(raw: unknown): ProductVariant | null {
  if (!raw || typeof raw !== "object") return null;
  const v = raw as Record<string, unknown>;
  const id = String(v.id ?? "").trim();
  const label = String(v.label ?? "").trim();
  const color = String(v.color ?? "#111111").trim();
  const image = String(v.image ?? "").trim();
  if (!id || !label || !sanitizeImagePath(image)) return null;
  return { id, label, color, image };
}

function sanitizeProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  const id = Number(p.id);
  const price = Number(p.price);
  const name = String(p.name ?? "").trim();
  const image = String(p.image ?? "").trim();
  const description = String(p.description ?? "").trim();
  const whatsapp = String(p.whatsapp ?? "").replace(/\D/g, "");
  const inStock = Boolean(p.inStock);

  if (!Number.isFinite(id) || id < 1) return null;
  if (!Number.isFinite(price) || price < 0) return null;
  if (!name || !sanitizeImagePath(image)) return null;
  if (!whatsapp || whatsapp.length < 9) return null;
  if (!description || description.length < 10 || description.length > 800) return null;

  const galleryRaw = Array.isArray(p.gallery) ? p.gallery : [];
  const gallery = galleryRaw
    .map((g) => String(g).trim())
    .filter(sanitizeImagePath);

  const variantsRaw = Array.isArray(p.variants) ? p.variants : [];
  const variants = variantsRaw
    .map(sanitizeVariant)
    .filter((v): v is ProductVariant => v !== null);

  const product: Product = {
    id,
    name,
    price,
    image,
    description,
    whatsapp,
    inStock,
  };

  if (gallery.length > 0) product.gallery = gallery;
  if (variants.length > 0) product.variants = variants;

  return product;
}

export async function loadProducts(): Promise<Product[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(sanitizeProduct)
      .filter((p): p is Product => p !== null)
      .sort((a, b) => a.id - b.id);
  } catch {
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  const valid = products
    .map(sanitizeProduct)
    .filter((p): p is Product => p !== null);
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(valid, null, 2) + "\n", "utf-8");
}

export function nextId(products: Product[]): number {
  if (products.length === 0) return 1;
  return Math.max(...products.map((p) => p.id)) + 1;
}

export function validateProductInput(body: Record<string, unknown>): Omit<Product, "id"> | null {
  const price = Number(body.price);
  const name = String(body.name ?? "").trim();
  const image = String(body.image ?? "").trim();
  const description = String(body.description ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").replace(/\D/g, "");
  const inStock = body.inStock !== false && body.inStock !== "false";

  if (!name || name.length > 120) return null;
  if (!Number.isFinite(price) || price < 0) return null;
  if (!sanitizeImagePath(image)) return null;
  if (!whatsapp || whatsapp.length < 9) return null;
  if (!description || description.length < 10 || description.length > 800) return null;

  return { name, price, image, description, whatsapp, inStock };
}

export async function findProduct(id: number): Promise<Product | undefined> {
  const products = await loadProducts();
  return products.find((p) => p.id === id);
}
