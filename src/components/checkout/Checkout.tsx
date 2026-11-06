
import { useState } from "react";

import CustomerForm from "./CustomerForm";
import OrderSummary from "./OrderSummary";
import PaymentMethod from "./PaymentMethod";
import BankTransfer from "./BankTransfer";
import CardPayment from "./CardPayment";

import { validateCheckout } from "../../lib/checkout/validation";
import {
  initiatePayment,
  verifyPayment,
} from "../../lib/checkout/api";

import { store } from "../../config/store";

import type {
  CartItem,
  CustomerDetails,
  PaymentMethod as Method,
  InitiatePaymentResponse,
  OrderSummary as OrderSummaryType,
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
  const [customer, setCustomer] =
    useState<CustomerDetails>(emptyCustomer);

  const [method, setMethod] =
    useState<Method>("card");

  const [payment, setPayment] =
    useState<InitiatePaymentResponse | null>(null);

  const [paidOrder, setPaidOrder] =
    useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't prepare your order."
      );
    } finally {
      setBusy(false);
    }
  }

  async function confirmTransaction(
    transactionId: string
  ) {
    if (!payment) return;

    setChecking(true);
    setError("");

    try {
      const result = await verifyPayment(
        payment.order.orderId,
        transactionId
      );

      if (result.status === "paid") {
        setPaidOrder(payment.order.orderId);
        return;
      }

      setError(
        "ALATPay has not confirmed this payment yet. Please wait and check again."
      );
    } finally {
      setChecking(false);
    }
  }

  async function checkTransfer() {
    if (!payment?.transactionId) {
      setError("Transfer reference is unavailable.");
      return;
    }

    await confirmTransaction(payment.transactionId);
  }

  if (paidOrder) {
    return (
      <main className="checkout checkout-result">
        <p className="checkout-eyebrow">
          {store.name}
        </p>

        <h1>Payment confirmed</h1>

        <p>
          Your payment has been verified by ALATPay.
          Vivante can now process your order.
        </p>

        <div className="checkout-reference">
          <span>Order reference</span>
          <strong>{paidOrder}</strong>
        </div>
      </main>
    );
  }

  if (payment) {
    return (
      <main className="checkout">
        <header className="checkout-header">
          <p className="checkout-eyebrow">
            {store.name}
          </p>

          <h1>Complete your payment</h1>

          <p>
            Order reference: {payment.order.orderId}
          </p>
        </header>

        <div className="checkout-reference">
          <span>Amount due</span>
          <strong>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              maximumFractionDigits: 0,
            }).format(
              payment.order.totalKobo / 100
            )}
          </strong>
        </div>

        {payment.paymentMethod === "card" ? (
          <CardPayment
            order={payment.order}
            customer={customer}
            onTransaction={confirmTransaction}
            onClose={() => {
              setError("");
            }}
          />
        ) : payment.transfer ? (
          <>
            <BankTransfer details={payment.transfer} />

            <button
              type="button"
              className="checkout-submit"
              disabled={checking || !payment.transactionId}
              onClick={checkTransfer}
            >
              {checking
                ? "Checking payment..."
                : "I've transferred — check payment"}
            </button>
          </>
        ) : (
          <p role="alert" className="checkout-error">
            Transfer account details were not returned.
            Please contact Vivante.
          </p>
        )}

        {error && (
          <p role="alert" className="checkout-error">
            {error}
          </p>
        )}
      </main>
    );
  }

  return (
    <main className="checkout">
      <header className="checkout-header">
        <p className="checkout-eyebrow">
          {store.name}
        </p>

        <h1>Complete your order</h1>

        <p>You're just a few steps away.</p>
      </header>

      <OrderSummary items={items} />

      <CustomerForm
        value={customer}
        onChange={setCustomer}
      />

      <PaymentMethod
        value={method}
        onChange={setMethod}
      />

      {error && (
        <p role="alert" className="checkout-error">
          {error}
        </p>
      )}

      <button
        type="button"
        className="checkout-submit"
        disabled={busy}
        onClick={submit}
      >
        {busy
          ? "Preparing your order..."
          : "Continue to payment"}
      </button>
    </main>
  );
}
