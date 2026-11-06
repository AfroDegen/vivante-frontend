import { store } from "../../config/store";
import type { CartItem } from "../../lib/checkout/types";

interface Props {
  items: CartItem[];
  onChange: (items: CartItem[]) => void;
  onCheckout: () => void;
}

const formatNaira = (kobo: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);

export default function Cart({
  items,
  onChange,
  onCheckout,
}: Props) {
  const lines = items.map((item) => {
    const product = store.products.find(
      (product) => product.id === item.productId && product.active
    );

    return {
      ...item,
      product,
      lineTotal: product
        ? product.priceKobo * item.quantity
        : 0,
    };
  });

  const subtotal = lines.reduce(
    (total, line) => total + line.lineTotal,
    0
  );

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    onChange(
      items.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  function removeItem(productId: string) {
    onChange(items.filter((item) => item.productId !== productId));
  }

  if (!items.length) {
    return (
      <section className="cart-empty">
        <h2>Your bag is empty</h2>
        <p>Explore our collection and find something special.</p>
      </section>
    );
  }

  return (
    <section className="cart">
      <header className="cart-header">
        <h2>Your shopping bag</h2>
        <span>{items.length} item(s)</span>
      </header>

      <div className="cart-items">
        {lines.map((line) => (
          <article className="cart-item" key={line.productId}>
            <div className="cart-item-details">
              <h3>{line.product?.name ?? "Unavailable product"}</h3>
              <p>
                {line.product
                  ? formatNaira(line.product.priceKobo)
                  : "Unavailable"}
              </p>

              <div className="cart-quantity">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    updateQuantity(line.productId, line.quantity - 1)
                  }
                >
                  −
                </button>

                <span>{line.quantity}</span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    updateQuantity(line.productId, line.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="cart-item-price">
              <strong>{formatNaira(line.lineTotal)}</strong>
              <button
                type="button"
                className="cart-remove"
                onClick={() => removeItem(line.productId)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="cart-subtotal">
        <span>Subtotal</span>
        <strong>{formatNaira(subtotal)}</strong>
      </div>

      <p className="cart-delivery-note">
        Delivery calculated at checkout.
      </p>

      <button
        type="button"
        className="cart-checkout"
        onClick={onCheckout}
        disabled={lines.some((line) => !line.product)}
      >
        Proceed to checkout
      </button>
    </section>
  );
}