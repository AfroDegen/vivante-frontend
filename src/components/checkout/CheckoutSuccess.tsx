interface Props {
  orderId: string;
  status: "pending" | "paid" | "failed";
}

export default function CheckoutSuccess({ orderId, status }: Props) {
  if (status === "paid") {
    return (
      <section className="checkout-result">
        <h2>Thank you for your order!</h2>
        <p>Your payment has been confirmed.</p>
        <p>Order reference: {orderId}</p>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="checkout-result">
        <h2>Payment unsuccessful</h2>
        <p>Your payment has not been confirmed. Please try again.</p>
        <p>Order reference: {orderId}</p>
      </section>
    );
  }

  return (
    <section className="checkout-result">
      <h2>Payment pending</h2>
      <p>We're waiting for payment confirmation.</p>
      <p>Order reference: {orderId}</p>
    </section>
  );
}