import type { CartItem } from "../../lib/checkout/types";

interface Props {
  items: CartItem[];
}

// Display values mirror api/_lib/pricing.ts.
// The server remains authoritative for the actual order total.
const products: Record<
  string,
  { name: string; priceKobo: number }
> = {
  "gift-box-25000": {
    name: "Gift Box",
    priceKobo: 2500000,
  },
  "gift-box-18000": {
    name: "Gift Box",
    priceKobo: 1800000,
  },
};

const DELIVERY_FEE_KOBO = 300000;

function formatNaira(amountKobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amountKobo / 100);
}

export default function OrderSummary({ items }: Props) {
  const lines = items.map((item) => {
    const product = products[item.productId];

    return {
      id: item.productId,
      name: product?.name ?? "Unknown product",
      quantity: item.quantity,
      priceKobo: product?.priceKobo ?? 0,
    };
  });

  const subtotalKobo = lines.reduce(
    (total, item) =>
      total + item.priceKobo * item.quantity,
    0
  );

  const totalKobo = subtotalKobo + DELIVERY_FEE_KOBO;

  return (
    <section className="checkout-section">
      <h2>Your order</h2>

      {lines.map((item) => (
        <div className="checkout-summary-line" key={item.id}>
          <span>
            {item.name} × {item.quantity}
          </span>

          <strong>
            {formatNaira(item.priceKobo * item.quantity)}
          </strong>
        </div>
      ))}

      <div className="checkout-summary-line">
        <span>Delivery</span>
        <strong>{formatNaira(DELIVERY_FEE_KOBO)}</strong>
      </div>

      <div className="checkout-total">
        <strong>Total</strong>
        <strong>{formatNaira(totalKobo)}</strong>
      </div>
    </section>
  );
}