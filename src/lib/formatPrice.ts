export function formatPrice(cents: number | null | undefined) {
  if (!cents && cents !== 0) return "$0.00";
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
