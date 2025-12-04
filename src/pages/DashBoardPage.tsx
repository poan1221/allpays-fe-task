import { useState } from "react";
import dayjs from "dayjs";
import { type DashboardFilter } from "@/features/payments/api/payment-api";
import { FilterBar } from "@/components/common/FilterBar";
import { SummaryCards } from "@/features/dashboard/components/SummaryCards";
import { PaymentListTable } from "@/components/common/PaymentListTable";
import { usePaymentData } from "@/features/payments/hooks/usePaymentData";
import { Link } from "react-router-dom";
import { CircleChevronRight } from "lucide-react";

export default function DashboardPage() {
  const [filter, setFilter] = useState<DashboardFilter>({
    fromDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    toDate: dayjs().format("YYYY-MM-DD"),
  });

  const {
    filteredPayments,
    merchants,
    statusCodes,
    typeCodes,
    summary,
    isLoading,
  } = usePaymentData(filter);

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
          statusCodes={statusCodes}
          typeCodes={typeCodes}
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
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-md font-medium text-slate-900 flex gap-1 items-center">
                    최근 거래 내역
                    <Link to="/payment-list">
                      <CircleChevronRight size={18} />
                    </Link>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    최신 거래 순으로 10개까지 노출됩니다
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">
                  총<span className="font-semibold text-slate-700">10</span>건
                </p>
              </div>
              <PaymentListTable
                payments={filteredPayments}
                merchants={merchants}
                statusCodes={statusCodes}
                typeCodes={typeCodes}
                maxRows={10}
                title="최근 거래 내역"
                subtitle="최신 거래 순으로 10개까지 노출됩니다"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
