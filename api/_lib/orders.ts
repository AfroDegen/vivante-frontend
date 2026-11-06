import { randomUUID } from "node:crypto";
import { supabase } from "./supabase";
import { calculateOrder } from "./pricing";
import type {
  CartItem,
  CustomerDetails,
  PaymentMethod,
} from "../../src/lib/checkout/types";

export async function createOrder(
  items: CartItem[],
  customer: CustomerDetails,
  paymentMethod: PaymentMethod
) {
  const pricing = calculateOrder(items);
  const id = randomUUID();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      id,
      status: "pending",
      payment_method: paymentMethod,
      subtotal_kobo: pricing.subtotalKobo,
      delivery_kobo: pricing.deliveryKobo,
      total_kobo: pricing.totalKobo,
      lines: pricing.lines,
      customer,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getOrder(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function updateOrderPayment(
  id: string,
  status: "paid" | "failed",
  providerRef?: string
) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      provider_ref: providerRef ?? null,
      ...(status === "paid"
        ? { paid_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", id)
    .eq("status", "pending")
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}