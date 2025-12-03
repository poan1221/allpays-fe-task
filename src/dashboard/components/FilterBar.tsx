import type { DashboardFilter } from "@/types/dashboard";
import type { CodeItem, PaymentTypeItem, MerchantDto } from "@/types/payment";
import { Button } from "@/components/ui/button";
import { MerchantCombobox } from "@/dashboard/components/MerchantComboBox";
import { LabeledSelect } from "@/components/common/LabeledSelect";
import dayjs from "dayjs";

type FilterBarProps = {
  filter: DashboardFilter;
  onChange: (next: DashboardFilter) => void;
  merchants: MerchantDto[];
  statusCodes: CodeItem[];
  typeCodes: PaymentTypeItem[];
};

export function FilterBar({
  filter,
  onChange,
  merchants,
  statusCodes,
  typeCodes,
}: FilterBarProps) {
  const setPresetDays = (days: number) => {
    onChange({
      ...filter,
      fromDate: dayjs().subtract(days, "day").format("YYYY-MM-DD"),
      toDate: dayjs().format("YYYY-MM-DD"),
    });
  };

  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-700">기간</span>
          <input
            type="date"
            className="h-8 rounded-md border px-2 text-xs"
            value={filter.fromDate ?? ""}
            onChange={(e) => onChange({ ...filter, fromDate: e.target.value })}
          />
          <span className="text-[11px] text-slate-500">~</span>
          <input
            type="date"
            className="h-8 rounded-md border px-2 text-xs"
            value={filter.toDate ?? ""}
            onChange={(e) => onChange({ ...filter, toDate: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-1">
          {[1, 7, 30].map((days) => {
            const from = dayjs().subtract(days, "day").format("YYYY-MM-DD");
            const to = dayjs().format("YYYY-MM-DD");
            const active = filter.fromDate === from && filter.toDate === to;

            return (
              <Button
                key={days}
                size="sm"
                variant="outline"
                className={`text-[11px] ${
                  active ? "bg-sky-600 text-white border-sky-600" : ""
                }`}
                onClick={() => setPresetDays(days)}
              >
                {days === 1 ? "오늘" : `${days}일`}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* 가맹점 */}
        <MerchantCombobox
          merchants={merchants}
          value={filter.mchtCode}
          onChange={(mchtCode) =>
            onChange({
              ...filter,
              mchtCode,
            })
          }
        />
        {/* 결제 상태 */}
        <LabeledSelect
          label="결제 상태"
          value={filter.status}
          onChange={(v) =>
            onChange({
              ...filter,
              status: v,
            })
          }
          allLabel="전체 상태"
          options={statusCodes.map((s) => ({
            value: s.code,
            label: s.description || s.code,
          }))}
        />
        {/* 결제 수단 */}
        <LabeledSelect
          label="결제 수단"
          value={filter.payType}
          onChange={(v) => onChange({ ...filter, payType: v })}
          allLabel="전체 수단"
          options={typeCodes.map((t) => ({
            value: t.type,
            label: t.description || t.type,
          }))}
        />
      </div>
    </section>
  );
}
