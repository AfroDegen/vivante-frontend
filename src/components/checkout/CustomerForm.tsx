import type { CustomerDetails } from "../../lib/checkout/types";

interface Props {
  value: CustomerDetails;
  onChange: (value: CustomerDetails) => void;
}

export default function CustomerForm({ value, onChange }: Props) {
  function update(field: keyof CustomerDetails, next: string) {
    onChange({ ...value, [field]: next });
  }

  return (
    <section className="checkout-section">
      <h2>Delivery details</h2>

      <label>
        Full name
        <input
          value={value.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          autoComplete="name"
          required
        />
      </label>

      <label>
        Email address
        <input
          type="email"
          value={value.email}
          onChange={(e) => update("email", e.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label>
        Phone number
        <input
          type="tel"
          value={value.phone}
          onChange={(e) => update("phone", e.target.value)}
          autoComplete="tel"
          required
        />
      </label>

      <label>
        Delivery address
        <textarea
          value={value.address}
          onChange={(e) => update("address", e.target.value)}
          autoComplete="street-address"
          required
        />
      </label>

      <label>
        Delivery note (optional)
        <textarea
          value={value.deliveryNote ?? ""}
          onChange={(e) => update("deliveryNote", e.target.value)}
        />
      </label>
    </section>
  );
}