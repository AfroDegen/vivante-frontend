
import type {
  VercelRequest,
  VercelResponse,
} from "@vercel/node";

import { createOrder } from "../_lib/orders";
import {
  initiateProviderPayment,
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
      customer,
      items,
      paymentMethod,
    } = req.body ?? {};

    if (
      !customer?.fullName ||
      !customer?.email ||
      !customer?.phone ||
      !customer?.address ||
      !Array.isArray(items) ||
      !["card", "bank_transfer"].includes(paymentMethod)
    ) {
      return res.status(400).json({
        error: "Invalid checkout details.",
      });
    }

    const order = await createOrder(
      items,
      customer,
      paymentMethod
    );

    try {
      const payment = await initiateProviderPayment({
        orderId: order.id,
        amountKobo: Number(order.total_kobo),
        customer: {
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
        },
        paymentMethod,
      });

      if (payment.transactionId) {
        const { supabase } = await import(
          "../_lib/supabase"
        );

        const { error } = await supabase
          .from("orders")
          .update({
            provider_ref: payment.transactionId,
          })
          .eq("id", order.id)
          .eq("status", "pending");

        if (error) throw error;
      }

      return res.status(200).json({
        order: {
          orderId: order.id,
          subtotalKobo: order.subtotal_kobo,
          deliveryKobo: order.delivery_kobo,
          totalKobo: order.total_kobo,
          currency: "NGN",
        },
        paymentMethod,
        status: "pending",
        transactionId: payment.transactionId,
        transfer: payment.transfer,
      });
    } catch (error) {
      console.error(
        "Payment initiation failed:",
        error
      );

      return res.status(502).json({
        error:
          "We couldn't start your payment. Please try again.",
        orderId: order.id,
      });
    }
  } catch (error) {
    console.error("Order creation failed:", error);

    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Checkout failed.",
    });
  }
}
