
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
  transactionId?: string;
  transfer?: BankTransferDetails;
}

interface AlatResponse {
  status?: boolean;
  message?: string;
  data?: Record<string, any>;
}

const BASE_URL =
  process.env.ALATPAY_BASE_URL ?? "https://apibox.alatpay.ng";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

async function alatRequest(
  path: string,
  method: "GET" | "POST",
  body?: unknown
): Promise<AlatResponse> {
  const subscriptionKey = requiredEnv(
    "ALATPAY_SUBSCRIPTION_KEY"
  );

  const response = await fetch(
    `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
      ...(body !== undefined
        ? { body: JSON.stringify(body) }
        : {}),
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok || !result) {
    console.error("ALATPay HTTP error:", response.status);

    throw new Error("ALATPay request failed.");
  }

  if (result.status === false) {
    throw new Error(
      result.message || "ALATPay rejected the request."
    );
  }

  return result;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);

  return {
    firstName: parts[0] || "Customer",
    lastName: parts.slice(1).join(" ") || "Vivante",
  };
}

export async function initiateProviderPayment(
  input: InitiateInput
): Promise<InitiateResult> {
  if (input.paymentMethod === "card") {
    // Card checkout is initialized by the hosted browser plugin.
    // No card data is collected or transmitted by our application.
    return {};
  }

  const businessId = requiredEnv("ALATPAY_BUSINESS_ID");
  const { firstName, lastName } = splitName(
    input.customer.fullName
  );

  const result = await alatRequest(
    "/bank-transfer/api/v1/bankTransfer/virtualAccount",
    "POST",
    {
      businessId,
      amount: input.amountKobo / 100,
      currency: "NGN",
      orderId: input.orderId,
      description: "Vivante Lagos order",
      customer: {
        email: input.customer.email,
        phone: input.customer.phone,
        firstName,
        lastName,
        metadata: JSON.stringify({
          orderId: input.orderId,
        }),
      },
    }
  );

  const data = result.data;

  if (
    !data?.transactionId ||
    !data?.virtualBankAccountNumber ||
    !data?.virtualBankCode
  ) {
    throw new Error(
      "ALATPay did not return complete virtual account details."
    );
  }

  return {
    transactionId: String(data.transactionId),
    transfer: {
      accountName:
        data.businessName || "Vivante Lagos",
      accountNumber: String(
        data.virtualBankAccountNumber
      ),
      bankName: `Bank code ${data.virtualBankCode}`,
      amountKobo: input.amountKobo,
      expiresAt: data.expiredAt
        ? String(data.expiredAt)
        : undefined,
    },
  };
}

export async function verifyProviderPayment(
  transactionId: string,
  orderId: string,
  expectedAmountKobo: number
): Promise<boolean> {
  if (!transactionId || !orderId) {
    return false;
  }

  const businessId = requiredEnv("ALATPAY_BUSINESS_ID");

  const path =
    "/alatpaytransaction/api/v1/transactions/" +
    encodeURIComponent(transactionId);

  const result = await alatRequest(path, "GET");
  const data = result.data;

  if (!data) {
    return false;
  }

  const returnedTransactionId = String(
    data.transactionId ?? data.id ?? ""
  );

  const returnedOrderId = String(data.orderId ?? "");
  const returnedBusinessId = String(data.businessId ?? "");
  const returnedCurrency = String(
    data.currency ?? ""
  ).toUpperCase();

  const returnedStatus = String(
    data.status ?? ""
  ).trim().toLowerCase();

  const returnedAmountKobo = Math.round(
    Number(data.amount) * 100
  );

  const successfulStatuses = [
    "success",
    "successful",
    "completed",
    "paid",
  ];

  return (
    returnedTransactionId === transactionId &&
    returnedOrderId === orderId &&
    returnedBusinessId === businessId &&
    returnedCurrency === "NGN" &&
    successfulStatuses.includes(returnedStatus) &&
    Number.isFinite(returnedAmountKobo) &&
    returnedAmountKobo === expectedAmountKobo
  );
}
