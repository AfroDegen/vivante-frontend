
interface InitiateInput {
  orderId: string;
  amountKobo: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  paymentMethod: "card" | "bank_transfer";
}

interface BankTransferDetails {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  amountKobo: number;
  expiresAt?: string;
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
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

async function alatRequest(
  path: string,
  method: "GET" | "POST",
  body?: unknown
): Promise<AlatResponse> {
  const response = await fetch(
    `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": requiredEnv(
          "ALATPAY_SUBSCRIPTION_KEY"
        ),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok || !result) {
    throw new Error(`ALATPay request failed (${response.status}).`);
  }

  if (result.status === false) {
    throw new Error(result.message || "ALATPay rejected the request.");
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
): Promise<{
  transactionId?: string;
  transfer?: BankTransferDetails;
}> {
  if (input.paymentMethod === "card") {
    // Card payment uses ALATPay's hosted checkout overlay.
    return {};
  }

  const businessId = requiredEnv("ALATPAY_BUSINESS_ID");
  const { firstName, lastName } = splitName(input.customer.fullName);

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
        metadata: JSON.stringify({ orderId: input.orderId }),
      },
    }
  );

  const data = result.data;

  if (
    !data?.transactionId ||
    !data?.virtualBankAccountNumber ||
    !data?.virtualBankCode
  ) {
    throw new Error("ALATPay returned incomplete virtual account details.");
  }

  return {
    transactionId: String(data.transactionId),
    transfer: {
      accountName: data.businessName || "Vivante Lagos",
      accountNumber: String(data.virtualBankAccountNumber),
      bankCode: String(data.virtualBankCode),
      amountKobo: input.amountKobo,
      expiresAt: data.expiredAt ? String(data.expiredAt) : undefined,
    },
  };
}

export async function verifyProviderPayment(
  transactionId: string,
  orderId: string,
  expectedAmountKobo: number
): Promise<boolean> {
  if (!transactionId || !orderId) return false;

  const businessId = requiredEnv("ALATPAY_BUSINESS_ID");

  const result = await alatRequest(
    `/alatpaytransaction/api/v1/transactions/${encodeURIComponent(transactionId)}`,
    "GET"
  );

  const data = result.data;
  if (!data) return false;

  // ALATPay's single-transaction response uses data.id.
  const returnedTransactionId = String(data.id ?? "");
  const returnedStatus = String(data.status ?? "")
    .trim()
    .toLowerCase();

  // Fail closed if any required verification field is missing.
  const returnedOrderId = String(data.orderId ?? "");
  const returnedBusinessId = String(data.businessId ?? "");
  const returnedCurrency = String(data.currency ?? "").toUpperCase();

  const amount = Number(data.amount);
  if (!Number.isFinite(amount)) return false;

  const returnedAmountKobo = Math.round(amount * 100);

  return (
    returnedTransactionId === transactionId &&
    returnedOrderId === orderId &&
    returnedBusinessId === businessId &&
    returnedCurrency === "NGN" &&
    ["success", "successful", "completed", "paid"].includes(returnedStatus) &&
    returnedAmountKobo === expectedAmountKobo
  );
}
