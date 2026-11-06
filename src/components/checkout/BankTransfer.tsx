
import type { BankTransferDetails } from "../../lib/checkout/types";

interface Props {
  details: BankTransferDetails;
}

const naira = (kobo: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);

export default function BankTransfer({ details }: Props) {
  return (
    <section className="checkout-section bank-transfer">
      <h2>Complete your transfer</h2>
      <p>Transfer the exact amount to the account below.</p>

      <div>
        <span>Account name</span>
        <strong>{details.accountName}</strong>
      </div>

      <div>
        <span>Account number</span>
        <strong>{details.accountNumber}</strong>
      </div>

      <div>
        <span>Bank code</span>
        <strong>{details.bankCode}</strong>
      </div>

      <div>
        <span>Amount</span>
        <strong>{naira(details.amountKobo)}</strong>
      </div>

      {details.expiresAt && (
        <p>
          Account expires:{" "}
          {new Date(details.expiresAt).toLocaleString()}
        </p>
      )}
    </section>
  );
}
