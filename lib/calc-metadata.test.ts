import { describe, expect, it } from "vitest";
import { metadata as hourlyMeta } from "../app/calc/hourly/page";
import { CURRENT_MIN_WAGE, CURRENT_MIN_WAGE_YEAR, MIN_WAGE, minWageYearFor } from "./hourly";

/**
 * 시급 계산기 제목의 연도가 최저임금 표에서 파생되는지 고정하는 테스트.
 *
 * 2026-09-10 측정에서 본문 페이지 444개 중 제목에 연도가 있는 것이 9개(2%)뿐이었다.
 * 한국어 검색은 "2026 최저임금"처럼 연도를 붙이므로 그 검색어를 못 잡고 있었다.
 *
 * 제목에 연도를 넣되 **`MIN_WAGE` 표에서 끌어오게** 했다. 손으로 적으면
 * 1월 1일에 제목만 낡아 계산 결과와 어긋난다. 2027년 값이 이미 표에 있으므로
 * 해가 바뀌면 제목이 알아서 2027년으로 바뀐다.
 */

describe("시급 계산기 제목의 연도", () => {
  it("제목에 현재 적용 연도가 들어 있다", () => {
    expect(String(hourlyMeta.title)).toContain(String(CURRENT_MIN_WAGE_YEAR));
  });

  it("표에 없는 연도를 제목에 박아 두지 않았다", () => {
    const bad = [...String(hourlyMeta.title).matchAll(/20\d\d/g)]
      .map((m) => m[0])
      .filter((y) => y !== String(CURRENT_MIN_WAGE_YEAR));
    expect(bad).toEqual([]);
  });

  it("설명의 최저시급이 표에서 온 값이다", () => {
    const desc = String(hourlyMeta.description);
    expect(desc).toContain(CURRENT_MIN_WAGE.toLocaleString());
    expect(desc).toContain(String(CURRENT_MIN_WAGE_YEAR));
  });

  it("minWageYearFor가 시행일 기준으로 연도를 고른다", () => {
    // 고시는 전년도에 나오고 1월 1일에 효력이 생긴다.
    expect(minWageYearFor(new Date("2026-12-31"))).toBe(2026);
    expect(minWageYearFor(new Date("2027-01-01"))).toBe(2027);
    // 표에 없는 먼 미래는 가장 최근 값으로 갈음한다.
    expect(minWageYearFor(new Date("2030-06-01"))).toBe(
      Math.max(...Object.keys(MIN_WAGE).map(Number)),
    );
  });

  it("제목이 검색결과에서 잘리지 않는다", () => {
    expect(String(hourlyMeta.title).length).toBeLessThanOrEqual(45);
  });
});
