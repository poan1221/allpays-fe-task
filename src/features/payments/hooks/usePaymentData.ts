// src/features/payments/hooks/usePaymentData.ts
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchPayments,
  fetchMerchants,
  fetchPaymentStatusCodes,
  fetchPaymentTypeCodes,
} from "@/features/payments/api/payment-api";
import { normalizePayments } from "@/features/payments/utils/mappers";
import { applyFilter } from "@/features/payments/utils/filters";
import { calcSummary } from "@/features/payments/utils/aggregations";
import type {
  Payment,
  Merchant,
  CodeItem,
  PaymentTypeItem,
} from "@/types/payment";
import type { DashboardFilter, Summary } from "@/types/dashboard";

type UsePaymentDataResult = {
  payments: Payment[];
  filteredPayments: Payment[];
  merchants: Merchant[];
  statusCodes: CodeItem[];
  typeCodes: PaymentTypeItem[];
  summary: Summary;
  isLoading: boolean;
  isError: boolean;
};

export function usePaymentData(filter: DashboardFilter): UsePaymentDataResult {
  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: () => fetchPayments(),
  });

  const merchantsQuery = useQuery({
    queryKey: ["merchants"],
    queryFn: () => fetchMerchants(),
  });

  const statusCodesQuery = useQuery({
    queryKey: ["payment-status-codes"],
    queryFn: () => fetchPaymentStatusCodes(),
  });

  const typeCodesQuery = useQuery({
    queryKey: ["payment-type-codes"],
    queryFn: () => fetchPaymentTypeCodes(),
  });

  const payments: Payment[] = useMemo(() => {
    const raw = paymentsQuery.data ?? [];
    return normalizePayments(raw);
  }, [paymentsQuery.data]);

  const filteredPayments = useMemo(
    () => applyFilter(payments, filter),
    [payments, filter]
  );

  const summary: Summary = useMemo(
    () => calcSummary(filteredPayments),
    [filteredPayments]
  );

  return {
    payments,
    filteredPayments,
    merchants: merchantsQuery.data ?? [],
    statusCodes: statusCodesQuery.data ?? [],
    typeCodes: typeCodesQuery.data ?? [],
    summary,
    isLoading:
      paymentsQuery.isLoading ||
      merchantsQuery.isLoading ||
      statusCodesQuery.isLoading ||
      typeCodesQuery.isLoading,
    isError:
      paymentsQuery.isError ||
      merchantsQuery.isError ||
      statusCodesQuery.isError ||
      typeCodesQuery.isError,
  };
}
