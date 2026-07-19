import { describe, expect, it } from "vitest";
import {
  calcHourly,
  CURRENT_MIN_WAGE,
  monthlyFromHourly,
  weeklyHolidayPay,
} from "./hourly";

describe("최저임금 상수", () => {
  it("2026년 최저시급 10,320원", () => {
    expect(CURRENT_MIN_WAGE).toBe(10_320);
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
