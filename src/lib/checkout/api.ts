import type {
  CheckoutRequest,
  InitiatePaymentResponse,
  VerifyPaymentResponse,
} from "./types";

async function request<T>(
  path: string,
  body: unknown
): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.error || "Something went wrong. Please try again."
    );
  }

  return result as T;
}

export function initiatePayment(
  payload: CheckoutRequest
): Promise<InitiatePaymentResponse> {
  return request("/api/payments/initiate", payload);
}

export function verifyPayment(
  orderId: string,
  transactionId: string
): Promise<VerifyPaymentResponse> {
  return request("/api/payments/verify", {
    orderId,
    transactionId,
  });
}