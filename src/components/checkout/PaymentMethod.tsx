import type { PaymentMethod as Method } from "../../lib/checkout/types";

interface Props {
  value: Method;
  onChange: (value: Method) => void;
}

export default function PaymentMethod({ value, onChange }: Props) {
  return (
    <section className="checkout-section">
      <h2>Payment method</h2>

      <label className="payment-option">
        <input
          type="radio"
          name="payment"
          checked={value === "card"}
          onChange={() => onChange("card")}
        />
        <span>Debit or credit card</span>
      </label>

      <label className="payment-option">
        <input
          type="radio"
          name="payment"
          checked={value === "bank_transfer"}
          onChange={() => onChange("bank_transfer")}
        />
        <span>Bank transfer</span>
      </label>
    </section>
  );
}