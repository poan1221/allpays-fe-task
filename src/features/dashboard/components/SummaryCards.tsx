import type { Summary } from "@/types/dashboard";

type SummaryCardsProps = {
  summary: Summary;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  const {
    totalCount,
    totalSuccessAmount,
    successCount,
    successRate,
    avgTicket,
  } = summary;

  const cards: {
    label: string;
    value: string;
    unit?: string;
    sub?: string;
  }[] = [
    {
      label: "총 승인 금액",
      value: totalSuccessAmount.toLocaleString(),
      unit: "원",
    },
    {
      label: "총 거래 건수",
      value: totalCount.toLocaleString(),
      unit: "건",
    },
    {
      label: "승인 성공률",
      value: `${(successRate * 100).toFixed(1)}%`,
      sub: `${successCount.toLocaleString()}건 성공`,
    },
    {
      label: "평균 거래 금액",
      value: isNaN(avgTicket) ? "-" : Math.round(avgTicket).toLocaleString(),
      unit: "원/건",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <p className="text-[11px] font-medium text-slate-500">{card.label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg font-semibold text-slate-900">
              {card.value}
            </span>
            {card.unit && (
              <span className="text-[10px] text-slate-400">{card.unit}</span>
            )}
            {card.sub && (
              <p className="ml-1 text-[11px] text-slate-400">({card.sub})</p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
