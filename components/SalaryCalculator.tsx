"use client";

import { useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import { formatWon } from "@/lib/date";
import { calcSalary } from "@/lib/salary";

const DEP_OPTIONS = [1, 2, 3, 4, 5, 6];

const selectClass =
  "w-full rounded-xl border border-border-soft bg-card px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-accent";

export default function SalaryCalculator() {
  const [salary, setSalary] = useState(""); // 만원 단위
  const [nonTax, setNonTax] = useState("20"); // 월 비과세(만원), 기본 식대 20만
  const [dependents, setDependents] = useState("1");

  const salaryMan = parseMoney(salary);
  const nonTaxMan = parseMoney(nonTax);
  const ready = salaryMan !== null && salaryMan > 0;

  const outcome = ready
    ? calcSalary({
        annualSalary: salaryMan * 10_000,
        monthlyNonTax: (nonTaxMan ?? 0) * 10_000,
        dependents: Number(dependents),
      })
    : null;

  return (
    <section className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <MoneyField
        label="연봉 (세전)"
        hint="계약서상 연봉, 만원 단위"
        unit="만원"
        value={salary}
        onChange={setSalary}
        placeholder="예: 5000"
      />
      <div className="mb-5 grid grid-cols-2 gap-3">
        <MoneyField
          label="월 비과세액"
          hint="식대 등"
          unit="만원"
          value={nonTax}
          onChange={setNonTax}
          placeholder="20"
        />
        <label className="mb-5 block">
          <span className="mb-1.5 block font-bold">
            부양가족 수
            <span className="ml-2 text-xs font-normal text-muted">본인 포함</span>
          </span>
          <select
            className={selectClass}
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
          >
            {DEP_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}명
              </option>
            ))}
          </select>
        </label>
      </div>

      {!ready && (
        <p className="text-sm text-muted">연봉을 입력하면 바로 계산됩니다.</p>
      )}

      {outcome && outcome.ok && (
        <ResultCard title="월 실수령액 (세전 급여에서 공제 후)">
          <p className="text-3xl font-extrabold text-accent-strong">
            월 {formatWon(outcome.result.monthlyNet)}
          </p>
          <p className="mt-1 text-sm text-muted">
            연 실수령 {formatWon(outcome.result.annualNet)} · 세전 월{" "}
            {formatWon(outcome.result.monthlyGross)}
          </p>

          <dl className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-[15px]">
            <p className="mb-1 text-sm font-bold text-accent-strong">
              월 공제 내역 −{formatWon(outcome.result.monthlyDeduction)}
            </p>
            <div className="flex justify-between">
              <dt>국민연금</dt>
              <dd className="font-bold">{formatWon(outcome.result.insurance.pension)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>건강보험</dt>
              <dd className="font-bold">{formatWon(outcome.result.insurance.health)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>장기요양보험</dt>
              <dd className="font-bold">
                {formatWon(outcome.result.insurance.longTermCare)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>고용보험</dt>
              <dd className="font-bold">{formatWon(outcome.result.insurance.employment)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>근로소득세</dt>
              <dd className="font-bold">{formatWon(outcome.result.monthlyIncomeTax)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>지방소득세</dt>
              <dd className="font-bold">{formatWon(outcome.result.monthlyLocalTax)}</dd>
            </div>
          </dl>

          <p className="mt-4 border-t border-border-soft pt-4 text-sm leading-relaxed text-muted">
            소득세는 부양가족 수를 반영한 연간 기준 추정치입니다. 매월 실제
            원천징수는 근로소득 간이세액표를 따르며, 자녀·연금저축·의료비 등
            세액공제와 상여 비중에 따라 달라져 연말정산에서 최종 정산됩니다.
          </p>
        </ResultCard>
      )}
    </section>
  );
}
