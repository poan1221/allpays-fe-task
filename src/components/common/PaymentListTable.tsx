import type {
  Payment,
  Merchant,
  CodeItem,
  PaymentTypeItem,
} from "@/types/payment";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CircleChevronRight } from "lucide-react";

type PaymentListTableProps = {
  payments: Payment[];
  merchants: Merchant[];
  statusCodes: CodeItem[];
  typeCodes: PaymentTypeItem[];
  maxRows?: number;
  title?: string;
  subtitle?: string;
};

export function PaymentListTable({
  payments,
  merchants,
  statusCodes,
  typeCodes,
  maxRows,
  title = "거래 내역",
  subtitle,
}: PaymentListTableProps) {
  const merchantMap = new Map(merchants.map((m) => [m.mchtCode, m.mchtName]));
  const statusMap = new Map(
    statusCodes.map((s) => [s.code, s.description || s.code])
  );
  const typeMap = new Map(
    typeCodes.map((t) => [t.type, t.description || t.type])
  );

  // 최신 내역이 위로 오도록
  const sorted = [...payments].sort(
    (a, b) => b.paymentAt.getTime() - a.paymentAt.getTime()
  );
  const rows = maxRows ? sorted.slice(0, maxRows) : sorted;

  const getMerchantName = (code: string) => merchantMap.get(code) ?? code;

  const getStatusLabel = (status: string) => statusMap.get(status) ?? status;

  const getPayTypeLabel = (type: string) => typeMap.get(type) ?? type;

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (status.includes("SUCCESS")) return "default";
    if (status.includes("PENDING")) return "secondary";
    if (status.includes("FAIL") || status.includes("CANCEL"))
      return "destructive";
    return "outline";
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-md font-medium text-slate-900 flex gap-1 items-center">
            {title}
            {maxRows && (
              <Link to="/payment-list">
                <CircleChevronRight size={18} />
              </Link>
            )}
          </h2>
          <p className="text-[11px] text-slate-500">
            {subtitle ?? "결제/취소 내역을 시간순으로 확인합니다"}
          </p>
        </div>
        <p className="text-[11px] text-slate-500">
          총
          <span className="font-semibold text-slate-700">
            {maxRows
              ? rows.length.toLocaleString()
              : payments.length.toLocaleString()}
          </span>
          건
        </p>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr className="border-b bg-slate-50">
              <Th>결제일시</Th>
              <Th>결제코드</Th>
              <Th>가맹점</Th>
              <Th className="text-right">금액</Th>
              <Th>통화</Th>
              <Th>수단</Th>
              <Th>상태</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.paymentCode}
                className="border-b last:border-0 hover:bg-slate-50/70"
              >
                <Td>{dayjs(p.paymentAt).format("YYYY-MM-DD HH:mm:ss")}</Td>
                <Td className="font-mono text-[11px]">{p.paymentCode}</Td>
                <Td>{getMerchantName(p.mchtCode)}</Td>
                <Td className="text-right">
                  {Math.round(p.amount).toLocaleString()} 원
                </Td>
                <Td>{p.currency}</Td>
                <Td>{getPayTypeLabel(p.payType)}</Td>
                <Td>
                  <Badge
                    variant={getStatusVariant(p.status)}
                    className="px-2 py-0.5 text-[10px]"
                  >
                    {getStatusLabel(p.status)}
                  </Badge>
                </Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center text-slate-400"
                >
                  조회된 거래 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
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
  return (
    <td className={"px-3 py-2 text-slate-800 " + className}>{children}</td>
  );
}
