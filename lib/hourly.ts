// 시급·최저임금·주휴수당·월급 환산
//
// ⚠️ 최저임금은 매년 갱신 — 값 변경 시 테스트도 함께 갱신할 것.
//  - 2025년 최저시급: 10,030원
//  - 2026년 최저시급: 10,320원 (2025.7 고용노동부 고시, 2.9% 인상)
//
// 월 환산 209시간 = (주 40시간 + 주휴 8시간) × (365/7/12 ≈ 4.345주)
//   → 주 소정근로 40시간 기준 유급시간 월 약 209시간

export const MIN_WAGE = {
  2025: 10_030,
  2026: 10_320,
} as const;

export const CURRENT_MIN_WAGE = MIN_WAGE[2026];

/** 월 209시간 기준 시급 → 월급 환산 */
export function monthlyFromHourly(hourly: number): number {
  return Math.round(hourly * 209);
}

/**
 * 주휴수당 — 1주 소정근로 15시간 이상일 때 지급.
 * 주휴시간 = min(주 소정근로시간, 40) / 40 × 8, 여기에 시급을 곱한다.
 * (주 40시간 이상이면 8시간분 = 시급 × 8)
 */
export function weeklyHolidayPay(hourly: number, weeklyHours: number): number {
  if (weeklyHours < 15) return 0;
  const paidHours = (Math.min(weeklyHours, 40) / 40) * 8;
  return Math.round(hourly * paidHours);
}

export interface HourlyResult {
  hourly: number;
  weeklyHours: number;
  belowMinWage: boolean; // 최저임금 미달 여부
  weeklyHolidayPay: number; // 주휴수당(주)
  weeklyPay: number; // 주급(근로+주휴)
  monthlyPay: number; // 월급 환산(4.345주 기준)
}

export function calcHourly(
  hourly: number,
  weeklyHours: number
): { ok: true; result: HourlyResult } | { ok: false; error: "INVALID_INPUT" } {
  const h = Math.round(hourly);
  const w = weeklyHours;
  if (!Number.isFinite(h) || h <= 0 || !Number.isFinite(w) || w <= 0 || w > 68) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  const weeksPerMonth = 365 / 7 / 12; // ≈ 4.345
  const holiday = weeklyHolidayPay(h, w);
  const weeklyWork = Math.round(h * w);
  const weeklyPay = weeklyWork + holiday;
  const monthlyPay = Math.round(weeklyPay * weeksPerMonth);

  return {
    ok: true,
    result: {
      hourly: h,
      weeklyHours: w,
      belowMinWage: h < CURRENT_MIN_WAGE,
      weeklyHolidayPay: holiday,
      weeklyPay,
      monthlyPay,
    },
  };
}
