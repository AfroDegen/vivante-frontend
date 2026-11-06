import type { CartItem } from "../../src/lib/checkout/types";

const catalogue = {
  "gift-box-25000": {
    name: "Gift Box",
    priceKobo: 2500000,
  },
  "gift-box-18000": {
    name: "Gift Box",
    priceKobo: 1800000,
  },
};

const DELIVERY_FEE_KOBO = 300000;

export function calculateOrder(items: CartItem[]) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }

  const lines = items.map((item) => {
    const product = catalogue[
      item.productId as keyof typeof catalogue
    ];

    if (
      !product ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 50
    ) {
      throw new Error("Invalid cart item.");
    }

    return {
      productId: item.productId,
      name: product.name,
      quantity: item.quantity,
      unitPriceKobo: product.priceKobo,
      lineTotalKobo: product.priceKobo * item.quantity,
    };
  });

  const subtotalKobo = lines.reduce(
    (total, line) => total + line.lineTotalKobo,
    0
  );

  return {
    lines,
    subtotalKobo,
    deliveryKobo: DELIVERY_FEE_KOBO,
    totalKobo: subtotalKobo + DELIVERY_FEE_KOBO,
    currency: "NGN" as const,
  };
}