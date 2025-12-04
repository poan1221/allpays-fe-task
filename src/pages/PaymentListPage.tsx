import { useState, useMemo, useRef, useEffect } from "react";
import dayjs from "dayjs";
import type { DashboardFilter } from "@/types/dashboard";
import { usePaymentData } from "@/features/payments/hooks/usePaymentData";
import { FilterBar } from "@/components/common/FilterBar";
import { PaymentListTable } from "@/components/common/PaymentListTable";

export default function PaymentListPage() {
  const [filter, setFilter] = useState<DashboardFilter>({
    fromDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    toDate: dayjs().format("YYYY-MM-DD"),
  });

  const { filteredPayments, merchants, statusCodes, typeCodes, isLoading } =
    usePaymentData(filter);

  const [visibleCount, setVisibleCount] = useState(30);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visiblePayments = useMemo(
    () => filteredPayments.slice(0, visibleCount),
    [filteredPayments, visibleCount]
  );

  useEffect(() => {
    // 필터 바뀌면 처음부터 다시
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(30);
  }, [filter]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setVisibleCount((prev) => {
          if (prev >= filteredPayments.length) return prev;
          return Math.min(prev + 30, filteredPayments.length);
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [filteredPayments.length]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 h-dvh">
      {/* 헤더 생략 */}
      <main className="flex-1 px-6 py-4 space-y-6">
        <FilterBar
          filter={filter}
          onChange={setFilter}
          merchants={merchants}
          statusCodes={statusCodes}
          typeCodes={typeCodes}
        />

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <div>
              <div className="text-md font-medium text-slate-900 flex gap-1 items-center">
                전체 거래 내역
              </div>
              <p className="text-[11px] text-slate-500">
                결제/취소 내역을 시간순으로 확인합니다
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              총
              <span className="font-semibold text-slate-700">
                {visiblePayments.length.toLocaleString()}
              </span>
              건
            </p>
          </div>
          <div className="max-h-[calc(100dvh-280px)] overflow-y-auto">
            <PaymentListTable
              payments={visiblePayments}
              merchants={merchants}
              statusCodes={statusCodes}
              typeCodes={typeCodes}
            />

            <div
              ref={sentinelRef}
              className="mt-3 h-10 text-center text-[11px] text-slate-400"
            >
              {isLoading
                ? "불러오는 중..."
                : visiblePayments.length < filteredPayments.length
                ? "아래로 스크롤하면 더 불러옵니다."
                : "모든 거래를 다 보여줬습니다."}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
