import type { Product, ProductVariant, ShowcaseData } from "../types/product";
import { formatPrice } from "./format";

function uniqueImages(images: string[]): string[] {
  return [...new Set(images.filter(Boolean))];
}

export function getShowcaseData(product: Product): ShowcaseData {
  const variants: ProductVariant[] =
    product.variants && product.variants.length > 0
      ? product.variants
      : [
          {
            id: "default",
            label: "Padrão",
            color: "#111111",
            image: product.image,
          },
        ];

  const gallery = uniqueImages([
    ...(product.gallery ?? []),
    product.image,
    ...variants.map((v) => v.image),
  ]);

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    priceFormatted: formatPrice(product.price),
    description: product.description,
    whatsapp: product.whatsapp,
    inStock: product.inStock,
    gallery,
    variants,
  };
}
