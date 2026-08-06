import type { Metadata } from "next";
import Link from "next/link";
import SeveranceCalculator from "@/components/SeveranceCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";

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

      <CalcNotes
        updated="2026-08-02"
        basis={[
          {
            law: "근로자퇴직급여 보장법 제8조",
            detail:
              "법정 퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365). 계속근로기간이 1년 이상이고 4주 평균 주 15시간 이상 근무한 근로자가 대상입니다.",
          },
          {
            law: "근로기준법 제2조 제1항 제6호",
            detail:
              "평균임금은 산정 사유가 발생한 날 이전 3개월 동안 지급된 임금총액을 그 기간의 총일수로 나눈 금액입니다. 3개월의 실제 일수(89~92일)로 나누므로 퇴사 시기에 따라 값이 조금 달라집니다.",
          },
          {
            law: "근로기준법 시행령 제2조",
            detail:
              "상여금과 연차수당은 연간 지급액의 3/12에 해당하는 금액을 3개월 임금총액에 더합니다. 1년치를 3개월분으로 환산해 반영하는 것입니다.",
          },
          {
            law: "근로기준법 제2조 제2항",
            detail:
              "산출한 평균임금이 통상임금보다 적으면 통상임금을 평균임금으로 봅니다. 이 계산기는 이 비교를 자동으로 하지 않으므로, 결과가 통상임금 기준보다 낮다면 통상임금으로 다시 확인하세요.",
          },
        ]}
        note="퇴직금은 세전 금액입니다. 실제 수령액은 퇴직소득세와 지방소득세를 뗀 뒤의 금액이며, 근속연수공제가 적용되어 근속이 길수록 세부담이 낮아지는 구조입니다."
        examples={[
          {
            title: "2023년 3월 1일 입사 → 2026년 3월 1일 퇴사 · 월급 300만원 · 상여 없음",
            steps: [
              "재직일수 = 2023-03-01부터 2026-03-01까지 1,096일 (2024년 윤년 포함)",
              "평균임금 산정 기간 = 퇴직일 직전 3개월(2025-12-01 ~ 2026-03-01) = 90일",
              "3개월 임금총액 = 300만원 × 3 = 9,000,000원",
              "1일 평균임금 = 9,000,000 ÷ 90 = 100,000원",
              "퇴직금 = 100,000 × 30 × (1,096 ÷ 365) = 100,000 × 30 × 3.0027",
            ],
            result: "퇴직금 9,008,219원 (세전)",
          },
          {
            title: "같은 조건에 최근 1년 상여금 400만원이 있는 경우",
            steps: [
              "상여 반영분 = 400만원 × 3/12 = 1,000,000원",
              "3개월 임금총액 = 9,000,000 + 1,000,000 = 10,000,000원",
              "1일 평균임금 = 10,000,000 ÷ 90 = 111,111원",
              "퇴직금 = 111,111 × 30 × 3.0027",
            ],
            result: "퇴직금 10,009,132원 — 상여를 빠뜨리면 100만원가량 적게 계산됩니다",
          },
        ]}
        pitfalls={[
          {
            heading: "1년에서 며칠 모자라면 아예 못 받습니다",
            body:
              "계속근로기간 1년은 절대 요건입니다. 364일 근무하고 퇴사하면 퇴직금이 발생하지 않습니다. 퇴사일을 조정할 여지가 있다면 입사일 기준으로 1년이 지났는지 먼저 확인하세요.",
          },
          {
            heading: "상여금과 연차수당을 빼먹는 경우가 가장 많습니다",
            body:
              "회사가 계산해 준 금액이 예상보다 적다면 상여와 연차수당이 평균임금에 반영됐는지 확인해 보세요. 연간 지급액의 3/12을 3개월 임금총액에 더해야 합니다.",
          },
          {
            heading: "퇴직 직전 3개월에 무급휴직이 있으면 불리해집니다",
            body:
              "평균임금은 직전 3개월 임금을 그 기간 일수로 나누므로, 그 기간에 결근이나 무급휴직이 있으면 평균임금이 낮아집니다. 다만 법령이 정한 일부 기간(업무상 부상, 육아휴직 등)은 산정 기간에서 제외되므로 해당된다면 확인이 필요합니다.",
          },
          {
            heading: "지급 기한은 퇴직일로부터 14일입니다",
            body:
              "당사자 합의로 연장할 수는 있지만, 합의 없이 기한이 지나면 지연이자가 발생할 수 있습니다. 지급되지 않으면 고용노동부에 진정을 제기할 수 있고, 임금 채권의 소멸시효는 3년입니다.",
          },
        ]}
        sources={[
          { label: "고용노동부", href: "https://www.moel.go.kr" },
          { label: "고용노동부 퇴직금 계산기", href: "https://labor.moel.go.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
        ]}
      />

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
