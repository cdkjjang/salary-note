"use client";

import { useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import { formatWon } from "@/lib/date";
import { calcHourly, CURRENT_MIN_WAGE } from "@/lib/hourly";

export default function HourlyCalculator() {
  const [hourly, setHourly] = useState(String(CURRENT_MIN_WAGE));
  const [weeklyHours, setWeeklyHours] = useState("40");

  const hourlyNum = parseMoney(hourly);
  const hoursNum = parseMoney(weeklyHours);
  const ready =
    hourlyNum !== null && hourlyNum > 0 && hoursNum !== null && hoursNum > 0;

  const outcome = ready ? calcHourly(hourlyNum, hoursNum) : null;

  return (
    <section className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        <MoneyField
          label="시급"
          hint={`2026년 최저 ${CURRENT_MIN_WAGE.toLocaleString("ko-KR")}원`}
          unit="원"
          value={hourly}
          onChange={setHourly}
          placeholder={String(CURRENT_MIN_WAGE)}
        />
        <MoneyField
          label="주 근로시간"
          hint="1주 소정근로"
          unit="시간"
          value={weeklyHours}
          onChange={setWeeklyHours}
          placeholder="40"
        />
      </div>

      {!ready && (
        <p className="text-sm text-muted">시급과 주 근로시간을 입력하세요.</p>
      )}

      {outcome && outcome.ok && (
        <ResultCard title="주급·월급 환산 (주휴수당 포함)">
          <p className="text-3xl font-extrabold text-accent-strong">
            월 {formatWon(outcome.result.monthlyPay)}
          </p>
          <dl className="mt-3 space-y-1.5 text-[15px]">
            <div className="flex justify-between">
              <dt>주급 (근로 + 주휴)</dt>
              <dd className="font-bold">{formatWon(outcome.result.weeklyPay)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>주휴수당</dt>
              <dd className="font-bold">
                {outcome.result.weeklyHolidayPay > 0
                  ? formatWon(outcome.result.weeklyHolidayPay)
                  : "대상 아님(주 15시간 미만)"}
              </dd>
            </div>
          </dl>
          {outcome.result.belowMinWage && (
            <p className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm font-semibold text-red-600 dark:text-red-400">
              입력한 시급이 2026년 최저임금(
              {CURRENT_MIN_WAGE.toLocaleString("ko-KR")}원)보다 낮습니다.
            </p>
          )}
          <p className="mt-4 border-t border-border-soft pt-4 text-sm leading-relaxed text-muted">
            월급 환산은 주 40시간 기준 월 209시간(주휴 포함) 관행을 따릅니다.
            주휴수당은 1주 15시간 이상 근무하고 소정근로일을 개근했을 때 지급되며,
            주 40시간 기준 8시간분(시급×8)입니다. 4대보험·세금 공제 전 금액입니다.
          </p>
        </ResultCard>
      )}
    </section>
  );
}
