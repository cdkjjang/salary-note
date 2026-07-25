import { describe, expect, it } from "vitest";
import { employeeInsurance, pensionBase, RATES } from "./insurance";

describe("pensionBase — 천원 절사 후 상·하한", () => {
  it("천원 미만 절사", () => {
    expect(pensionBase(3_966_666)).toBe(3_966_000);
  });
  it("상한 초과는 상한으로", () => {
    expect(pensionBase(10_000_000)).toBe(RATES.pensionBaseMax);
  });
  it("하한 미만은 하한으로", () => {
    expect(pensionBase(100_000)).toBe(RATES.pensionBaseMin);
  });
});

describe("employeeInsurance — 근로자 부담 4대보험", () => {
  it("월 300만원: 각 항목 요율대로 (10원 절사)", () => {
    const r = employeeInsurance(3_000_000);
    // 국민연금 3,000,000 × 4.75% = 142,500
    expect(r.pension).toBe(142_500);
    // 건강 3,000,000 × 3.595% = 107,850
    expect(r.health).toBe(107_850);
    // 장기요양 107,850 × 13.14% = 14,171 → 14,170
    expect(r.longTermCare).toBe(14_170);
    // 고용 3,000,000 × 0.9% = 27,000
    expect(r.employment).toBe(27_000);
    expect(r.total).toBe(142_500 + 107_850 + 14_170 + 27_000);
  });

  it("고소득자는 국민연금이 상한(637만)에서 고정", () => {
    const r = employeeInsurance(10_000_000);
    expect(r.pension).toBe(Math.floor((RATES.pensionBaseMax * RATES.pension) / 10) * 10);
    // 건강보험은 상한이 사실상 없어 보수에 비례
    expect(r.health).toBe(Math.floor((10_000_000 * RATES.health) / 10) * 10);
  });

  it("0 이하 입력은 모두 0", () => {
    expect(employeeInsurance(0).total).toBe(0);
    expect(employeeInsurance(-100).total).toBe(0);
  });
});
