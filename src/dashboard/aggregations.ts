import type { DashboardFilter } from "@/types/dashboard";
import type { PaymentDto, Payment, MerchantDto } from "@/types/payment";
import dayjs from "dayjs";

export function applyFilter(payments: Payment[], filter: DashboardFilter) {
  return payments.filter((p) => {
    if (
      filter.fromDate &&
      dayjs(p.paymentAt).isBefore(filter.fromDate, "day")
    ) {
      return false;
    }
    if (filter.toDate && dayjs(p.paymentAt).isAfter(filter.toDate, "day")) {
      return false;
    }
    if (filter.mchtCode && p.mchtCode !== filter.mchtCode) {
      return false;
    }
    if (filter.status && p.status !== filter.status) {
      return false;
    }
    if (filter.payType && p.payType !== filter.payType) {
      return false;
    }
    return true;
  });
}

export function normalizePayments(raw: PaymentDto[]) {
  return raw.map((p) => ({
    ...p,
    amount: Number(p.amount),
    paymentAt: new Date(p.paymentAt),
  }));
}

export function calcSummary(payments: ReturnType<typeof normalizePayments>) {
  const totalCount = payments.length;
  const success = payments.filter((p) => p.status === "SUCCESS");
  const successCount = success.length;
  const totalSuccessAmount = success.reduce((sum, p) => sum + p.amount, 0);

  return {
    totalCount,
    totalSuccessAmount,
    successCount,
    successRate: totalCount === 0 ? 0 : successCount / totalCount,
    avgTicket: successCount === 0 ? 0 : totalSuccessAmount / successCount,
  };
}

// 일별 추이
export function groupByDate(payments: ReturnType<typeof normalizePayments>) {
  const map = new Map<string, { amount: number; count: number }>();

  payments.forEach((p) => {
    const key = dayjs(p.paymentAt).format("YYYY-MM-DD");
    const prev = map.get(key) ?? { amount: 0, count: 0 };
    map.set(key, {
      amount: prev.amount + p.amount,
      count: prev.count + 1,
    });
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, v]) => ({
      date,
      ...v,
    }));
}

// 상태별 분포
export function groupByStatus(payments: ReturnType<typeof normalizePayments>) {
  const map = new Map<string, { amount: number; count: number }>();
  payments.forEach((p) => {
    const prev = map.get(p.status) ?? { amount: 0, count: 0 };
    map.set(p.status, {
      amount: prev.amount + p.amount,
      count: prev.count + 1,
    });
  });
  return Array.from(map.entries()).map(([status, v]) => ({
    status,
    ...v,
  }));
}

// 수단별 분포
export function groupByPayType(payments: ReturnType<typeof normalizePayments>) {
  const map = new Map<string, { amount: number; count: number }>();
  payments.forEach((p) => {
    const prev = map.get(p.payType) ?? { amount: 0, count: 0 };
    map.set(p.payType, {
      amount: prev.amount + p.amount,
      count: prev.count + 1,
    });
  });
  return Array.from(map.entries()).map(([payType, v]) => ({
    payType,
    ...v,
  }));
}

// 가맹점별 통계
export function calcMerchantStats(
  payments: ReturnType<typeof normalizePayments>,
  merchants: MerchantDto[]
) {
  const map = new Map<string, { amount: number; count: number }>();

  const success = payments.filter((p) => p.status === "SUCCESS");
  success.forEach((p) => {
    const prev = map.get(p.mchtCode) ?? { amount: 0, count: 0 };
    map.set(p.mchtCode, {
      amount: prev.amount + p.amount,
      count: prev.count + 1,
    });
  });

  return Array.from(map.entries())
    .map(([mchtCode, v]) => {
      const merchant = merchants.find((m) => m.mchtCode === mchtCode);
      return {
        mchtCode,
        mchtName: merchant?.mchtName ?? mchtCode,
        totalAmount: v.amount,
        totalCount: v.count,
        avgTicket: v.count === 0 ? 0 : v.amount / v.count,
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount);
}
