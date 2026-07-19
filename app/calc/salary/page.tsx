import type { Metadata } from "next";
import Link from "next/link";
import SalaryCalculator from "@/components/SalaryCalculator";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기 — 4대보험·세금 떼면 월 얼마?",
  description:
    "연봉만 넣으면 국민연금·건강보험·고용보험과 근로소득세를 뗀 월 실수령액을 바로 계산합니다. 비과세액과 부양가족 수까지 반영한 2026년 기준 계산기.",
  alternates: { canonical: "/calc/salary" },
};

const faq = [
  {
    q: "연봉 5,000만원이면 실수령액이 얼마인가요?",
    a: "부양가족 본인 1명, 월 비과세(식대) 20만원 기준으로 4대보험과 근로소득세·지방소득세를 떼면 월 약 355~360만원 수준입니다. 부양가족이 많거나 비과세가 크면 세금이 줄어 실수령액이 늘어납니다.",
  },
  {
    q: "왜 매달 통장에 찍히는 금액과 조금 다른가요?",
    a: "매월 원천징수되는 소득세는 국세청 '근로소득 간이세액표'를 따릅니다. 이 계산기는 부양가족을 반영한 연간 세액을 12로 나눈 추정치라서 매월 실제 공제액과 다를 수 있고, 최종적으로는 다음 해 2월 연말정산에서 정산됩니다.",
  },
  {
    q: "비과세액은 무엇을 넣나요?",
    a: "식대(월 20만원까지), 자가운전보조금(월 20만원), 출산·보육수당(월 20만원) 등 비과세 항목의 월 합계를 넣습니다. 비과세는 4대보험과 소득세 부과 대상에서 빠지므로 실수령액이 올라갑니다. 대부분 직장인은 식대 20만원만 해당됩니다.",
  },
  {
    q: "국민연금은 연봉이 높아도 계속 오르나요?",
    a: "아닙니다. 국민연금은 기준소득월액 상한(2025.7~2026.6 기준 637만원)이 있어, 월 과세급여가 이 금액을 넘으면 근로자 부담이 약 28만 원대에서 고정됩니다. 반면 건강보험은 상한이 사실상 없어 급여에 비례해 계속 늘어납니다.",
  },
];

export default function SalaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="mb-2 text-2xl font-extrabold">연봉 실수령액 계산기</h1>
      <p className="mb-6 text-muted">
        세전 연봉에서 4대보험과 소득세를 뗀 뒤 매달 통장에 들어오는 금액이
        얼마인지, 비과세와 부양가족까지 반영해 알려드립니다.
      </p>
      <SalaryCalculator />

      <AdSlot slot="salary-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">실수령액은 왜 연봉의 100%가 아닐까</h2>
        <p>
          세전 연봉을 12로 나눈 금액이 그대로 통장에 들어오지 않는 이유는 매달
          네 가지 사회보험료와 두 가지 세금이 빠지기 때문입니다. 국민연금
          4.5%, 건강보험 3.545%, 장기요양보험(건강보험료의 12.95%), 고용보험
          0.9%가 근로자 몫으로 공제되고, 여기에 근로소득세와 그 10%인
          지방소득세가 더해집니다.
        </p>
        <p>
          이 중 4대보험은 요율이 정해져 있어 계산이 명확하지만, 소득세는
          부양가족 수·비과세액·각종 공제에 따라 사람마다 달라집니다. 그래서 같은
          연봉이라도 혼자 사는 사람과 부양가족이 여럿인 사람의 실수령액이
          다릅니다. 이 계산기는 부양가족과 비과세를 반영한 연간 세액 기준으로
          추정합니다.
        </p>
        <p>
          매월 급여명세서의 소득세는 국세청 간이세액표를 따르기 때문에 이
          계산기와 몇천 원 단위로 다를 수 있습니다. 정확한 1년치 세금은 연말정산에서
          정산되므로, 이 계산기는 &lsquo;대략 이 정도 받겠구나&rsquo;를 가늠하는
          용도로 보시면 됩니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">자주 묻는 질문</h2>
        <dl className="space-y-4">
          {faq.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-xl border border-border-soft bg-card p-4 shadow-sm"
            >
              <dt className="font-bold">
                <span className="text-accent">Q.</span> {q}
              </dt>
              <dd className="mt-2 text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li>
            <Link href="/calc/insurance" className="text-accent underline-offset-4 hover:underline">
              4대보험료 계산기 → 항목별로 얼마씩 떼는지
            </Link>
          </li>
          <li>
            <Link href="/calc/severance" className="text-accent underline-offset-4 hover:underline">
              퇴직금 계산기 → 퇴사 전 미리 확인
            </Link>
          </li>
          <li>
            <Link href="/guide/salary-net-explained" className="text-accent underline-offset-4 hover:underline">
              실수령액 완전정복 가이드 →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
