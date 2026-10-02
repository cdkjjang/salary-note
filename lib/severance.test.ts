import { describe, expect, it } from "vitest";
import { calcSeverance } from "./severance";

describe("calcSeverance — 법정 퇴직금", () => {
  it("월급 300만, 만 3년 근무 → 약 3개월치(≈900만원)", () => {
    const out = calcSeverance({
      joinDate: "2022-01-01",
      lastWorkDate: "2024-12-31",
      monthlyWage: 3_000_000,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.serviceDays).toBe(1096); // 윤년 포함, 양 끝 포함
    expect(out.result.retireDate).toBe("2025-01-01");
    // 1일 평균임금 ≈ 9,000,000 / 92일(10·11·12월), 퇴직금 ≈ 평균임금×30×근속
    expect(out.result.periodDays).toBe(92);
    expect(out.result.severancePay).toBeGreaterThan(8_800_000);
    expect(out.result.severancePay).toBeLessThan(9_300_000);
    expect(out.result.eligible).toBe(true);
  });

  it("상여금이 있으면 평균임금이 올라 퇴직금이 커진다", () => {
    const base = calcSeverance({
      joinDate: "2020-03-01",
      lastWorkDate: "2025-02-28",
      monthlyWage: 3_000_000,
    });
    const withBonus = calcSeverance({
      joinDate: "2020-03-01",
      lastWorkDate: "2025-02-28",
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
      lastWorkDate: "2024-11-30",
      monthlyWage: 2_500_000,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.eligible).toBe(false);
  });

  it("입사일부터 1년 뒤 전날까지 근무하면 1년이다 (마지막 근무일 입력)", () => {
    // 2026-10-02 점검 전에는 이 경우가 364일로 잡혀 1년 미만으로 나왔다
    const out = calcSeverance({
      joinDate: "2025-01-01",
      lastWorkDate: "2025-12-31",
      monthlyWage: 3_000_000,
    });
    expect(out.ok && out.result.serviceDays).toBe(365);
    expect(out.ok && out.result.eligible).toBe(true);
    const oneDayShort = calcSeverance({
      joinDate: "2025-01-01",
      lastWorkDate: "2025-12-30",
      monthlyWage: 3_000_000,
    });
    expect(oneDayShort.ok && oneDayShort.result.eligible).toBe(false);
  });

  it("윤일이 끼면 365일을 채워도 1년이 아니다 — 달력 기준", () => {
    // 2023-03-01 입사 → 1년이 되는 날은 2024-03-01. 마지막 근무 2024-02-28이면 365일이지만 미달
    const out = calcSeverance({
      joinDate: "2023-03-01",
      lastWorkDate: "2024-02-28",
      monthlyWage: 3_000_000,
    });
    expect(out.ok && out.result.serviceDays).toBe(365);
    expect(out.ok && out.result.eligible).toBe(false);
    const full = calcSeverance({
      joinDate: "2023-03-01",
      lastWorkDate: "2024-02-29",
      monthlyWage: 3_000_000,
    });
    expect(full.ok && full.result.eligible).toBe(true);
  });

  it("잘못된 날짜·음수는 에러", () => {
    expect(calcSeverance({ joinDate: "2025-01-01", lastWorkDate: "2024-01-01", monthlyWage: 300 }).ok).toBe(false);
    expect(calcSeverance({ joinDate: "bad", lastWorkDate: "2025-01-01", monthlyWage: 300 }).ok).toBe(false);
  });
});
