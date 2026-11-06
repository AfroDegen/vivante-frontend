export interface StoreProduct {
  id: string;
  name: string;
  description?: string;
  priceKobo: number;
  image?: string;
  active: boolean;
}

export const store = {
  name: "Vivante Lagos",
  currency: "NGN",

  // ₦3,000, expressed in kobo.
  deliveryFeeKobo: 300000,

  theme: {
    primary: "#76518f",
    deepPurple: "#513768",
    lilac: "#eee5f3",
    background: "#ffffff",
    text: "#241b2b",
  },

  products: [
    {
      id: "gift-box-25000",
      name: "Gift Box",
      description: "Vivante gift box",
      priceKobo: 2500000,
      active: true,
    },
    {
      id: "gift-box-18000",
      name: "Gift Box",
      description: "Vivante gift box",
      priceKobo: 1800000,
      active: true,
    },
  ] satisfies StoreProduct[],
};