import { api } from "@/lib/api";
import type {
  PaymentDto,
  MerchantDto,
  MerchantDetailDto,
  CodeItem,
  PaymentTypeItem,
} from "@/types/payment";

// 공통 응답 래퍼
type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

// 필터 모델
export type DashboardFilter = {
  fromDate?: string;
  toDate?: string;
  mchtCode?: string;
  status?: string;
  payType?: string;
};

// 거래 리스트
export async function fetchPayments(
  filter: DashboardFilter
): Promise<PaymentDto[]> {
  const { data } = await api.get<ApiResponse<PaymentDto[]>>("/payments/list", {
    params: filter,
  });
  return data.data;
}

// 가맹점들
export async function fetchMerchants(): Promise<MerchantDto[]> {
  const { data } = await api.get<ApiResponse<MerchantDto[]>>("/merchants/list");
  return data.data;
}

export async function fetchMerchantDetail(
  mchtCode: string
): Promise<MerchantDetailDto> {
  const { data } = await api.get<ApiResponse<MerchantDetailDto>>(
    `/merchants/details/${mchtCode}`
  );
  return data.data;
}

// 공통 코드
export async function fetchPaymentStatusCodes(): Promise<CodeItem[]> {
  const { data } = await api.get<ApiResponse<CodeItem[]>>(
    "/common/payment-status/all"
  );
  return data.data;
}

export async function fetchPaymentTypeCodes(): Promise<PaymentTypeItem[]> {
  const { data } = await api.get<ApiResponse<PaymentTypeItem[]>>(
    "/common/payment-type/all"
  );
  return data.data;
}

export async function fetchMerchantStatusCodes(): Promise<CodeItem[]> {
  const { data } = await api.get<ApiResponse<CodeItem[]>>(
    "/common/mcht-status/all"
  );
  return data.data;
}
