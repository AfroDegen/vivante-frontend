import { useState } from "react";

import CustomerForm from "./CustomerForm";
import OrderSummary from "./OrderSummary";
import PaymentMethod from "./PaymentMethod";
import CardPayment from "./CardPayment";
import BankTransfer from "./BankTransfer";
import CheckoutSuccess from "./CheckoutSuccess";

import { initiatePayment, verifyPayment } from "../../lib/checkout/api";
import { validateCheckout } from "../../lib/checkout/validation";
import { store } from "../../config/store";

import type {
  CartItem,
  CustomerDetails,
  PaymentMethod as Method,
  InitiatePaymentResponse,
} from "../../lib/checkout/types";

interface Props {
  items: CartItem[];
}

const emptyCustomer: CustomerDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  deliveryNote: "",
};

export default function Checkout({ items }: Props) {
  const [customer, setCustomer] = useState(emptyCustomer);
  const [method, setMethod] = useState<Method>("card");
  const [payment, setPayment] = useState<InitiatePaymentResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");

    const errors = validateCheckout({
      customer,
      items,
      paymentMethod: method,
    });

    if (errors.length) {
      setError(errors[0]);
      return;
    }

    setBusy(true);

    try {
      const result = await initiatePayment({
        customer,
        items,
        paymentMethod: method,
      });

      setPayment(result);

      if (method === "card" && result.paymentUrl) {
        window.location.assign(result.paymentUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  }

  async function checkPayment() {
    if (!payment?.order.orderId || !payment.transactionId) return;

    setBusy(true);
    setError("");

    try {
      const result = await verifyPayment(
        payment.order.orderId,
        payment.transactionId
      );

      setPayment((previous) =>
        previous
          ? {
              ...previous,
              status: result.status,
            }
          : previous
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setBusy(false);
    }
  }

  if (payment?.status === "paid" || payment?.status === "failed") {
    return (
      <CheckoutSuccess
        orderId={payment.order.orderId}
        status={payment.status}
      />
    );
  }

  if (payment?.transfer) {
    return (
      <div className="checkout">
        <BankTransfer details={payment.transfer} />
        <button disabled={busy} onClick={checkPayment}>
          Check payment status
        </button>
        {error && <p role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <main className="checkout">
      <header>
        <p className="checkout-eyebrow">{store.name}</p>
        <h1>Complete your order</h1>
      </header>

      <OrderSummary items={items} />

      <CustomerForm value={customer} onChange={setCustomer} />

      <PaymentMethod value={method} onChange={setMethod} />

      {method === "card" && <CardPayment onReady={() => {}} />}

      {error && <p role="alert" className="checkout-error">{error}</p>}

      <button
        className="checkout-submit"
        disabled={busy}
        onClick={submit}
      >
        {busy ? "Processing…" : "Continue to payment"}
      </button>
    </main>
  );
}