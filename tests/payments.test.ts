
import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

vi.stubGlobal("fetch", fetchMock);

describe("ALATPay transaction verification", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockReset();

    process.env.ALATPAY_BASE_URL = "https://apibox.alatpay.ng";
    process.env.ALATPAY_BUSINESS_ID = "business-123";
    process.env.ALATPAY_SUBSCRIPTION_KEY = "test-secret";
  });

  const transaction = {
    id: "txn-123",
    orderId: "order-123",
    businessId: "business-123",
    currency: "NGN",
    amount: 25000,
    status: "success",
  };

  function mockResponse(data: Record<string, unknown>) {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        status: true,
        message: "Success",
        data,
      }),
    });
  }

  it("accepts a correctly matched successful transaction", async () => {
    mockResponse(transaction);

    const { verifyProviderPayment } = await import(
      "../api/_lib/provider"
    );

    await expect(
      verifyProviderPayment("txn-123", "order-123", 2500000)
    ).resolves.toBe(true);
  });

  it("rejects a mismatched transaction ID", async () => {
    mockResponse({ ...transaction, id: "other-txn" });

    const { verifyProviderPayment } = await import(
      "../api/_lib/provider"
    );

    await expect(
      verifyProviderPayment("txn-123", "order-123", 2500000)
    ).resolves.toBe(false);
  });

  it("rejects a mismatched order ID", async () => {
    mockResponse({ ...transaction, orderId: "other-order" });

    const { verifyProviderPayment } = await import(
      "../api/_lib/provider"
    );

    await expect(
      verifyProviderPayment("txn-123", "order-123", 2500000)
    ).resolves.toBe(false);
  });

  it("rejects an incorrect amount", async () => {
    mockResponse({ ...transaction, amount: 18000 });

    const { verifyProviderPayment } = await import(
      "../api/_lib/provider"
    );

    await expect(
      verifyProviderPayment("txn-123", "order-123", 2500000)
    ).resolves.toBe(false);
  });

  it("rejects pending transactions", async () => {
    mockResponse({ ...transaction, status: "pending" });

    const { verifyProviderPayment } = await import(
      "../api/_lib/provider"
    );

    await expect(
      verifyProviderPayment("txn-123", "order-123", 2500000)
    ).resolves.toBe(false);
  });

  it("rejects a different currency", async () => {
    mockResponse({ ...transaction, currency: "USD" });

    const { verifyProviderPayment } = await import(
      "../api/_lib/provider"
    );

    await expect(
      verifyProviderPayment("txn-123", "order-123", 2500000)
    ).resolves.toBe(false);
  });

  it("uses the server-side subscription key", async () => {
    mockResponse(transaction);

    const { verifyProviderPayment } = await import(
      "../api/_lib/provider"
    );

    await verifyProviderPayment("txn-123", "order-123", 2500000);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/transactions/txn-123"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Ocp-Apim-Subscription-Key": "test-secret",
        }),
      })
    );
  });
});
