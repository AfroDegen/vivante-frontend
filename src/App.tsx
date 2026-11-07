
import {
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";

import Cart from "./components/cart/Cart";
import Checkout from "./components/checkout/Checkout";
import ProductCatalogue from "./components/products/ProductCatalogue";
import type { CartItem } from "./lib/checkout/types";

type View = "store" | "cart" | "checkout";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<View>("store");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const closeMenu = () => setMenuOpen(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function addToCart(productId: string) {
    setCartItems((current) => {
      const existing = current.find(
        (item) => item.productId === productId
      );

      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          productId,
          quantity: 1,
        },
      ];
    });

    setView("cart");
    closeMenu();
  }

  function updateCart(items: CartItem[]) {
    setCartItems(items);
  }

  function goToStore() {
    setView("store");
    closeMenu();
  }

  return (
    <main className="vivante-site">
      {view === "store" && (
        <>
          <header className="navbar">
            <button
              type="button"
              className="wordmark"
              onClick={goToStore}
            >
              vivante<span>.</span>
            </button>

            <nav className={menuOpen ? "nav-links open" : "nav-links"}>
              <button type="button" onClick={goToStore}>
                Home
              </button>

              <a href="#products" onClick={closeMenu}>
                Shop
              </a>
            </nav>

            <button
              type="button"
              className="nav-cta"
              onClick={() => {
                setView("cart");
                closeMenu();
              }}
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <ShoppingBag size={16} />
              Bag ({cartCount})
            </button>

            <button
              type="button"
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </header>

          <section className="hero" id="home">
            <div className="hero-copy">
              <h1>
                Easier &amp; Happier
                <br />
                <em>Period Days.</em>
              </h1>

              <p>
                Curated with Utmost Love and Dedication.
              </p>

              <div className="hero-actions">
                <a className="primary-button" href="#products">
                  Explore our Boxes
                </a>
              </div>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="hero-art-inner">
                <span className="hero-art-word">vivante</span>
                <span className="hero-art-line" />
              </div>
            </div>
          </section>

          <section className="products-section" id="products">
            <ProductCatalogue onAddToCart={addToCart} />
          </section>

          <section
            className="proof-strip"
            aria-label="Vivante service highlights"
          >
            <div className="proof-item">
              <strong>2,000+</strong>
              <span>Boxes Sold</span>
            </div>

            <div className="proof-divider" />

            <div className="proof-item">
              <strong>Same-Day</strong>
              <span>Delivery in Lagos</span>
            </div>
          </section>
        </>
      )}

      {view === "cart" && (
        <section className="section">
          <button
            type="button"
            className="text-link"
            onClick={goToStore}
          >
            Continue shopping
          </button>

          <Cart
            items={cartItems}
            onChange={updateCart}
            onCheckout={() => setView("checkout")}
          />
        </section>
      )}

      {view === "checkout" && (
        <section className="section">
          <button
            type="button"
            className="text-link"
            onClick={() => setView("cart")}
          >
            Back to bag
          </button>

          <Checkout items={cartItems} />
        </section>
      )}

      <footer className="footer">
        <button
          type="button"
          className="wordmark"
          onClick={goToStore}
        >
          vivante<span>.</span>
        </button>

        <span>
          © {new Date().getFullYear()} Vivante Lagos
        </span>
      </footer>
    </main>
  );
}

export default App;
