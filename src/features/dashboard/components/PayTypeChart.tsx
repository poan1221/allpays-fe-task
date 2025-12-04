import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { PaymentTypeItem } from "@/types/payment";
import { useMemo } from "react";

type PayTypePoint = {
  payType: string; // 코드
  amount: number; // 총 금액
  count: number; // 건수
};

type PayTypeChartProps = {
  data: PayTypePoint[];
  typeCodes: PaymentTypeItem[];
};

export function PayTypeChart({ data, typeCodes }: PayTypeChartProps) {
  const typeLabelMap = useMemo(
    () => new Map(typeCodes.map((t) => [t.type, t.description || t.type])),
    [typeCodes]
  );

  const totalCount = useMemo(
    () => data.reduce((sum, d) => sum + d.count, 0),
    [data]
  );

  const chartData = useMemo(
    () =>
      data.map((item) => {
        const ratio = totalCount === 0 ? 0 : (item.count / totalCount) * 100;
        return {
          ...item,
          label: typeLabelMap.get(item.payType) ?? item.payType,
          ratio,
        };
      }),
    [data, totalCount, typeLabelMap]
  );

  const chartConfig = {
    ratio: {
      label: "비중",
      color: "#009689b0",
    },
  } as const;

  return (
    <div className="h-50">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-900">결제 수단별 비중</h3>
      </div>

      <ChartContainer config={chartConfig} className="h-45 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: -16, right: 8 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 10 }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    if (name === "ratio") {
                      return [
                        `${(value as number).toFixed(1)}%`,
                        props.payload.label,
                      ];
                    }
                    return [String(value), name];
                  }}
                />
              }
            />
            <Bar
              dataKey="ratio"
              fill="var(--color-ratio)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
