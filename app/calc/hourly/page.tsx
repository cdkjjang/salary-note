import type { Metadata } from "next";
import Link from "next/link";
import HourlyCalculator from "@/components/HourlyCalculator";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "시급·주휴수당 계산기 — 최저임금 기준 월급 환산",
  description:
    "시급과 주 근로시간을 넣으면 주휴수당을 포함한 주급·월급을 계산하고 2026년 최저임금(10,320원) 미달 여부까지 확인합니다.",
  alternates: { canonical: "/calc/hourly" },
};

const faq = [
  {
    q: "2026년 최저임금은 얼마인가요?",
    a: "2026년 최저시급은 10,320원입니다(2025년 10,030원 대비 2.9% 인상). 주 40시간·월 209시간 기준 월 환산액은 약 215만 7천 원입니다. 최저임금은 업종·나이와 무관하게 모든 사업장에 동일하게 적용됩니다.",
  },
  {
    q: "주휴수당은 누가 받나요?",
    a: "1주 소정근로시간이 15시간 이상이고 그 주의 소정근로일을 개근한 근로자는 주휴수당을 받습니다. 주 40시간 기준으로는 8시간분(시급×8)이 유급휴일 수당으로 더해집니다. 아르바이트·단시간 근로자도 조건을 채우면 받습니다.",
  },
  {
    q: "월 209시간은 어떻게 나온 숫자인가요?",
    a: "주 40시간을 일하면 여기에 주휴 8시간이 더해져 1주 48시간이 유급입니다. 한 달 평균 주 수(약 4.345주)를 곱하면 약 209시간이 됩니다. 그래서 '시급 × 209'가 주휴를 포함한 월급 환산의 관행적 기준입니다.",
  },
];

export default function HourlyPage() {
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
      <h1 className="mb-2 text-2xl font-extrabold">시급·주휴수당 계산기</h1>
      <p className="mb-6 text-muted">
        시급과 주 근로시간을 넣으면 주휴수당을 포함한 주급과 월급 환산액을
        계산하고, 최저임금 미달인지 확인해 드립니다.
      </p>
      <HourlyCalculator />

      <AdSlot slot="hourly-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">시급을 월급으로 바꿔보면</h2>
        <p>
          아르바이트나 단시간 근로의 급여는 시급으로 정해지지만, 실제로 받는
          돈에는 &lsquo;주휴수당&rsquo;이 숨어 있습니다. 1주에 15시간 이상 일하고
          약속한 근로일을 모두 채우면, 일하지 않은 하루치(주 40시간 기준 8시간)를
          유급으로 더 받습니다. 이걸 빼고 시급만 곱하면 실제 급여를 과소평가하게
          됩니다.
        </p>
        <p>
          2026년 최저시급은 10,320원입니다. 주 40시간을 꽉 채워 일하면 주휴를
          포함해 월 약 215만 7천 원이 됩니다. 이 계산기는 입력한 시급이 최저임금에
          못 미치면 경고를 표시하니, 근로계약서의 시급이 적정한지 확인하는
          용도로도 쓸 수 있습니다.
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
              연봉 실수령액 계산기 → 4대보험·세금 떼면 얼마
            </Link>
          </li>
          <li>
            <Link href="/guide/minimum-wage-2026" className="text-accent underline-offset-4 hover:underline">
              2026년 최저임금·주휴수당 가이드 →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
