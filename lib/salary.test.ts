import { describe, expect, it } from "vitest";
import {
  calcSalary,
  earnedIncomeDeduction,
  earnedIncomeTaxCredit,
  incomeTaxByBase,
} from "./salary";

describe("earnedIncomeDeduction — 근로소득공제", () => {
  it("총급여 4,760만원 구간 (1,200만 + 초과 5%)", () => {
    // 12,000,000 + (47,600,000 - 45,000,000) × 5% = 12,130,000
    expect(earnedIncomeDeduction(47_600_000)).toBe(12_130_000);
  });
  it("500만원 이하 70%", () => {
    expect(earnedIncomeDeduction(4_000_000)).toBe(2_800_000);
  });
  it("한도 2,000만원", () => {
    expect(earnedIncomeDeduction(1_000_000_000)).toBe(20_000_000);
  });
});

describe("incomeTaxByBase — 기본세율 산출세액", () => {
  it("과세표준 2,949만원: 15% - 126만 누진공제", () => {
    expect(incomeTaxByBase(29_494_360)).toBeCloseTo(29_494_360 * 0.15 - 1_260_000, 0);
  });
  it("1,400만 이하 6%", () => {
    expect(incomeTaxByBase(10_000_000)).toBeCloseTo(600_000, 0);
  });
  it("과세표준 0 이하는 0", () => {
    expect(incomeTaxByBase(0)).toBe(0);
    expect(incomeTaxByBase(-100)).toBe(0);
  });
});

describe("earnedIncomeTaxCredit — 근로소득세액공제 한도", () => {
  it("총급여 3,300만 이하 한도 74만", () => {
    // 산출세액이 커서 공제가 한도에 걸리는 경우
    expect(earnedIncomeTaxCredit(5_000_000, 30_000_000)).toBe(740_000);
  });
  it("총급여 4,760만은 한도 66만으로 축소", () => {
    expect(earnedIncomeTaxCredit(5_000_000, 47_600_000)).toBe(660_000);
  });
});

describe("calcSalary — 연봉 실수령액 통합", () => {
  it("실수령 = 세전 - (4대보험 + 소득세 + 지방세) 항등식", () => {
    const out = calcSalary({
      annualSalary: 50_000_000,
      monthlyNonTax: 200_000,
      dependents: 1,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    const r = out.result;
    expect(r.monthlyNet).toBe(r.monthlyGross - r.monthlyDeduction);
    expect(r.monthlyDeduction).toBe(
      r.insurance.total + r.monthlyIncomeTax + r.monthlyLocalTax
    );
  });

  it("연봉 5,000만(부양1): 월 실수령 약 355~360만원", () => {
    const out = calcSalary({
      annualSalary: 50_000_000,
      monthlyNonTax: 200_000,
      dependents: 1,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.monthlyNet).toBeGreaterThan(3_540_000);
    expect(out.result.monthlyNet).toBeLessThan(3_600_000);
  });

  it("부양가족이 많으면 세금이 줄어 실수령이 늘어난다", () => {
    const a = calcSalary({ annualSalary: 60_000_000, monthlyNonTax: 200_000, dependents: 1 });
    const b = calcSalary({ annualSalary: 60_000_000, monthlyNonTax: 200_000, dependents: 4 });
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(b.result.monthlyNet).toBeGreaterThan(a.result.monthlyNet);
  });

  it("연 실수령액은 연봉보다 작고 월 실수령×12에 근접", () => {
    const out = calcSalary({ annualSalary: 36_000_000, monthlyNonTax: 200_000, dependents: 1 });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.annualNet).toBeLessThan(36_000_000);
    expect(Math.abs(out.result.annualNet - out.result.monthlyNet * 12)).toBeLessThan(2_000);
  });

  it("잘못된 입력은 에러", () => {
    expect(calcSalary({ annualSalary: 0, monthlyNonTax: 0, dependents: 1 }).ok).toBe(false);
    expect(
      calcSalary({ annualSalary: 1_000_000, monthlyNonTax: 200_000, dependents: 1 }).ok
    ).toBe(false); // 비과세×12 ≥ 연봉
  });
});
