import type { Metadata } from "next";
import Link from "next/link";
import InsuranceCalculator from "@/components/InsuranceCalculator";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "4대보험 계산기 — 월급에서 얼마 떼나요?",
  description:
    "월 급여를 넣으면 국민연금·건강보험·장기요양·고용보험 근로자 부담액을 항목별로 계산합니다. 2026년 요율, 국민연금 상한 반영.",
  alternates: { canonical: "/calc/insurance" },
};

const faq = [
  {
    q: "4대보험 요율은 얼마인가요? (2026년)",
    a: "근로자 부담 기준으로 국민연금 4.5%, 건강보험 3.545%, 장기요양보험은 건강보험료의 12.95%, 고용보험(실업급여) 0.9%입니다. 회사도 비슷한 금액을 함께 부담해, 실제 사회보험료의 절반가량만 근로자가 냅니다.",
  },
  {
    q: "회사(사업주)는 얼마를 부담하나요?",
    a: "국민연금 4.5%, 건강보험·장기요양은 근로자와 같은 금액, 고용보험은 0.9%에 회사 규모별 고용안정·직업능력개발 부담(0.25~0.85%)이 더해집니다. 산재보험은 전액 회사 부담이라 근로자 급여에서는 빠지지 않습니다.",
  },
  {
    q: "국민연금은 상한이 있다는데요?",
    a: "네. 국민연금은 기준소득월액 상한(2025.7~2026.6 기준 637만원)과 하한(40만원)이 있습니다. 월 과세급여가 637만원을 넘어도 그 이상은 보험료가 붙지 않아 근로자 부담이 약 28만 원대에서 고정됩니다. 상·하한은 매년 7월 조정됩니다.",
  },
];

export default function InsurancePage() {
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
      <h1 className="mb-2 text-2xl font-extrabold">4대보험 계산기</h1>
      <p className="mb-6 text-muted">
        월 급여를 넣으면 국민연금·건강보험·장기요양·고용보험을 항목별로 얼마씩
        떼는지 계산합니다.
      </p>
      <InsuranceCalculator />

      <AdSlot slot="insurance-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">4대보험, 무엇을 위한 돈인가요</h2>
        <p>
          4대보험은 국민연금·건강보험·고용보험·산재보험을 말합니다. 장기요양보험은
          건강보험에 얹혀 함께 걷히므로 급여명세서에는 다섯 줄로 보이기도 합니다.
          국민연금은 노후 연금, 건강보험은 병원비, 장기요양은 노인 돌봄, 고용보험은
          실업급여와 육아휴직급여의 재원이 됩니다.
        </p>
        <p>
          이 가운데 산재보험은 전액 회사가 부담해 근로자 급여에서는 빠지지
          않습니다. 그래서 급여에서 실제로 공제되는 것은 국민연금·건강보험·
          장기요양·고용보험 네 가지입니다. 이 계산기는 근로자 부담분만 보여줍니다.
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
            <Link href="/calc/salary" className="text-accent underline-offset-4 hover:underline">
              연봉 실수령액 계산기 → 세금까지 포함해 월 실수령
            </Link>
          </li>
          <li>
            <Link href="/guide/four-insurance-explained" className="text-accent underline-offset-4 hover:underline">
              4대보험 요율 총정리 가이드 →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
