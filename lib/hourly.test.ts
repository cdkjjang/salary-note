import { describe, expect, it } from "vitest";
import {
  calcHourly,
  MIN_WAGE,
  minWageFor,
  monthlyFromHourly,
  weeklyHolidayPay,
} from "./hourly";

// 고시값 고정 테스트 — 상수를 기호로만 참조하면 값이 낡아도 통과하므로
// 연도별 고시액을 리터럴로 박아 둔다.
describe("최저임금 고시액", () => {
  it("연도별 고시액", () => {
    expect(MIN_WAGE[2025]).toBe(10_030);
    expect(MIN_WAGE[2026]).toBe(10_320);
    expect(MIN_WAGE[2027]).toBe(10_700); // 2026.8.5 고시, 2027.1.1 시행
  });

  it("2027년 고시 월 환산액 2,236,300원과 209시간 환산이 일치한다", () => {
    expect(monthlyFromHourly(MIN_WAGE[2027])).toBe(2_236_300);
  });
});

describe("minWageFor — 시점에 맞는 최저시급", () => {
  it("연도가 바뀌면 그해 고시액이 적용된다", () => {
    expect(minWageFor(new Date("2026-06-01T00:00:00"))).toBe(10_320);
    expect(minWageFor(new Date("2026-12-31T00:00:00"))).toBe(10_320);
    expect(minWageFor(new Date("2027-01-01T00:00:00"))).toBe(10_700);
  });

  it("표에 없는 미래 연도는 가장 최근 고시액을 쓴다", () => {
    expect(minWageFor(new Date("2029-03-01T00:00:00"))).toBe(10_700);
  });
});

describe("monthlyFromHourly — 월 209시간 환산", () => {
  it("최저시급 → 209시간", () => {
    expect(monthlyFromHourly(10_320)).toBe(10_320 * 209);
  });
});

describe("weeklyHolidayPay — 주휴수당", () => {
  it("주 40시간: 8시간분", () => {
    expect(weeklyHolidayPay(10_320, 40)).toBe(10_320 * 8);
  });
  it("주 20시간: 비례하여 4시간분", () => {
    expect(weeklyHolidayPay(10_320, 20)).toBe(10_320 * 4);
  });
  it("주 15시간 미만은 0", () => {
    expect(weeklyHolidayPay(10_320, 14)).toBe(0);
  });
  it("주 40시간 초과도 8시간 상한", () => {
    expect(weeklyHolidayPay(10_320, 52)).toBe(10_320 * 8);
  });
});

describe("calcHourly — 통합", () => {
  it("최저시급 주40시간: 최저임금 미달 아님, 주급에 주휴 포함", () => {
    const out = calcHourly(10_320, 40);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.belowMinWage).toBe(false);
    expect(out.result.weeklyPay).toBe(10_320 * 40 + 10_320 * 8);
  });
  it("최저임금 미달 감지", () => {
    const out = calcHourly(9_000, 40);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.belowMinWage).toBe(true);
  });
  it("잘못된 입력은 에러", () => {
    expect(calcHourly(0, 40).ok).toBe(false);
    expect(calcHourly(10_320, 0).ok).toBe(false);
  });
});
