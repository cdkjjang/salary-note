import type { Metadata } from "next";
import Link from "next/link";
import SeveranceCalculator from "@/components/SeveranceCalculator";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "퇴직금 계산기 — 입사·퇴사일과 월급으로 바로 계산",
  description:
    "입사일·퇴사일과 퇴직 전 3개월 평균 월급을 넣으면 근로자퇴직급여 보장법 기준 법정 퇴직금을 계산합니다. 상여금 반영, 재직일수·평균임금까지 표시.",
  alternates: { canonical: "/calc/severance" },
};

const faq = [
  {
    q: "퇴직금은 어떻게 계산하나요?",
    a: "법정 퇴직금은 [1일 평균임금 × 30일 × 재직일수 ÷ 365]로 계산합니다. 대략 1년 근무할 때마다 한 달치 월급이 쌓인다고 보면 됩니다. 1일 평균임금은 퇴직 전 3개월 임금총액을 그 기간의 총일수로 나눈 값입니다.",
  },
  {
    q: "상여금도 퇴직금에 포함되나요?",
    a: "네. 정기 상여금과 연차수당은 평균임금에 포함됩니다. 최근 1년치 상여금의 3/12(3개월분)을 퇴직 전 3개월 임금에 더해 평균임금을 높입니다. 그래서 상여금이 있으면 퇴직금이 늘어납니다.",
  },
  {
    q: "1년 미만 일해도 퇴직금을 받나요?",
    a: "법정 퇴직금은 계속근로기간이 1년 이상이고 4주 평균 주 15시간 이상 근무한 경우에 발생합니다. 1년 미만이면 법정 퇴직금 대상이 아닙니다. 다만 회사 규정상 별도 지급하는 경우는 있습니다.",
  },
  {
    q: "퇴직금에도 세금이 붙나요?",
    a: "네, 퇴직소득세가 부과됩니다. 다만 근속연수공제 등으로 일반 소득세보다 세율이 낮게 설계되어 있어, 근속이 길수록 세 부담이 줄어듭니다. 이 계산기의 금액은 세전 기준입니다.",
  },
];

export default function SeverancePage() {
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
      <h1 className="mb-2 text-2xl font-extrabold">퇴직금 계산기</h1>
      <p className="mb-6 text-muted">
        입사일·퇴사일과 퇴직 전 3개월 평균 월급만 넣으면 법정 퇴직금을 바로
        계산합니다. 상여금이 있으면 함께 반영하세요.
      </p>
      <SeveranceCalculator />

      <AdSlot slot="severance-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">퇴직금, 이렇게 쌓입니다</h2>
        <p>
          근로자퇴직급여 보장법은 1년 이상 일한 근로자에게 퇴직 시 퇴직급여를
          지급하도록 정합니다. 금액은 1일 평균임금에 30을 곱하고, 재직일수를
          365로 나눈 값을 곱해 계산합니다. 쉽게 말해 1년 일하면 한 달치 평균임금이
          쌓이는 구조입니다.
        </p>
        <p>
          핵심은 &lsquo;평균임금&rsquo;입니다. 기본급뿐 아니라 퇴직 전 3개월간
          받은 각종 수당과, 정기 상여금·연차수당의 3개월분이 포함됩니다. 그래서
          퇴직 직전 3개월에 상여가 몰려 있으면 퇴직금이 커집니다. 반대로 평균임금이
          평소 통상임금보다 낮게 계산되면 통상임금으로 대체합니다.
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
              연봉 실수령액 계산기 →
            </Link>
          </li>
          <li>
            <Link href="/guide/severance-guide" className="text-accent underline-offset-4 hover:underline">
              퇴직금 지급 기준·지급일 가이드 →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
