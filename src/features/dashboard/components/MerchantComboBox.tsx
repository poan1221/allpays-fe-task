import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { MerchantDto } from "@/types/payment";

type MerchantComboboxProps = {
  merchants: MerchantDto[];
  value?: string; // mchtCode
  onChange: (next?: string) => void;
};

export function MerchantCombobox({
  merchants,
  value,
  onChange,
}: MerchantComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const current = merchants.find((m) => m.mchtCode === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-col">
        <p className="mb-1 text-[11px] font-medium text-slate-600">가맹점</p>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[220px] justify-between"
          >
            <span className="truncate text-xs">
              {current ? current.mchtName : "전체 가맹점"}
            </span>
            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0" align="start">
          <Command>
            <CommandInput className="text-xs" placeholder="가맹점 검색..." />
            <CommandList>
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value=""
                  onSelect={() => {
                    onChange(undefined);
                    setOpen(false);
                  }}
                >
                  <span className="text-xs">전체 가맹점</span>
                  {!current && (
                    <Check className="ml-auto h-3 w-3 opacity-100" />
                  )}
                </CommandItem>
                {merchants.map((m) => (
                  <CommandItem
                    key={m.mchtCode}
                    value={`${m.mchtName} (${m.mchtCode})`}
                    onSelect={() => {
                      onChange(m.mchtCode);
                      setOpen(false);
                    }}
                  >
                    <span className="truncate text-xs">{m.mchtName}</span>
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      ({m.mchtCode})
                    </span>
                    {current?.mchtCode === m.mchtCode && (
                      <Check className="ml-auto h-3 w-3 opacity-100" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
}
