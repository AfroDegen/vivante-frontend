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

  try {
    const { orderId, transactionId } = req.body ?? {};

    if (!orderId || !transactionId) {
      return res.status(400).json({ error: "Missing payment reference." });
    }

    const order = await getOrder(orderId);

    if (order.status === "paid") {
      return res.status(200).json({
        orderId,
        status: "paid",
        message: "Payment already confirmed.",
      });
    }

    if (
      order.status !== "pending" ||
      order.provider_ref !== transactionId
    ) {
      return res.status(400).json({
        error: "Invalid or inactive payment reference.",
      });
    }

    const verified = await verifyProviderPayment(
      transactionId,
      Number(order.total_kobo)
    );

    if (!verified) {
      return res.status(200).json({
        orderId,
        status: "pending",
        message: "Payment has not yet been confirmed.",
      });
    }

    await updateOrderPayment(orderId, "paid", transactionId);

    return res.status(200).json({
      orderId,
      status: "paid",
      message: "Payment confirmed.",
    });
  } catch (error) {
    console.error("Payment verification failed:", error);

    return res.status(500).json({
      error: "Unable to verify payment right now.",
    });
  }
}