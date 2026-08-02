"use client";

import { useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import { formatWon } from "@/lib/date";
import { RATES, employeeInsurance } from "@/lib/insurance";

// 요율 표기는 반드시 RATES에서 뽑아 쓴다. 하드코딩하면 엔진을 갱신했을 때
// 화면 설명만 옛 값으로 남아 서로 어긋난다(2026년 요율 인상 때 실제로 발생).
const pct = (v: number) => `${+(v * 100).toFixed(3)}%`;
const PENSION_PCT = pct(RATES.pension);
const HEALTH_PCT = pct(RATES.health);
const CARE_PCT = pct(RATES.longTermCareOfHealth);
const EMPLOYMENT_PCT = pct(RATES.employment);
const PENSION_MAX_MAN = (RATES.pensionBaseMax / 10_000).toLocaleString("ko-KR");

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
              <dt>국민연금 ({PENSION_PCT})</dt>
              <dd className="font-bold">{formatWon(r.pension)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>건강보험 ({HEALTH_PCT})</dt>
              <dd className="font-bold">{formatWon(r.health)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>장기요양 (건강보험료의 {CARE_PCT})</dt>
              <dd className="font-bold">{formatWon(r.longTermCare)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>고용보험 ({EMPLOYMENT_PCT})</dt>
              <dd className="font-bold">{formatWon(r.employment)}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-border-soft pt-4 text-sm leading-relaxed text-muted">
            회사(사업주)도 국민연금 {PENSION_PCT}, 건강·장기요양 근로자와 동일액,
            고용보험 {EMPLOYMENT_PCT}+@를 부담합니다. 국민연금은 기준소득월액
            상한({PENSION_MAX_MAN}만원)이 있어 고소득자는 일정액에서 고정됩니다.
            기관별 절사 방식에 따라 실제 고지액과 수십 원 차이가 날 수 있습니다.
          </p>
        </ResultCard>
      )}
    </section>
  );
}
