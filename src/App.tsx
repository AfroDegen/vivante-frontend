
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Menu,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import { useState } from "react";

import Cart from "./components/cart/Cart";
import Checkout from "./components/checkout/Checkout";
import ProductCatalogue from "./components/products/ProductCatalogue";

import type { CartItem } from "./lib/checkout/types";

type View = "store" | "cart" | "checkout";

const collections = [
  {
    number: "01",
    name: "Period Care",
    description: "Thoughtful essentials for every cycle.",
    price: "Explore our care collection",
  },
  {
    number: "02",
    name: "Gift Boxes",
    description: "Beautifully curated gifts for someone special.",
    price: "Thoughtful gifts, beautifully wrapped",
  },
  {
    number: "03",
    name: "Self-Care",
    description: "Little reminders to put yourself first.",
    price: "Make time for yourself",
  },
];

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
    <main>
      <div className="announcement">
        A little more care, delivered to your door.
      </div>

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

          <a href="#collections" onClick={closeMenu}>
            Collections
          </a>

          <a href="#story" onClick={closeMenu}>
            Our Story
          </a>

          <a href="#contact" onClick={closeMenu}>
            Contact
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
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {view === "store" && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">
                <Sparkles size={14} />
                CARE, CONSIDERED
              </span>

              <h1>
                Make room
                <br />
                for <em>yourself.</em>
              </h1>

              <p>
                Thoughtful period care and beautifully curated gifts.
                Because feeling cared for should never be an afterthought.
              </p>

              <div className="hero-actions">
                <a className="primary-button" href="#products">
                  Discover the collection
                  <ArrowRight size={17} />
                </a>

                <a className="text-link" href="#story">
                  Get to know us
                </a>
              </div>

              <div className="hero-note">
                <Heart size={15} />
                Made with care. Delivered with love.
              </div>
            </div>

            <div className="hero-art">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="hero-sun" />

              <div className="gift-box">
                <div className="gift-lid">
                  <div className="gift-bow" />
                </div>

                <div className="gift-body">
                  <span>vivante</span>
                </div>

                <div className="gift-ribbon" />
              </div>

              <div className="floating-card">
                <Heart size={16} fill="currentColor" />
                <span>A gift of care</span>
              </div>

              <span className="art-caption">
                A little joy, beautifully wrapped.
              </span>
            </div>
          </section>

          <section className="trust-strip">
            <div>
              <Heart size={18} />
              Thoughtfully curated
            </div>

            <div>
              <Package size={18} />
              Beautifully packaged
            </div>

            <div>
              <ShieldCheck size={18} />
              Care in every detail
            </div>
          </section>

          <section
            className="collections section"
            id="collections"
          >
            <div className="section-heading">
              <div>
                <span className="eyebrow">THE VIVANTE EDIT</span>
                <h2>
                  Care in every <em>form.</em>
                </h2>
              </div>

              <p>Find something that feels just right.</p>
            </div>

            <div className="collection-grid">
              {collections.map((item) => (
                <article
                  className="collection-card"
                  key={item.number}
                >
                  <div className={`collection-art art-${item.number}`}>
                    <span>{item.number}</span>

                    <div className="mini-gift">
                      <div className="mini-bow" />
                      <div className="mini-box" />
                    </div>
                  </div>

                  <div className="collection-info">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <span className="price">{item.price}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* REAL VIVANTE PRODUCT CATALOGUE */}
          <section className="section" id="products">
            <ProductCatalogue onAddToCart={addToCart} />
          </section>

          <section className="story section" id="story">
            <div className="story-art">
              <div className="story-circle">
                <Heart size={42} strokeWidth={1} />
                <span>with love</span>
              </div>
            </div>

            <div className="story-copy">
              <span className="eyebrow">A NOTE FROM VIVANTE</span>

              <h2>
                Because care is not a <em>luxury.</em>
              </h2>

              <p>
                We believe the little things matter. A package that
                arrives at the right moment. Essentials chosen with
                intention. A gift that says, “I thought of you.”
              </p>

              <p>
                Vivante is here to make everyday care feel a little
                more special — one thoughtful box at a time.
              </p>

              <a className="text-link" href="#contact">
                Say hello
                <ArrowRight size={16} />
              </a>
            </div>
          </section>

          <section className="custom-cta" id="contact">
            <span className="eyebrow">SOMETHING PERSONAL</span>

            <h2>
              A little care goes a <em>long way.</em>
            </h2>

            <p>
              Have a special request or want to create a gift of your
              own? We'd love to hear from you.
            </p>

            <a
              className="primary-button light-button"
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
            >
              Let's create something
              <ArrowUpRight size={17} />
            </a>
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
            <ArrowRight size={16} />
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
            <ArrowRight size={16} />
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

        <p>Thoughtful care, always.</p>

        <span>© {new Date().getFullYear()} Vivante Lagos</span>
      </footer>

      <style>{`
        .navbar button.wordmark,
        .footer button.wordmark {
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
          font-family: 'Bodoni Moda', serif;
          font-size: 35px;
          letter-spacing: -2px;
          color: inherit;
        }

        .navbar button.wordmark span,
        .footer button.wordmark span {
          color: #9c76b4;
        }

        .nav-links button {
          border: 0;
          background: transparent;
          color: #655e68;
          font: inherit;
          font-size: 12px;
          cursor: pointer;
        }

        .nav-cta {
          cursor: pointer;
          font-family: inherit;
          background: white;
          color: #513768;
        }

        .section > .text-link {
          border: 0;
          background: transparent;
          cursor: pointer;
          margin-bottom: 24px;
        }

        .cart,
        .cart-empty {
          max-width: 680px;
          margin: 30px auto;
          padding: 24px;
          border: 1px solid #eee5f3;
          border-radius: 14px;
          background: white;
        }

        .cart-header,
        .cart-item,
        .cart-subtotal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .cart-item {
          padding: 20px 0;
          border-bottom: 1px solid #eee5f3;
        }

        .cart-item h3 {
          margin: 0 0 8px;
          font-family: 'Bodoni Moda', serif;
        }

        .cart-item p,
        .cart-delivery-note {
          color: #827b85;
          font-size: 13px;
        }

        .cart-quantity {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 12px;
        }

        .cart-quantity button,
        .cart-remove {
          border: 1px solid #ded5e3;
          background: white;
          color: #513768;
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
        }

        .cart-item-price {
          text-align: right;
        }

        .cart-remove {
          display: block;
          margin-top: 10px;
        }

        .cart-subtotal {
          padding-top: 20px;
          margin-top: 10px;
          border-top: 1px solid #eee5f3;
          color: #513768;
        }

        .cart-checkout {
          width: 100%;
          margin-top: 15px;
          padding: 15px;
          background: #76518f;
          color: white;
          border: 0;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 560px) {
          .cart {
            padding: 16px;
          }

          .cart-item {
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}

export default App;
