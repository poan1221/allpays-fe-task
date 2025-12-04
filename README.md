## 요구사항 
- [x] 전용 API를 사용하여 결제/가맹점 대시보드 페이지 구현
- [x] 결제대행사(PG) 도메인에 적합한 내용으로 구성
- [x] 가맹점/결제상태/결제수단 별 필터 적용
- [x] 거래내역 리스트 페이지 적용 (무한 스크롤 방식으로 구현)

## 실행 방법과 스크립트, 사용 버전
### 실행 방법
```
npm install
npm run dev
```

### 사용 버전
- React 19
- React Router DOM 7
- @tanstack/react-query 5.9
- Vite 7
- TypeScript 5.9
- Tailwind CSS 4
- Shadcn (recharts 등)
- Lucide Icons / Day.js / Axios
- ESLint 9
- TypeScript ESLint 8
- PostCSS 8 / autoprefixer

## 폴더구조
```
src
├─ components/
│  ├─ common/               # 공통 UI 컴포넌트
│  │  ├─ FilterBar.tsx          
│  │  ├─ LabeledSelect.tsx      
│  │  ├─ MerchantComboBox.tsx   
│  │  └─ PaymentListTable.tsx   
│  └─ ui/                   # shadcn 기반 기본 UI 컴포넌트
│     ├─ badge.tsx
│     │  ...
│     └─ select.tsx
│
├─ features/
│  ├─ dashboard/
│  │  └─ components/        # 대시보드 전용 컴포넌트
│  │     ├─ PaymentTrandChart.tsx       
│  │     ├─ PayTypeChart.tsx            
│  │     ├─ StatusDistributionChart.tsx 
│  │     ├─ SummaryCards.tsx            
│  │     └─ TopMerchantsTable.tsx       
│  │
│  └─ payments/            
│     ├─ api/
│     │  └─ payment-api.ts             # 결제/가맹점 관련 API 호출 래퍼
│     ├─ hooks/
│     │  └─ usePaymentData.ts          # 결제/가맹점 데이터 + 필터 공통 훅
│     ├─ utils/
│     │  ├─ aggregations.ts            # Summary, 차트용 집계 로직
│     │  ├─ filters.ts                 # 프론트 단 필터링 로직
│     │  └─ mappers.ts                 # PaymentDto → Payment 변환
├─ lib/
│  ├─ api.ts                 # 공통 API 유틸
│  └─ utils.ts               # 공통 유틸 함수
│
├─ pages/                    # 라우트 엔트리 컴포넌트
│  ├─ DashBoardPage.tsx      
│  └─ PaymentListPage.tsx    
│
├─ types/                    # 공통 타입 정의
│  ├─ dashboard.ts           
│  └─ payment.ts             
│
├─ App.tsx    
├─ index.css  
└─ main.tsx   
```

## 설계 의도
이 프로젝트는 결제/가맹점 데이터를 시각화하고 분석하는 대시보드를 구현하는 목적을 갖고 있으며,
데이터의 특성과 페이지 간 재사용성을 고려하여 다음과 같은 기준을 중심으로 설계를 진행하였습니다.

### 1. 기능 중심 구조
대시보드 구현 과제이긴 하나 핵심 도메인이 "결제"라고 생각하여,
관련된 비지니스 로직을 src/features/payments 아래로 모아 기능 단위의 응집도를 유지하고자 했습니다.
이를 통해, 아래와 같은 효과를 기대할 수 있습니다.
- 결제 데이터 조회/필터링/집계 로직을 여러 페이지에서 재사용 가능
- UI 레이어와 분리
- 비즈니스 규칙이 변경되더라도 core 영역만 수정 가능

### 2. 공통 데이터 훅 usePaymentData 사용
대시보드와 결제리스트 페이지 모두 대부분 동일한 데이터를 기반으로 할 뿐만 아니라 필터링 기능이 필요했기 때문에, 공통 데이터 훅으로 통합하여 데이터를 가져와 사용할 수 있도록 하였습니다.

### 3. UI 재사용성 극대화
현재 작업되지 않은 페이지에서도 사용할 수 있도록 /components/common 내부에 아래 UI 컴포넌트를 구성하였습니다.
	•	FilterBar
	•	MerchantComboBox
	•	LabeledSelect
	•	PaymentListTable

이 컴포넌트들은 페이지에 구애맏지 않고 다양한 페이지에서 필요로 할 것이라고 판단하였고, UI 스타일을 일관되게 유지하는 것이 좋을 것이라고 생각하였습니다.

