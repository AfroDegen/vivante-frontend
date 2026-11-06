import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getOrder, updateOrderPayment } from "../_lib/orders";
import { verifyProviderPayment } from "../_lib/provider";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const token = req.query.token;
  const expectedToken = process.env.WEBHOOK_TOKEN;

  if (
    !expectedToken ||
    typeof token !== "string" ||
    token !== expectedToken
  ) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const body = req.body ?? {};

    const orderId = body.orderId ?? body.data?.orderId;
    const transactionId =
      body.transactionId ?? body.data?.transactionId;

    if (!orderId || !transactionId) {
      return res.status(400).json({ error: "Invalid webhook payload." });
    }

    const order = await getOrder(orderId);

    if (order.status === "paid") {
      return res.status(200).json({ received: true });
    }

    if (
      order.status !== "pending" ||
      order.provider_ref !== transactionId
    ) {
      return res.status(200).json({ received: true });
    }

    const verified = await verifyProviderPayment(
      transactionId,
      Number(order.total_kobo)
    );

    if (verified) {
      await updateOrderPayment(orderId, "paid", transactionId);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return res.status(500).json({ error: "Webhook processing failed." });
  }
}