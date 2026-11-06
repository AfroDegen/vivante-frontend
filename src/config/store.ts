export type ProductCategory =
  | "Period Care Boxes"
  | "Treat Boxes"
  | "Essential Items"
  | "Perfumes"
  | "Gift Boxes"
  | "Seasonal Boxes";

export interface StoreProduct {
  id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  priceKobo: number;
  image?: string;
  active: boolean;
}

export const store = {
  name: "Vivante Lagos",
  currency: "NGN",

  // Existing delivery fee: ₦3,000.
  deliveryFeeKobo: 300000,

  theme: {
    primary: "#76518f",
    deepPurple: "#513768",
    lilac: "#eee5f3",
    background: "#ffffff",
    text: "#241b2b",
  },

  products: [
    // ESSENTIAL ITEMS

    {
      id: "wet-wipes",
      name: "Wet Wipes",
      category: "Essential Items",
      priceKobo: 100000,
      active: true,
    },
    {
      id: "menstrual-heat-patch",
      name: "Disposable Menstrual Heat Patch",
      category: "Essential Items",
      priceKobo: 200000,
      active: true,
    },
    {
      id: "electronic-heat-belt",
      name: "Electronic Menstrual Heat Belt",
      category: "Essential Items",
      priceKobo: 2500000,
      active: true,
    },
    {
      id: "comfort-teddy-bear",
      name: "Comfort Teddy Bear",
      category: "Essential Items",
      priceKobo: 2500000,
      active: true,
    },
    {
      id: "hot-water-bag",
      name: "Hot Water Bag",
      category: "Essential Items",
      priceKobo: 350000,
      active: true,
    },
    {
      id: "fur-hot-water-bag",
      name: "Fur Hot Water Bag",
      category: "Essential Items",
      priceKobo: 1000000,
      active: true,
    },
    {
      id: "mini-scented-candle",
      name: "Mini Scented Candle",
      category: "Essential Items",
      priceKobo: 300000,
      active: true,
    },
    {
      id: "scented-candle-jar",
      name: "Scented Candle Jar",
      category: "Essential Items",
      priceKobo: 1000000,
      active: true,
    },
    {
      id: "hand-mask",
      name: "Hand Mask",
      category: "Essential Items",
      priceKobo: 250000,
      active: true,
    },
    {
      id: "foot-mask",
      name: "Foot Mask",
      category: "Essential Items",
      priceKobo: 250000,
      active: true,
    },
    {
      id: "under-eye-mask",
      name: "Under-Eye Mask",
      category: "Essential Items",
      priceKobo: 80000,
      active: true,
    },
    {
      id: "lip-mask",
      name: "Lip Mask",
      category: "Essential Items",
      priceKobo: 70000,
      active: true,
    },
    {
      id: "aromatic-essential-oil",
      name: "Aromatic Essential Oil",
      category: "Essential Items",
      priceKobo: 400000,
      active: true,
    },
    {
      id: "panty-liner",
      name: "Panty Liner",
      category: "Essential Items",
      priceKobo: 150000,
      active: true,
    },
    {
      id: "menstrual-period-pants",
      name: "Menstrual Period Pants",
      category: "Essential Items",
      priceKobo: 250000,
      active: true,
    },

    // TREAT BOXES

    {
      id: "treat-box-30000",
      name: "Treat Box — ₦30,000",
      description: "Assorted snacks.",
      category: "Treat Boxes",
      priceKobo: 3000000,
      active: true,
    },
    {
      id: "treat-box-55000",
      name: "Treat Box — ₦55,000",
      description: "Assorted snacks.",
      category: "Treat Boxes",
      priceKobo: 5500000,
      active: true,
    },
    {
      id: "treat-box-100000",
      name: "Premium Treat Box — ₦100,000",
      description: "Coming soon.",
      category: "Treat Boxes",
      priceKobo: 0,
      active: false,
    },

    // PERIOD CARE BOXES — PRICE AND CONTENTS PENDING

    ...["Onyx", "Luxe", "Regalia", "Diamond", "Empyrean"].map(
      (name) => ({
        id: `period-care-${name.toLowerCase()}`,
        name: `${name} Period Care Box`,
        description: "Price and contents to be confirmed.",
        category: "Period Care Boxes" as const,
        priceKobo: 0,
        active: false,
      })
    ),

    // PLACEHOLDER CATEGORIES

    {
      id: "perfumes-placeholder",
      name: "Perfumes",
      description: "Product names, prices and variations coming soon.",
      category: "Perfumes",
      priceKobo: 0,
      active: false,
    },
    {
      id: "gift-boxes-placeholder",
      name: "Gift Boxes",
      description: "Coming soon.",
      category: "Gift Boxes",
      priceKobo: 0,
      active: false,
    },
    {
      id: "seasonal-boxes-placeholder",
      name: "Seasonal Boxes",
      description: "Coming soon.",
      category: "Seasonal Boxes",
      priceKobo: 0,
      active: false,
    },
  ] satisfies StoreProduct[],
};