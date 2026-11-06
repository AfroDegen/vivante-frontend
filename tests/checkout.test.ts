import { describe, expect, it } from "vitest";
import { calculateOrder } from "../api/_lib/pricing";

describe("Server-side checkout pricing", () => {
  it("calculates the correct subtotal and delivery fee", () => {
    const result = calculateOrder([
      { productId: "gift-box-25000", quantity: 2 },
      { productId: "gift-box-18000", quantity: 1 },
    ]);

    expect(result.subtotalKobo).toBe(6800000);
    expect(result.deliveryKobo).toBe(300000);
    expect(result.totalKobo).toBe(7100000);
  });

  it("rejects unknown products", () => {
    expect(() =>
      calculateOrder([
        { productId: "unknown-product", quantity: 1 },
      ])
    ).toThrow("Invalid cart item.");
  });

  it("rejects invalid quantities", () => {
    expect(() =>
      calculateOrder([
        { productId: "gift-box-25000", quantity: 0 },
      ])
    ).toThrow("Invalid cart item.");
  });

  it("rejects an empty cart", () => {
    expect(() => calculateOrder([])).toThrow("Cart is empty.");
  });
});