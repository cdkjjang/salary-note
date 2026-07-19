// 연봉 → 월 실수령액 계산
//
// 계산 구조:
//  1) 4대보험(근로자분) — 과세대상 월급여 기준 (lib/insurance.ts)
//  2) 근로소득세 — 연간 기준으로 산출 후 12로 나눠 월 추정
//     (총급여 → 근로소득공제 → 인적·연금·보험료 소득공제 → 과세표준
//      → 기본세율 산출세액 → 근로소득세액공제 → 결정세액)
//  3) 지방소득세 = 근로소득세 × 10%
//
// ⚠️ 매월 실제 원천징수는 '근로소득 간이세액표'를 따르므로 이 계산과 매월 다를 수 있고,
//    연말정산으로 최종 정산된다. 이 계산기는 부양가족·비과세를 반영한 '연간 기준 추정치'다.
//    세액공제(자녀·연금저축·의료비 등)와 상여 비중은 반영하지 않으므로 참고용이다.

import { employeeInsurance, type InsuranceResult } from "./insurance";

/** 근로소득공제 (소득세법 제47조, 한도 2,000만원) */
export function earnedIncomeDeduction(grossSalary: number): number {
  let d: number;
  if (grossSalary <= 5_000_000) d = grossSalary * 0.7;
  else if (grossSalary <= 15_000_000)
    d = 3_500_000 + (grossSalary - 5_000_000) * 0.4;
  else if (grossSalary <= 45_000_000)
    d = 7_500_000 + (grossSalary - 15_000_000) * 0.15;
  else if (grossSalary <= 100_000_000)
    d = 12_000_000 + (grossSalary - 45_000_000) * 0.05;
  else d = 14_750_000 + (grossSalary - 100_000_000) * 0.02;
  return Math.min(d, 20_000_000);
}

// 종합소득 기본세율 (소득세법 제55조, 2023년 개정 이후)
const BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduct: 0 },
  { limit: 50_000_000, rate: 0.15, deduct: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduct: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduct: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduct: 19_940_000 },
  { limit: 500_000_000, rate: 0.4, deduct: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduct: 35_940_000 },
  { limit: Infinity, rate: 0.45, deduct: 65_940_000 },
] as const;

/** 과세표준 → 산출세액 (기본세율) */
export function incomeTaxByBase(taxBase: number): number {
  if (taxBase <= 0) return 0;
  const b = BRACKETS.find((x) => taxBase <= x.limit)!;
  return taxBase * b.rate - b.deduct;
}

/** 근로소득세액공제 (소득세법 제59조, 총급여별 한도 적용) */
export function earnedIncomeTaxCredit(
  calculatedTax: number,
  grossSalary: number
): number {
  const credit =
    calculatedTax <= 1_300_000
      ? calculatedTax * 0.55
      : 715_000 + (calculatedTax - 1_300_000) * 0.3;

  let cap: number;
  if (grossSalary <= 33_000_000) cap = 740_000;
  else if (grossSalary <= 70_000_000)
    cap = Math.max(660_000, 740_000 - (grossSalary - 33_000_000) * 0.008);
  else if (grossSalary <= 120_000_000)
    cap = Math.max(500_000, 660_000 - (grossSalary - 70_000_000) * 0.5);
  else cap = Math.max(200_000, 500_000 - (grossSalary - 120_000_000) * 0.5);

  return Math.min(credit, cap);
}

export interface SalaryInput {
  annualSalary: number; // 계약 연봉 (비과세 포함)
  monthlyNonTax: number; // 월 비과세액 (식대 등)
  dependents: number; // 기본공제 대상 인원 (본인 포함, 최소 1)
}

export interface SalaryResult {
  monthlyGross: number; // 월 세전 급여 (연봉/12)
  taxableMonthly: number; // 4대보험·세금 부과 대상 월급여 (비과세 제외)
  insurance: InsuranceResult; // 월 4대보험 근로자분
  monthlyIncomeTax: number; // 월 근로소득세 (연간/12 추정)
  monthlyLocalTax: number; // 월 지방소득세
  monthlyDeduction: number; // 월 공제 합계
  monthlyNet: number; // 월 실수령액
  annualNet: number; // 연 실수령액
  detail: {
    grossSalary: number; // 총급여 (과세대상 연봉)
    taxBase: number; // 과세표준
    calculatedTax: number; // 산출세액
    taxCredit: number; // 근로소득세액공제
    annualIncomeTax: number; // 결정세액 (연 근로소득세)
    annualLocalTax: number; // 연 지방소득세
    annualInsurance: number; // 연 4대보험
  };
}

function floor10(n: number): number {
  return Math.floor(n / 10 + 1e-6) * 10;
}

export function calcSalary(
  input: SalaryInput
): { ok: true; result: SalaryResult } | { ok: false; error: "INVALID_INPUT" } {
  const annualSalary = Math.round(input.annualSalary);
  const monthlyNonTax = Math.max(0, Math.round(input.monthlyNonTax));
  const dependents = Math.max(1, Math.floor(input.dependents));

  if (
    !Number.isFinite(annualSalary) ||
    annualSalary <= 0 ||
    annualSalary > 100_000_000_000 ||
    monthlyNonTax * 12 >= annualSalary
  ) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  const monthlyGross = annualSalary / 12;
  const taxableMonthly = Math.floor(monthlyGross) - monthlyNonTax;
  const insurance = employeeInsurance(taxableMonthly);

  // --- 연간 근로소득세 ---
  const grossSalary = annualSalary - monthlyNonTax * 12; // 총급여
  const earnedIncomeAmount = Math.max(
    0,
    grossSalary - earnedIncomeDeduction(grossSalary)
  ); // 근로소득금액

  const personalDeduction = dependents * 1_500_000; // 인적공제(기본공제)
  const pensionDeduction = insurance.pension * 12; // 연금보험료 소득공제
  const insuranceDeduction =
    (insurance.health + insurance.longTermCare + insurance.employment) * 12; // 보험료 특별소득공제

  const taxBase = Math.max(
    0,
    earnedIncomeAmount - personalDeduction - pensionDeduction - insuranceDeduction
  );

  const calculatedTax = incomeTaxByBase(taxBase);
  const taxCredit = earnedIncomeTaxCredit(calculatedTax, grossSalary);
  const annualIncomeTax = floor10(Math.max(0, calculatedTax - taxCredit));
  const annualLocalTax = floor10(annualIncomeTax * 0.1);
  const annualInsurance = insurance.total * 12;

  const annualNet =
    annualSalary - annualInsurance - annualIncomeTax - annualLocalTax;

  const monthlyIncomeTax = floor10(annualIncomeTax / 12);
  const monthlyLocalTax = floor10(annualLocalTax / 12);
  const monthlyDeduction = insurance.total + monthlyIncomeTax + monthlyLocalTax;
  const monthlyNet = Math.round(monthlyGross) - monthlyDeduction;

  return {
    ok: true,
    result: {
      monthlyGross: Math.round(monthlyGross),
      taxableMonthly,
      insurance,
      monthlyIncomeTax,
      monthlyLocalTax,
      monthlyDeduction,
      monthlyNet,
      annualNet,
      detail: {
        grossSalary,
        taxBase,
        calculatedTax,
        taxCredit,
        annualIncomeTax,
        annualLocalTax,
        annualInsurance,
      },
    },
  };
}
