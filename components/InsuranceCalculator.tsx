"use client";

import { useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import { formatWon } from "@/lib/date";
import { employeeInsurance } from "@/lib/insurance";

export default function InsuranceCalculator() {
  const [pay, setPay] = useState(""); // 만원 단위 월급

  const payMan = parseMoney(pay);
  const ready = payMan !== null && payMan > 0;
  const monthlyPay = ready ? payMan * 10_000 : 0;
  const r = ready ? employeeInsurance(monthlyPay) : null;

  return (
    <section className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <MoneyField
        label="월 급여 (과세대상, 세전)"
        hint="비과세 제외, 만원 단위"
        unit="만원"
        value={pay}
        onChange={setPay}
        placeholder="예: 300"
      />

      {!ready && (
        <p className="text-sm text-muted">월 급여를 입력하면 바로 계산됩니다.</p>
      )}

      {r && (
        <ResultCard title="근로자 부담 4대보험 (월)">
          <p className="text-2xl font-extrabold text-accent-strong">
            월 {formatWon(r.total)}
          </p>
          <dl className="mt-3 space-y-1.5 text-[15px]">
            <div className="flex justify-between">
              <dt>국민연금 (4.5%)</dt>
              <dd className="font-bold">{formatWon(r.pension)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>건강보험 (3.545%)</dt>
              <dd className="font-bold">{formatWon(r.health)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>장기요양 (건강보험료의 12.95%)</dt>
              <dd className="font-bold">{formatWon(r.longTermCare)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>고용보험 (0.9%)</dt>
              <dd className="font-bold">{formatWon(r.employment)}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-border-soft pt-4 text-sm leading-relaxed text-muted">
            회사(사업주)도 국민연금 4.5%, 건강·장기요양 근로자와 동일액, 고용보험
            0.9%+@를 부담합니다. 국민연금은 기준소득월액 상한(2025.7~2026.6 기준
            637만원)이 있어 고소득자는 일정액에서 고정됩니다. 기관별 절사 방식에
            따라 실제 고지액과 수십 원 차이가 날 수 있습니다.
          </p>
        </ResultCard>
      )}
    </section>
  );
}
