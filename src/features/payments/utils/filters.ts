import type { DashboardFilter } from "@/types/dashboard";
import type { Payment } from "@/types/payment";
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
