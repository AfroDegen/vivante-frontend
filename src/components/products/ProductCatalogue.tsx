import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { store } from "../../config/store";
import type { ProductCategory } from "../../config/store";

interface Props {
  onAddToCart: (productId: string) => void;
}

const categories = [
  "All",
  "Period Care Boxes",
  "Treat Boxes",
  "Essential Items",
  "Perfumes",
  "Gift Boxes",
  "Seasonal Boxes",
] as const;

type CategoryFilter = (typeof categories)[number];

const formatNaira = (kobo: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);

const categoryDescriptions: Record<ProductCategory, string> = {
  "Period Care Boxes":
    "Thoughtfully prepared care boxes for your cycle.",
  "Treat Boxes":
    "A little indulgence, beautifully packaged.",
  "Essential Items":
    "Everyday comfort and self-care essentials.",
  Perfumes:
    "Discover your next favourite scent.",
  "Gift Boxes":
    "Thoughtful gifts for someone special.",
  "Seasonal Boxes":
    "Special collections for the moments that matter.",
};

export default function ProductCatalogue({ onAddToCart }: Props) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");

  const products = store.products.filter((product) =>
    selectedCategory === "All"
      ? true
      : product.category === selectedCategory
  );

  return (
    <section className="vivante-catalogue">
      <div className="catalogue-intro">
        <span className="eyebrow">SHOP VIVANTE</span>
        <h2>
          Choose something <em>lovely.</em>
        </h2>
        <p>
          Thoughtful care, everyday essentials and little things
          that make someone feel special.
        </p>
      </div>

      <div
        className="catalogue-filters"
        aria-label="Product categories"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              selectedCategory === category
                ? "catalogue-filter active"
                : "catalogue-filter"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {selectedCategory !== "All" && (
        <div className="catalogue-category-heading">
          <h3>{selectedCategory}</h3>
          <p>{categoryDescriptions[selectedCategory]}</p>
        </div>
      )}

      <div className="catalogue-grid">
        {products.map((product) => {
          const available = product.active && product.priceKobo > 0;

          return (
            <article
              className="catalogue-card"
              key={product.id}
            >
              <div className="catalogue-product-art">
                <span>V</span>
                {!available && (
                  <small>
                    {product.id === "treat-box-100000"
                      ? "Coming Soon"
                      : "Details Coming Soon"}
                  </small>
                )}
              </div>

              <div className="catalogue-product-info">
                <span className="catalogue-product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                {product.description && (
                  <p>{product.description}</p>
                )}

                <div className="catalogue-product-footer">
                  <strong>
                    {available
                      ? formatNaira(product.priceKobo)
                      : "Price coming soon"}
                  </strong>
                </div>

                <button
                  type="button"
                  className="catalogue-add-button"
                  disabled={!available}
                  onClick={() => onAddToCart(product.id)}
                >
                  {available ? (
                    <>
                      Add to bag <ShoppingBag size={15} />
                    </>
                  ) : (
                    "Unavailable"
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}