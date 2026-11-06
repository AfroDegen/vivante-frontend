import type {
  PaymentMethod,
  BankTransferDetails,
} from "../../src/lib/checkout/types";

interface InitiateInput {
  orderId: string;
  amountKobo: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  paymentMethod: PaymentMethod;
}

interface InitiateResult {
  transactionId: string;
  paymentUrl?: string;
  transfer?: BankTransferDetails;
}

const mode = process.env.PAYMENT_MODE ?? "mock";

async function liveRequest(
  path: string,
  method: "GET" | "POST",
  body?: unknown
) {
  const baseUrl = process.env.ALATPAY_BASE_URL;
  const apiKey = process.env.ALATPAY_API_KEY;
  const businessId = process.env.ALATPAY_BUSINESS_ID;
  const subscriptionKey = process.env.ALATPAY_SUBSCRIPTION_KEY;

  if (!baseUrl || !apiKey || !businessId || !subscriptionKey) {
    throw new Error("ALATPay credentials are incomplete.");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
        "Business-Id": businessId,
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error("ALATPay request failed.");
  }

  return result;
}

export async function initiateProviderPayment(
  input: InitiateInput
): Promise<InitiateResult> {
  if (mode === "mock") {
    return {
      transactionId: `MOCK-${input.orderId}`,
      ...(input.paymentMethod === "bank_transfer"
        ? {
            transfer: {
              accountName: "Vivante Lagos (TEST)",
              accountNumber: "0000000000",
              bankName: "ALATPay TEST BANK",
              amountKobo: input.amountKobo,
            },
          }
        : {
            paymentUrl: `/api/payments/mock?orderId=${input.orderId}`,
          }),
    };
  }

  const path = process.env.ALATPAY_INITIATE_PATH;

  if (!path) {
    throw new Error("ALATPAY_INITIATE_PATH is not configured.");
  }

  // The request mapping must match the confirmed merchant API contract.
  const result = await liveRequest(path, "POST", {
    orderId: input.orderId,
    amount: input.amountKobo / 100,
    currency: "NGN",
    customer: input.customer,
    paymentMethod: input.paymentMethod,
  });

  const transactionId = result.transactionId ?? result.data?.transactionId;

  if (!transactionId) {
    throw new Error("ALATPay returned no transaction reference.");
  }

  return {
    transactionId,
    paymentUrl: result.paymentUrl ?? result.data?.paymentUrl,
    transfer: result.transfer ?? result.data?.transfer,
  };
}

export async function verifyProviderPayment(
  transactionId: string,
  expectedAmountKobo: number
): Promise<boolean> {
  if (mode === "mock") {
    return transactionId.startsWith("MOCK-");
  }

  const pathTemplate = process.env.ALATPAY_VERIFY_PATH;

  if (!pathTemplate) {
    throw new Error("ALATPAY_VERIFY_PATH is not configured.");
  }

  const path = pathTemplate.replace(
    "{transactionId}",
    encodeURIComponent(transactionId)
  );

  const result = await liveRequest(path, "GET");

  const data = result.data ?? result;

  const amount = Number(data.amount);
  const status = String(data.status ?? "").toLowerCase();

  return (
    ["success", "successful", "completed", "paid"].includes(status) &&
    Math.round(amount * 100) === expectedAmountKobo
  );
}