
import { useState } from "react";

import CustomerForm from "./CustomerForm";
import OrderSummary from "./OrderSummary";
import PaymentMethod from "./PaymentMethod";
import CheckoutSuccess from "./CheckoutSuccess";

import { validateCheckout } from "../../lib/checkout/validation";
import { store } from "../../config/store";

import type {
  CartItem,
  CustomerDetails,
  PaymentMethod as Method,
} from "../../lib/checkout/types";

interface Props {
  items: CartItem[];
}

interface DemoConfirmation {
  orderId: string;
  paymentMethod: Method;
}

// DEMO MODE: no payment or database request is made.
const DEMO_MODE = true;

const emptyCustomer: CustomerDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  deliveryNote: "",
};

function createDemoReference() {
  return (
    "VIV-DEMO-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 7).toUpperCase()
  );
}

export default function Checkout({ items }: Props) {
  const [customer, setCustomer] = useState(emptyCustomer);
  const [method, setMethod] = useState<Method>("card");
  const [confirmation, setConfirmation] =
    useState<DemoConfirmation | null>(null);
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
      if (DEMO_MODE) {
        // Deliberately local: no customer data is transmitted.
        setConfirmation({
          orderId: createDemoReference(),
          paymentMethod: method,
        });
        return;
      }
    } catch {
      setError("We couldn't complete this demo. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (confirmation) {
    return (
      <CheckoutSuccess
        orderId={confirmation.orderId}
        paymentMethod={confirmation.paymentMethod}
        demo
      />
    );
  }

  return (
    <main className="checkout">
      <header className="checkout-header">
        <p className="checkout-eyebrow">{store.name}</p>
        <h1>Complete your order</h1>
        <p>You're just a few steps away.</p>
      </header>

      {DEMO_MODE && (
        <div className="demo-notice" role="status">
          <strong>DEMO CHECKOUT</strong>
          <span>
            Explore the customer journey. No payment will be
            collected and no real order will be submitted.
          </span>
        </div>
      )}

      <OrderSummary items={items} />

      <CustomerForm
        value={customer}
        onChange={setCustomer}
      />

      <PaymentMethod
        value={method}
        onChange={setMethod}
      />

      <div className="demo-payment-note">
        {method === "card"
          ? "Card checkout will be connected to ALATPay."
          : "Vivante bank transfer instructions will appear here once configured."}
      </div>

      {error && (
        <p role="alert" className="checkout-error">
          {error}
        </p>
      )}

      <button
        className="checkout-submit"
        disabled={busy}
        onClick={submit}
      >
        {busy ? "Preparing demo..." : "Place demo order"}
      </button>
    </main>
  );
}
