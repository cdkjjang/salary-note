// 4대보험 근로자 부담액 계산 (2026년 요율 기준)
//
// ⚠️ 요율·상하한은 매년 갱신 대상 — 값 변경 시 반드시 테스트도 함께 갱신할 것:
//  - 국민연금 기준소득월액 상·하한: 매년 7월 조정 (아래는 2025.7~2026.6 적용값)
//  - 건강보험료율: 매년 초 보건복지부 고시 (2025년 7.09% 동결, 2026년 동결 가정 — 연초 확인)
//  - 장기요양보험료율: 건강보험료 대비 12.95% (2025년)
//  - 고용보험 실업급여 요율: 근로자 0.9%
//
// 실제 고지액은 기관별 절사 방식(원단위/10원단위) 차이로 수십 원 오차가 날 수 있다.
// 여기서는 국민연금·건강·장기요양·고용 모두 10원 미만 절사로 통일한다.

export const RATES = {
  pension: 0.045, // 국민연금 근로자 4.5% (사업주 4.5%)
  pensionBaseMax: 6_370_000, // 기준소득월액 상한 (2025.7~2026.6)
  pensionBaseMin: 400_000, // 기준소득월액 하한 (2025.7~2026.6)
  health: 0.03545, // 건강보험 근로자 3.545% (총 7.09%의 절반)
  longTermCareOfHealth: 0.1295, // 장기요양 = 건강보험료 × 12.95%
  employment: 0.009, // 고용보험(실업급여) 근로자 0.9%
} as const;

function floor10(n: number): number {
  // 부동소수점 오차 보정(예: 3,000,000 × 0.009 = 26999.999…) 후 10원 미만 절사
  return Math.floor(n / 10 + 1e-6) * 10;
}

export interface InsuranceResult {
  pension: number; // 국민연금
  health: number; // 건강보험
  longTermCare: number; // 장기요양보험
  employment: number; // 고용보험
  total: number; // 합계
}

/**
 * 국민연금 기준소득월액 — 천원 단위 절사 후 상·하한 적용.
 * (국민연금법 시행령 제5조 기준소득월액 산정)
 */
export function pensionBase(monthlyPay: number): number {
  const thousand = Math.floor(monthlyPay / 1000) * 1000;
  return Math.min(Math.max(thousand, RATES.pensionBaseMin), RATES.pensionBaseMax);
}

/**
 * 근로자 부담 4대보험 (월 기준).
 * @param monthlyPay 4대보험 부과 대상 월 보수 (비과세 제외 과세대상 급여)
 */
export function employeeInsurance(monthlyPay: number): InsuranceResult {
  if (!Number.isFinite(monthlyPay) || monthlyPay <= 0) {
    return { pension: 0, health: 0, longTermCare: 0, employment: 0, total: 0 };
  }
  const pension = floor10(pensionBase(monthlyPay) * RATES.pension);
  const health = floor10(monthlyPay * RATES.health);
  const longTermCare = floor10(health * RATES.longTermCareOfHealth);
  const employment = floor10(monthlyPay * RATES.employment);
  const total = pension + health + longTermCare + employment;
  return { pension, health, longTermCare, employment, total };
}
