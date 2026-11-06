
import type {
  VercelRequest,
  VercelResponse,
} from "@vercel/node";

import {
  getOrder,
  updateOrderPayment,
} from "../_lib/orders";

import {
  verifyProviderPayment,
} from "../_lib/provider";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed.",
    });
  }

  try {
    const {
      orderId,
      transactionId,
    } = req.body ?? {};

    if (!orderId || !transactionId) {
      return res.status(400).json({
        error: "Missing payment reference.",
      });
    }

    const order = await getOrder(orderId);

    if (order.status === "paid") {
      return res.status(200).json({
        orderId,
        status: "paid",
        message: "Payment already confirmed.",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        error: "Order is not awaiting payment.",
      });
    }

    if (
      order.provider_ref &&
      order.provider_ref !== transactionId
    ) {
      return res.status(400).json({
        error: "Transaction reference does not match.",
      });
    }

    const verified = await verifyProviderPayment(
      String(transactionId),
      String(orderId),
      Number(order.total_kobo)
    );

    if (!verified) {
      return res.status(200).json({
        orderId,
        status: "pending",
        message:
          "Payment has not yet been confirmed by ALATPay.",
      });
    }

    const updated = await updateOrderPayment(
      orderId,
      "paid",
      transactionId
    );

    if (!updated) {
      const latest = await getOrder(orderId);

      if (latest.status !== "paid") {
        throw new Error(
          "Order status changed during verification."
        );
      }
    }

    return res.status(200).json({
      orderId,
      status: "paid",
      message: "Payment confirmed.",
    });
  } catch (error) {
    console.error(
      "Payment verification failed:",
      error
    );

    return res.status(500).json({
      error:
        "Unable to verify payment right now.",
    });
  }
}
