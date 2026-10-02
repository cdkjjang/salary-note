// 퇴직금 계산 — 근로자퇴직급여 보장법 제8조
//
// 법정 퇴직금 = 1일 평균임금 × 30 × (재직일수 / 365)
//  - 계속근로기간 1년 이상, 4주 평균 주 15시간 이상 근로자 대상
//  - 평균임금 = 퇴직 전 3개월간 임금총액 / 그 기간의 총일수
//    상여금·연차수당은 연간 발생분의 3/12(3개월분)을 임금총액에 가산
//  - 평균임금이 통상임금보다 적으면 통상임금을 평균임금으로 본다(본 계산은 미반영, 참고 표기)
//
// [날짜를 어떻게 받나 — 2026-10-02 점검에서 바로잡음]
//   화면은 **마지막 근무일**을 받는다. 사람들이 "퇴사일"로 떠올리는 날이 이것이다.
//   퇴직일(근로관계가 끝나는 날)은 그 다음 날이고, 계속근로기간은 입사일부터
//   마지막 근무일까지(양 끝 포함)다. 평균임금은 퇴직일 이전 3개월로 잡는다.
//   예전에는 입력값을 퇴직일로 보고 계산해, 마지막 근무일을 넣은 사람의 근속이
//   하루 짧게 잡혔다 — 2025-01-01 입사·2025-12-31 마지막 근무가 "1년 미만"으로 나왔다.
//   1년 판정도 일수(365) 대신 **달력 기준**(입사일 1년 뒤 같은 날 ≤ 퇴직일)으로 한다.
//   윤년이 끼면 365일을 채워도 1년이 안 되는 경우가 있기 때문이다.

import { addMonths, daysBetween, parseDate } from "./date";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface SeveranceInput {
  joinDate: string; // 입사일 YYYY-MM-DD
  lastWorkDate: string; // 마지막 근무일 YYYY-MM-DD (퇴직일은 그 다음 날)
  monthlyWage: number; // 퇴직 전 3개월 평균 월 급여(세전, 상여 제외)
  annualBonus?: number; // 최근 1년 상여금 총액(선택)
  annualLeavePay?: number; // 최근 1년 연차수당(선택)
}

export interface SeveranceResult {
  serviceDays: number; // 재직일수 (입사일~마지막 근무일, 양 끝 포함)
  serviceYears: number; // 재직연수(소수)
  periodDays: number; // 평균임금 산정 3개월 일수
  avgDailyWage: number; // 1일 평균임금
  severancePay: number; // 법정 퇴직금(세전)
  eligible: boolean; // 계속근로 1년 이상 여부 (달력 기준)
  retireDate: string; // 퇴직일 = 마지막 근무일 다음 날
}

export function calcSeverance(
  input: SeveranceInput
): { ok: true; result: SeveranceResult } | { ok: false; error: "INVALID_INPUT" } {
  const join = parseDate(input.joinDate);
  const last = parseDate(input.lastWorkDate);
  const monthlyWage = Math.round(input.monthlyWage);
  const annualBonus = Math.max(0, Math.round(input.annualBonus ?? 0));
  const annualLeavePay = Math.max(0, Math.round(input.annualLeavePay ?? 0));

  if (
    !join ||
    !last ||
    !Number.isFinite(monthlyWage) ||
    monthlyWage <= 0 ||
    daysBetween(join, last) < 0
  ) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  // 퇴직일 = 마지막 근무일 다음 날
  const retire = new Date(last.getTime() + MS_PER_DAY);

  const serviceDays = daysBetween(join, retire); // 입사일~마지막 근무일, 양 끝 포함
  const serviceYears = serviceDays / 365;

  // 평균임금 산정 기간: 퇴직일 이전 3개월
  const periodStart = addMonths(retire, -3);
  const periodDays = daysBetween(periodStart, retire);

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
      // 입사일로부터 1년이 되는 날(같은 날짜)이 퇴직일 이전이거나 같으면 1년 이상
      eligible: addMonths(join, 12).getTime() <= retire.getTime(),
      retireDate: retire.toISOString().slice(0, 10),
    },
  };
}
