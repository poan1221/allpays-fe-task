import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  fetchPayments,
  fetchMerchants,
  fetchPaymentStatusCodes,
  fetchPaymentTypeCodes,
  type DashboardFilter,
} from "@/dashboard/api";
import {
  normalizePayments,
  calcSummary,
  applyFilter,
} from "@/dashboard/aggregations";
import { FilterBar } from "@/dashboard/components/FilterBar";
import { SummaryCards } from "@/dashboard/components/SummaryCards";

export default function DashboardPage() {
  const [filter, setFilter] = useState<DashboardFilter>({
    fromDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    toDate: dayjs().format("YYYY-MM-DD"),
  });

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

  const isLoading = paymentsQuery.isLoading || merchantsQuery.isLoading;

  const payments = useMemo(() => {
    const raw = paymentsQuery.data ?? [];
    return normalizePayments(raw);
  }, [paymentsQuery.data]);

  const filteredPayments = useMemo(
    () => applyFilter(payments, filter),
    [payments, filter]
  );

  const summary = useMemo(
    () => calcSummary(filteredPayments),
    [filteredPayments]
  );
  const merchants = merchantsQuery.data ?? [];

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">로딩중...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-900">
          결제/가맹점 대시보드
        </h1>
      </header>

      <main className="flex-1 px-6 py-4 space-y-6">
        {/* 필터 바 */}
        <FilterBar
          filter={filter}
          onChange={setFilter}
          merchants={merchants}
          statusCodes={statusCodesQuery.data ?? []}
          typeCodes={typeCodesQuery.data ?? []}
        />

        {/* KPI 카드 */}
        <SummaryCards summary={summary} />

        {/* 차트 영역 */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border bg-white p-4 shadow-sm">
            결제 추이 차트 영역
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              상태별 분포 차트 영역
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              결제수단별 분포 차트 영역
            </div>
          </div>
        </section>

        {/* 가맹점 TOP + 거래 리스트 */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 rounded-xl border bg-white p-4 shadow-sm">
            상위 가맹점 테이블 영역
          </div>
          <div className="lg:col-span-2 rounded-xl border bg-white p-4 shadow-sm">
            결제 리스트 테이블 영역
          </div>
        </section>
      </main>
    </div>
  );
}
