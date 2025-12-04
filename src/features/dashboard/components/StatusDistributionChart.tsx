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
import type { CodeItem } from "@/types/payment";
import { useMemo } from "react";

type StatusPoint = {
  status: string; // 코드 (예: "SUCCESS")
  amount: number; // 총 금액
  count: number; // 건수
};

type StatusDistributionChartProps = {
  data: StatusPoint[];
  statusCodes: CodeItem[];
};

export function StatusDistributionChart({
  data,
  statusCodes,
}: StatusDistributionChartProps) {
  const statusLabelMap = useMemo(
    () => new Map(statusCodes.map((c) => [c.code, c.description || c.code])),
    [statusCodes]
  );

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        label: statusLabelMap.get(item.status) ?? item.status,
      })),
    [data, statusLabelMap]
  );

  const chartConfig = {
    count: {
      label: "건수",
      color: "#00a6f4ba",
    },
  } as const;

  return (
    <div className="h-50">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-900">결제 상태별 분포</h3>
      </div>

      <ChartContainer config={chartConfig} className="h-45 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: -16 }}>
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
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    if (name === "count") {
                      return [`${value} 건`, props.payload.label];
                    }
                    return [String(value), name];
                  }}
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
