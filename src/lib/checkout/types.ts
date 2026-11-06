
export type PaymentMethod = "card" | "bank_transfer";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  deliveryNote?: string;
}

export interface CheckoutRequest {
  customer: CustomerDetails;
  items: CartItem[];
  paymentMethod: PaymentMethod;
}

export interface OrderSummary {
  orderId: string;
  subtotalKobo: number;
  deliveryKobo: number;
  totalKobo: number;
  currency: "NGN";
}

export type OrderStatus = "pending" | "paid" | "failed";

export interface BankTransferDetails {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  amountKobo: number;
  expiresAt?: string;
}

export interface InitiatePaymentResponse {
  order: OrderSummary;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentUrl?: string;
  transactionId?: string;
  transfer?: BankTransferDetails;
  message?: string;
}

export interface VerifyPaymentResponse {
  orderId: string;
  status: OrderStatus;
  message: string;
}
