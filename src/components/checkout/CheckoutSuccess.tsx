
import type { PaymentMethod } from "../../lib/checkout/types";

interface Props {
  orderId: string;
  paymentMethod: PaymentMethod;
  demo: boolean;
}

export default function CheckoutSuccess({
  orderId,
  paymentMethod,
  demo,
}: Props) {
  return (
    <section className="checkout-result">
      <div className="checkout-result-icon">✓</div>

      <p className="checkout-eyebrow">
        VIVANTE LAGOS
      </p>

      <h2>You've reached the final step.</h2>

      <p>
        Your checkout journey has been completed
        successfully in demo mode.
      </p>

      <div className="checkout-reference">
        <span>Demo reference</span>
        <strong>{orderId}</strong>
      </div>

      <div className="checkout-reference">
        <span>Selected payment method</span>
        <strong>
          {paymentMethod === "card"
            ? "Debit / credit card"
            : "Bank transfer"}
        </strong>
      </div>

      <div className="checkout-pending">
        <strong>Payment not collected</strong>
        <p>
          {paymentMethod === "card"
            ? "ALATPay hosted checkout is not connected yet."
            : "Vivante's verified transfer account has not been configured yet."}
        </p>
      </div>

      <p className="checkout-demo-disclaimer">
        {demo
          ? "This is a demonstration only. No real order was submitted, no payment was made, and no stock was reserved. This reference exists only in this browser session."
          : "Your order is awaiting confirmation."}
      </p>
    </section>
  );
}
