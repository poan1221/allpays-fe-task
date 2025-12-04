import { useMemo } from "react";

type TopMerchant = {
  mchtCode: string;
  mchtName: string;
  totalAmount: number;
  totalCount: number;
  avgTicket: number;
};

type TopMerchantsTableProps = {
  data: TopMerchant[];
  maxRows?: number;
};

export function TopMerchantsTable({
  data,
  maxRows = 10,
}: TopMerchantsTableProps) {
  const rows = useMemo(() => data.slice(0, maxRows), [data, maxRows]);

  const totalAmount = useMemo(
    () => data.reduce((sum, d) => sum + d.totalAmount, 0),
    [data]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-900">
            가맹점 Top {maxRows}
          </h3>
          <p className="text-[11px] text-slate-500">
            승인 금액 기준 상위 가맹점 리스트입니다.
          </p>
        </div>
        <p className="text-[11px] text-slate-500">
          총 <span className="font-semibold text-slate-700">{data.length}</span>{" "}
          개
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr className="border-b bg-slate-50">
              <Th className="w-6 text-center">#</Th>
              <Th>가맹점</Th>
              <Th className="text-right">총 승인 금액</Th>
              <Th className="text-right">건수</Th>
              <Th className="text-right">평균 금액</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m, index) => (
              <tr
                key={m.mchtCode}
                className="border-b last:border-0 hover:bg-slate-50/70"
              >
                <Td className="text-center text-[11px] text-slate-500">
                  {index + 1}
                </Td>
                <Td>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-800">
                      {m.mchtName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {m.mchtCode}
                    </span>
                  </div>
                </Td>
                <Td className="text-right">
                  {Math.round(m.totalAmount).toLocaleString()} 원
                </Td>
                <Td className="text-right">
                  {m.totalCount.toLocaleString()} 건
                </Td>
                <Td className="text-right">
                  {Math.round(m.avgTicket).toLocaleString()} 원
                </Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-[11px] text-slate-400"
                >
                  집계된 가맹점 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr className="border-t bg-slate-50/70">
                <Td />
                <Td className="text-[11px] font-medium text-slate-600">
                  전체 합계
                </Td>
                <Td className="text-right text-[11px] font-medium text-slate-700">
                  {Math.round(totalAmount).toLocaleString()} 원
                </Td>
                <Td />
                <Td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <th
      className={
        "px-3 py-2 text-left text-[11px] font-medium text-slate-500 " +
        className
      }
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <td className={"px-3 py-2 align-middle " + className}>{children}</td>;
}
