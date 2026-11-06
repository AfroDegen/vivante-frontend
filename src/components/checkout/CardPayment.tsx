
import { useEffect, useState } from "react";

import type {
  CustomerDetails,
  OrderSummary,
} from "../../lib/checkout/types";

interface AlatTransactionResponse {
  transactionId?: string;
  id?: string;
  data?: {
    transactionId?: string;
    id?: string;
  };
}

interface AlatPopup {
  show: () => void;
}

interface AlatpayApi {
  setup: (config: {
    apiKey: string;
    businessId: string;
    email: string;
    firstName: string;
    lastName: string;
    amount: number;
    currency: "NGN";
    phone?: string;
    color?: string;
    metadata: {
      orderId: string;
    };
    onTransaction: (
      response: AlatTransactionResponse
    ) => void;
    onClose: () => void;
  }) => AlatPopup;
}

declare global {
  interface Window {
    Alatpay?: AlatpayApi;
  }
}

interface Props {
  order: OrderSummary;
  customer: CustomerDetails;
  onTransaction: (
    transactionId: string
  ) => Promise<void>;
  onClose: () => void;
}

function getName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);

  return {
    firstName: parts[0] || "Customer",
    lastName: parts.slice(1).join(" ") || "Vivante",
  };
}

function getTransactionId(
  response: AlatTransactionResponse
): string | undefined {
  return (
    response?.transactionId ||
    response?.data?.transactionId ||
    response?.id ||
    response?.data?.id
  );
}

export default function CardPayment({
  order,
  customer,
  onTransaction,
  onClose,
}: Props) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const scriptUrl =
      "https://web.alatpay.ng/js/alatpay.js";

    const existing =
      document.querySelector<HTMLScriptElement>(
        `script[src="${scriptUrl}"]`
      );

    const handleLoad = () => {
      if (!active) return;

      if (window.Alatpay) {
        setReady(true);
      } else {
        setError(
          "ALATPay checkout could not be loaded."
        );
      }
    };

    const handleError = () => {
      if (active) {
        setError(
          "Unable to load ALATPay. Check your connection."
        );
      }
    };

    if (window.Alatpay) {
      setReady(true);
    } else if (existing) {
      existing.addEventListener("load", handleLoad);
      existing.addEventListener("error", handleError);
    } else {
      const script = document.createElement("script");

      script.src = scriptUrl;
      script.async = true;
      script.addEventListener("load", handleLoad);
      script.addEventListener("error", handleError);

      document.body.appendChild(script);
    }

    return () => {
      active = false;
      existing?.removeEventListener("load", handleLoad);
    };
  }, []);

  function openCheckout() {
    setError("");

    const apiKey =
      import.meta.env.VITE_ALATPAY_PUBLIC_KEY;

    const businessId =
      import.meta.env.VITE_ALATPAY_BUSINESS_ID;

    if (!apiKey || !businessId || !window.Alatpay) {
      setError(
        "ALATPay is not fully configured. Please contact Vivante."
      );
      return;
    }

    const { firstName, lastName } = getName(
      customer.fullName
    );

    try {
      const popup = window.Alatpay.setup({
        apiKey,
        businessId,
        email: customer.email,
        firstName,
        lastName,
        amount: order.totalKobo / 100,
        currency: "NGN",
        phone: customer.phone,
        color: "#8b6acb",
        metadata: {
          orderId: order.orderId,
        },
        onTransaction: async (response) => {
          const transactionId =
            getTransactionId(response);

          if (!transactionId) {
            setError(
              "ALATPay returned no transaction reference. Contact Vivante before retrying."
            );
            return;
          }

          setBusy(true);

          try {
            await onTransaction(transactionId);
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Payment verification is still pending."
            );
          } finally {
            setBusy(false);
          }
        },
        onClose: () => {
          onClose();
        },
      });

      popup.show();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to open ALATPay checkout."
      );
    }
  }

  return (
    <section className="checkout-section payment-provider">
      <h2>Secure card payment</h2>

      <p>
        Your card details are entered securely in
        ALATPay's hosted checkout.
      </p>

      {error && (
        <p role="alert" className="checkout-error">
          {error}
        </p>
      )}

      <button
        type="button"
        className="checkout-submit"
        disabled={!ready || busy}
        onClick={openCheckout}
      >
        {busy
          ? "Verifying payment..."
          : ready
            ? "Continue to secure payment"
            : "Loading secure checkout..."}
      </button>
    </section>
  );
}
