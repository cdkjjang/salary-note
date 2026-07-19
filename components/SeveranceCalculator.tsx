"use client";

import { useState } from "react";
import { DateField, MoneyField, ResultCard, parseMoney } from "./fields";
import { formatWon } from "@/lib/date";
import { calcSeverance } from "@/lib/severance";

export default function SeveranceCalculator() {
  const [join, setJoin] = useState("");
  const [leave, setLeave] = useState("");
  const [wage, setWage] = useState(""); // 만원
  const [bonus, setBonus] = useState(""); // 만원

  const wageMan = parseMoney(wage);
  const bonusMan = parseMoney(bonus);
  const ready = join !== "" && leave !== "" && wageMan !== null && wageMan > 0;

  const outcome = ready
    ? calcSeverance({
        joinDate: join,
        leaveDate: leave,
        monthlyWage: wageMan * 10_000,
        annualBonus: (bonusMan ?? 0) * 10_000,
      })
    : null;

  return (
    <section className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        <DateField label="입사일" value={join} onChange={setJoin} />
        <DateField label="퇴사일" value={leave} onChange={setLeave} />
      </div>
      <MoneyField
        label="퇴직 전 3개월 평균 월급"
        hint="세전, 상여 제외, 만원 단위"
        unit="만원"
        value={wage}
        onChange={setWage}
        placeholder="예: 300"
      />
      <MoneyField
        label="최근 1년 상여금 (선택)"
        hint="정기 상여·성과급 총액"
        unit="만원"
        value={bonus}
        onChange={setBonus}
        placeholder="예: 600"
      />

      {!ready && (
        <p className="text-sm text-muted">
          입사일·퇴사일·월급을 입력하면 바로 계산됩니다.
        </p>
      )}

      {outcome && outcome.ok && (
        <ResultCard title="예상 법정 퇴직금 (세전)">
          <p className="text-3xl font-extrabold text-accent-strong">
            {formatWon(outcome.result.severancePay)}
          </p>
          <dl className="mt-3 space-y-1.5 text-[15px]">
            <div className="flex justify-between">
              <dt>재직일수</dt>
              <dd className="font-bold">
                {outcome.result.serviceDays.toLocaleString("ko-KR")}일 (약{" "}
                {outcome.result.serviceYears.toFixed(1)}년)
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>1일 평균임금</dt>
              <dd className="font-bold">{formatWon(outcome.result.avgDailyWage)}</dd>
            </div>
          </dl>
          {!outcome.result.eligible && (
            <p className="mt-3 rounded-lg bg-accent/10 p-3 text-sm text-accent-strong">
              계속근로기간이 1년 미만이라 법정 퇴직금 지급 대상이 아닐 수
              있습니다 (위 금액은 참고용 환산치).
            </p>
          )}
          <p className="mt-4 border-t border-border-soft pt-4 text-sm leading-relaxed text-muted">
            퇴직금은 [1일 평균임금 × 30 × 재직일수/365]로 계산합니다. 평균임금은
            퇴직 전 3개월 임금에 상여·연차수당의 3/12을 더해 산정합니다. 평균임금이
            통상임금보다 적으면 통상임금으로 계산하며, 퇴직소득세가 별도로 공제됩니다.
          </p>
        </ResultCard>
      )}
    </section>
  );
}
