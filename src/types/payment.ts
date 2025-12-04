export type PaymentDto = {
  paymentCode: string;
  mchtCode: string;
  amount: string;
  currency: string;
  payType: string;
  status: string;
  paymentAt: string;
};

export type Payment = {
  paymentCode: string;
  mchtCode: string;
  amount: number;
  currency: string;
  payType: string;
  status: string;
  paymentAt: Date;
};

export type MerchantDto = {
  mchtCode: string;
  mchtName: string;
  status: string;
  bizType: string;
};

export type Merchant = {
  mchtCode: string;
  mchtName: string;
  status: string;
  bizType: string;
};

export type MerchantDetailDto = MerchantDto & {
  bizNo: string;
  address: string;
  phone: string;
  email: string;
  registeredAt: string;
  updatedAt: string;
};

// 공통 코드
export type CodeItem = {
  code: string; // 상태 코드, 가맹점 상태
  description: string;
};

export type PaymentTypeItem = {
  type: string;
  description: string;
};
