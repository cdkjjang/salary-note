import { describe, expect, it } from "vitest";
import { calcSeverance } from "./severance";

describe("calcSeverance — 법정 퇴직금", () => {
  it("월급 300만, 만 3년 근무 → 약 3개월치(≈900만원)", () => {
    const out = calcSeverance({
      joinDate: "2022-01-01",
      leaveDate: "2025-01-01",
      monthlyWage: 3_000_000,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.serviceDays).toBe(1096); // 윤년 포함
    // 1일 평균임금 ≈ 9,000,000 / 90~92일, 퇴직금 ≈ 평균임금×30×근속
    expect(out.result.severancePay).toBeGreaterThan(8_800_000);
    expect(out.result.severancePay).toBeLessThan(9_300_000);
    expect(out.result.eligible).toBe(true);
  });

  it("상여금이 있으면 평균임금이 올라 퇴직금이 커진다", () => {
    const base = calcSeverance({
      joinDate: "2020-03-01",
      leaveDate: "2025-03-01",
      monthlyWage: 3_000_000,
    });
    const withBonus = calcSeverance({
      joinDate: "2020-03-01",
      leaveDate: "2025-03-01",
      monthlyWage: 3_000_000,
      annualBonus: 6_000_000,
    });
    expect(base.ok && withBonus.ok).toBe(true);
    if (!base.ok || !withBonus.ok) return;
    expect(withBonus.result.severancePay).toBeGreaterThan(base.result.severancePay);
  });

  it("1년 미만은 eligible=false (금액은 참고 계산)", () => {
    const out = calcSeverance({
      joinDate: "2024-06-01",
      leaveDate: "2024-12-01",
      monthlyWage: 2_500_000,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.eligible).toBe(false);
  });

  it("잘못된 날짜·음수는 에러", () => {
    expect(calcSeverance({ joinDate: "2025-01-01", leaveDate: "2024-01-01", monthlyWage: 300 }).ok).toBe(false);
    expect(calcSeverance({ joinDate: "bad", leaveDate: "2025-01-01", monthlyWage: 300 }).ok).toBe(false);
  });
});
