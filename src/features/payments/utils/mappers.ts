import type { PaymentDto, Payment } from "@/types/payment";

export function normalizePayments(raw: PaymentDto[]): Payment[] {
  return raw.map((p) => ({
    ...p,
    amount: Number(p.amount),
    paymentAt: new Date(p.paymentAt),
  }));
}
