import { useEffect, useState } from "react";

declare global {
  interface Window {
    Alatpay?: {
      setup: (config: Record<string, unknown>) => unknown;
    };
  }
}

interface Props {
  onReady: () => void;
}

export default function CardPayment({ onReady }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://web.alatpay.ng/js/alatpay.js"]'
    );

    if (window.Alatpay) {
      setReady(true);
      onReady();
      return;
    }

    const script = existing ?? document.createElement("script");

    const handleLoad = () => {
      setReady(Boolean(window.Alatpay));
      onReady();
    };

    script.addEventListener("load", handleLoad);

    if (!existing) {
      script.src = "https://web.alatpay.ng/js/alatpay.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, [onReady]);

  return (
    <div className="payment-provider">
      {ready
        ? "Secure ALATPay card checkout is ready."
        : "Loading secure card checkout…"}
    </div>
  );
}