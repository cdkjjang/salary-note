import { describe, expect, it } from "vitest";
import { employeeInsurance, PENSION_RATE_BY_YEAR, pensionBase, pensionRateFor, RATES } from "./insurance";

describe("pensionRateFor — 연도별 국민연금 요율", () => {
  it("해가 바뀌는 순간 다음 해 요율로 넘어간다", () => {
    expect(pensionRateFor(new Date(2026, 11, 31))).toBe(0.0475);
    expect(pensionRateFor(new Date(2027, 0, 1))).toBe(0.05);
  });
  it("2025년은 개정 전 4.5%, 2033년 이후는 13%의 절반", () => {
    expect(pensionRateFor(new Date(2025, 5, 1))).toBe(0.045);
    expect(pensionRateFor(new Date(2040, 0, 1))).toBe(0.065);
  });
});

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
    // 국민연금 3,000,000 × 그해 요율 (2026년 4.75% → 142,500)
    expect(r.pension).toBe(Math.floor((3_000_000 * RATES.pension) / 10 + 1e-6) * 10);
    // 건강 3,000,000 × 3.595% = 107,850
    expect(r.health).toBe(107_850);
    // 장기요양 107,850 × 13.14% = 14,171 → 14,170
    expect(r.longTermCare).toBe(14_170);
    // 고용 3,000,000 × 0.9% = 27,000
    expect(r.employment).toBe(27_000);
    expect(r.total).toBe(r.pension + 107_850 + 14_170 + 27_000);
  });

  it("고소득자는 국민연금이 상한(659만)에서 고정", () => {
    const r = employeeInsurance(10_000_000);
    expect(r.pension).toBe(Math.floor((RATES.pensionBaseMax * RATES.pension) / 10) * 10);
    // 건강보험은 상한이 사실상 없어 보수에 비례
    expect(r.health).toBe(Math.floor((10_000_000 * RATES.health) / 10) * 10);
  });

  it("0 이하 입력은 모두 0", () => {
    expect(employeeInsurance(0).total).toBe(0);
    expect(employeeInsurance(-100).total).toBe(0);
  });

  // 아래 테스트는 계산 로직이 아니라 '고시값 자체'를 고정한다.
  // 다른 테스트들은 RATES를 기호로 참조하므로 상수가 낡아도 통과한다.
  // 요율이 바뀌면 이 테스트가 실패해야 갱신을 놓치지 않는다.
  it("고시값 고정 — 요율·상하한이 현행과 일치", () => {
    // 국민연금 부칙 제4조 — 연도별 근로자 몫. 연도가 바뀌면 RATES.pension이 따라 바뀐다.
    expect(PENSION_RATE_BY_YEAR[2026]).toBe(0.0475); // 총 9.5%
    expect(PENSION_RATE_BY_YEAR[2027]).toBe(0.05); // 총 10%
    expect(PENSION_RATE_BY_YEAR[2032]).toBe(0.0625); // 총 12.5%
    expect(PENSION_RATE_BY_YEAR[2033]).toBe(0.065); // 총 13% (본칙 제88조③)
    expect(RATES.pension).toBe(pensionRateFor());
    expect(RATES.pensionBaseMax).toBe(6_590_000); // 2026.7~2027.6
    expect(RATES.pensionBaseMin).toBe(410_000); // 2026.7~2027.6
    expect(RATES.health).toBe(0.03595); // 건강보험 7.19%의 절반
    expect(RATES.longTermCareOfHealth).toBe(0.1314); // 장기요양 0.9448% ÷ 7.19%
    expect(RATES.employment).toBe(0.009);
  });
});
