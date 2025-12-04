import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  //   TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type TrendPoint = {
  date: string; // "YYYY-MM-DD"
  amount: number; // 일별 총 금액
  count: number; // 일별 건수
};

type PaymentTrendChartProps = {
  data: TrendPoint[];
};

export function PaymentTrendChart({ data }: PaymentTrendChartProps) {
  const chartConfig = {
    amount: {
      label: "승인 금액",
    },
    count: {
      label: "건수",
    },
  } as const;

  return (
    <div className="h-50 md:h-full max-h-120">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-900">
            일자별 거래 추이
          </h3>
          <p className="text-[11px] text-slate-500">
            선택한 기간 동안의 결제 승인 금액/건수 추이를 확인합니다.
          </p>
        </div>
      </div>

      <ChartContainer
        config={chartConfig}
        className="h-[calc(100%-30px)] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) =>
                value >= 1000000
                  ? `${Math.round(value / 1000000)}M`
                  : value >= 1000
                  ? `${Math.round(value / 1000)}K`
                  : value
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 10 }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `날짜: ${label}`}
                  formatter={(value, name) => {
                    if (name === "amount") {
                      return [`승인금액: ${Number(value).toLocaleString()} 원`];
                    }
                    if (name === "count") {
                      return [`승인건수: ${value} 건`];
                    }
                    return [String(value), name];
                  }}
                />
              }
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="amount"
              stroke="currentColor"
              fill="currentColor"
              className="text-emerald-500/80"
              fillOpacity={0.15}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="count"
              stroke="currentColor"
              fill="currentColor"
              className="text-sky-500/80"
              fillOpacity={0.12}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
