import { describe, expect, it, beforeEach } from "vitest";

describe("Payment provider mock", () => {
  beforeEach(() => {
    process.env.PAYMENT_MODE = "mock";
  });

  it("accepts a mock transaction reference", async () => {
    const { verifyProviderPayment } = await import(
      "../api/_lib/provider"
    );

    await expect(
      verifyProviderPayment("MOCK-test-order", 7100000)
    ).resolves.toBe(true);
  });

  it("rejects a non-mock transaction reference", async () => {
    const { verifyProviderPayment } = await import(
      "../api/_lib/provider"
    );

    await expect(
      verifyProviderPayment("INVALID-123", 7100000)
    ).resolves.toBe(false);
  });
});