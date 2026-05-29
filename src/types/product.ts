export interface ProductVariant {
  id: string;
  label: string;
  color: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  whatsapp: string;
  inStock: boolean;
  gallery?: string[];
  variants?: ProductVariant[];
}

export interface ShowcaseData {
  id: number;
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  whatsapp: string;
  inStock: boolean;
  gallery: string[];
  variants: ProductVariant[];
}
