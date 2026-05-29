export function formatPrice(value: number): string {
  const amount = value.toLocaleString("pt-PT", { maximumFractionDigits: 0 });
  return `${amount.replace(/\s/g, ".")} Kz`;
}

export function whatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}
