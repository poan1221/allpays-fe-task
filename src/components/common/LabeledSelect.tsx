import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Option =
  | { label: string; value: string }
  | { label: string; value: string | undefined };

type LabeledSelectProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  options: Option[];
  className?: string;
  allowAll?: boolean;
  allLabel?: string;
};

export function LabeledSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  className,
  allowAll = true,
  allLabel = "전체",
}: LabeledSelectProps) {
  return (
    <div className={`flex flex-col ${className || ""}`}>
      <p className="mb-1 text-[11px] font-medium text-slate-600">{label}</p>
      <Select
        value={value ?? ""}
        onValueChange={(v) => onChange(v || undefined)}
      >
        <SelectTrigger className="h-8 w-full rounded-md border-slate-300 bg-white text-xs">
          <SelectValue placeholder={placeholder ?? `${label} 선택`} />
        </SelectTrigger>
        <SelectContent>
          {allowAll && (
            <SelectItem value="all">
              <span className="text-xs text-slate-500">{allLabel}</span>
            </SelectItem>
          )}
          {options.map((opt) => (
            <SelectItem
              key={String(opt.value)}
              value={String(opt.value ?? "")}
              className="text-xs"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
