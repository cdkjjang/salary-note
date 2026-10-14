// 4대보험 근로자 부담액 계산 (2026년 요율 기준)
//
// ⚠️ 요율·상하한은 매년 갱신 대상 — 값 변경 시 반드시 테스트도 함께 갱신할 것:
//  - 국민연금 요율: 2025년 연금개혁으로 9%→13% 단계 인상. 2026년 9.5%(근로자 4.75%).
//    연도별 비율은 국민연금법 부칙(2025.4.2 개정) 제4조에 이미 정해져 있어
//    `PENSION_RATE_BY_YEAR` 표로 들고, 오늘 날짜에 맞는 값을 고른다(최저임금 `MIN_WAGE`와 같은 방식).
//    ⚠️ 정적 사이트라 화면의 값은 **빌드 시점** 기준이다. 1월 1일 이후 한 번 재배포해야 바뀐다.
//  - 국민연금 기준소득월액 상·하한: 매년 7월 조정 (아래는 2026.7~2027.6 적용값)
//  - 건강보험료율: 매년 초 보건복지부 고시 (2026년 7.19% → 근로자 3.595%)
//    2027년도는 2026.9.8 건강보험정책심의위원회에서 7.19% 동결 — 1월에 바꿀 것이 없다.
//  - 장기요양보험료율: 건강보험료 대비 13.14% (2026년). 2027년분은 2026-10-14 현재 미결정(작년은 11월 의결).
//  - 고용보험 실업급여 요율: 근로자 0.9%
//
// 실제 고지액은 기관별 절사 방식(원단위/10원단위) 차이로 수십 원 오차가 날 수 있다.
// 여기서는 국민연금·건강·장기요양·고용 모두 10원 미만 절사로 통일한다.

/**
 * 국민연금 근로자 부담 비율 — 국민연금법 부칙 제4조 제1항(사업장가입자 기여금).
 * 2026년 1만분의 475에서 매년 25씩 올라 2032년 1만분의 625, 2033년부터는
 * 본칙 제88조 제3항의 1천분의 65(총 13%)가 된다.
 */
export const PENSION_RATE_BY_YEAR = {
  2025: 0.045, // 개정 전 본칙 1천분의 45 (총 9%)
  2026: 0.0475,
  2027: 0.05,
  2028: 0.0525,
  2029: 0.055,
  2030: 0.0575,
  2031: 0.06,
  2032: 0.0625,
  2033: 0.065,
} as const;

const PENSION_RATE_YEARS = Object.keys(PENSION_RATE_BY_YEAR)
  .map(Number)
  .sort((a, b) => a - b);

/** 주어진 시점(기본: 오늘)에 적용되는 국민연금 근로자 부담 비율 */
export function pensionRateFor(base: Date = new Date()): number {
  const year = base.getFullYear();
  const applicable = PENSION_RATE_YEARS.filter((y) => y <= year);
  const key = (applicable.at(-1) ?? PENSION_RATE_YEARS[0]) as keyof typeof PENSION_RATE_BY_YEAR;
  return PENSION_RATE_BY_YEAR[key];
}

export const RATES = {
  pension: pensionRateFor(), // 국민연금 근로자 몫 — 2026년 4.75%(총 9.5%), 2027년 5.0%(총 10%)
  pensionBaseMax: 6_590_000, // 기준소득월액 상한 (2026.7~2027.6)
  pensionBaseMin: 410_000, // 기준소득월액 하한 (2026.7~2027.6)
  health: 0.03595, // 건강보험 근로자 3.595% (총 7.19%의 절반) — 2026년
  longTermCareOfHealth: 0.1314, // 장기요양 = 건강보험료 × 13.14% (2026년)
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
