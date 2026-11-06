import type {
  CheckoutRequest,
  CustomerDetails,
} from "./types";

export function validateCustomer(
  customer: CustomerDetails
): string[] {
  const errors: string[] = [];

  if (customer.fullName.trim().length < 2) {
    errors.push("Enter your full name.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    errors.push("Enter a valid email address.");
  }

  if (customer.phone.replace(/\D/g, "").length < 10) {
    errors.push("Enter a valid phone number.");
  }

  if (customer.address.trim().length < 8) {
    errors.push("Enter your complete delivery address.");
  }

  return errors;
}

export function validateCheckout(
  payload: CheckoutRequest
): string[] {
  const errors = validateCustomer(payload.customer);

  if (!payload.items.length) {
    errors.push("Your cart is empty.");
  }

  for (const item of payload.items) {
    if (!item.productId || item.quantity < 1 || !Number.isInteger(item.quantity)) {
      errors.push("Your cart contains an invalid item.");
      break;
    }
  }

  if (!["card", "bank_transfer"].includes(payload.paymentMethod)) {
    errors.push("Choose a payment method.");
  }

  return errors;
}