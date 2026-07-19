// 퇴직금 계산 — 근로자퇴직급여 보장법 제8조
//
// 법정 퇴직금 = 1일 평균임금 × 30 × (재직일수 / 365)
//  - 계속근로기간 1년 이상, 4주 평균 주 15시간 이상 근로자 대상
//  - 평균임금 = 퇴직 전 3개월간 임금총액 / 그 기간의 총일수
//    상여금·연차수당은 연간 발생분의 3/12(3개월분)을 임금총액에 가산
//  - 평균임금이 통상임금보다 적으면 통상임금을 평균임금으로 본다(본 계산은 미반영, 참고 표기)

import { addMonths, daysBetween, parseDate } from "./date";

export interface SeveranceInput {
  joinDate: string; // 입사일 YYYY-MM-DD
  leaveDate: string; // 퇴사일(마지막 근무 다음 날 아님, 퇴직일) YYYY-MM-DD
  monthlyWage: number; // 퇴직 전 3개월 평균 월 급여(세전, 상여 제외)
  annualBonus?: number; // 최근 1년 상여금 총액(선택)
  annualLeavePay?: number; // 최근 1년 연차수당(선택)
}

export interface SeveranceResult {
  serviceDays: number; // 재직일수
  serviceYears: number; // 재직연수(소수)
  periodDays: number; // 평균임금 산정 3개월 일수
  avgDailyWage: number; // 1일 평균임금
  severancePay: number; // 법정 퇴직금(세전)
  eligible: boolean; // 1년 이상 여부
}

export function calcSeverance(
  input: SeveranceInput
): { ok: true; result: SeveranceResult } | { ok: false; error: "INVALID_INPUT" } {
  const join = parseDate(input.joinDate);
  const leave = parseDate(input.leaveDate);
  const monthlyWage = Math.round(input.monthlyWage);
  const annualBonus = Math.max(0, Math.round(input.annualBonus ?? 0));
  const annualLeavePay = Math.max(0, Math.round(input.annualLeavePay ?? 0));

  if (
    !join ||
    !leave ||
    !Number.isFinite(monthlyWage) ||
    monthlyWage <= 0 ||
    daysBetween(join, leave) <= 0
  ) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  const serviceDays = daysBetween(join, leave);
  const serviceYears = serviceDays / 365;

  // 평균임금 산정 기간: 퇴직일 직전 3개월
  const periodStart = addMonths(leave, -3);
  const periodDays = daysBetween(periodStart, leave);

  // 3개월 임금총액 = 3개월치 급여 + 상여·연차수당의 3/12
  const threeMonthWage =
    monthlyWage * 3 + (annualBonus + annualLeavePay) * (3 / 12);
  const avgDailyWage = threeMonthWage / periodDays;

  const severancePay = Math.round(avgDailyWage * 30 * (serviceDays / 365));

  return {
    ok: true,
    result: {
      serviceDays,
      serviceYears,
      periodDays,
      avgDailyWage: Math.round(avgDailyWage),
      severancePay,
      eligible: serviceDays >= 365,
    },
  };
}
