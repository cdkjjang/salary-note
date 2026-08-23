import type { Metadata } from "next";
import CalcGuides from "@/components/CalcGuides";
import Link from "next/link";
import SalaryCalculator from "@/components/SalaryCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      // 검색결과에 "사이트명 > 계산기명" 경로가 표시되도록 한다.
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "연봉 실수령액 계산기" },
        ],
      },
    ],
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
          4.75%, 건강보험 3.595%, 장기요양보험(건강보험료의 13.14%), 고용보험
          0.9%가 근로자 몫으로 공제되고, 여기에 근로소득세와 그 10%인
          지방소득세가 더해집니다. 2026년 연금개혁과 건강보험료율 인상이 반영된
          요율입니다.
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

      <CalcNotes
        updated="2026-08-02"
        basis={[
          {
            law: "국민연금법 시행령 제5조",
            detail:
              "기준소득월액은 천원 단위로 절사한 뒤 상한 637만원·하한 40만원을 적용합니다. 여기에 근로자 요율 4.75%를 곱합니다. 연금개혁으로 2026년 총 요율이 9.5%가 되었습니다.",
          },
          {
            law: "국민건강보험법 시행령 (2026년 고시)",
            detail:
              "건강보험료율 총 7.19% 중 근로자 부담은 절반인 3.595%입니다. 장기요양보험료는 건강보험료에 13.14%를 곱해 산출합니다.",
          },
          {
            law: "고용보험법 시행령 제12조",
            detail:
              "실업급여 계정의 근로자 부담분은 0.9%입니다. 고용안정·직업능력개발 부담분은 사업주만 냅니다.",
          },
          {
            law: "소득세법 제47조·제55조·제59조",
            detail:
              "총급여에서 근로소득공제를 빼 근로소득금액을 구하고, 인적공제와 보험료 공제를 빼 과세표준을 만든 뒤 기본세율(6~45%)을 적용합니다. 산출세액에서 근로소득세액공제를 빼면 결정세액이 됩니다.",
          },
        ]}
        note="이 계산기는 연간 기준으로 세액을 구한 뒤 12로 나눈 추정치입니다. 매월 급여에서 실제로 떼는 소득세는 국세청 근로소득 간이세액표를 따르므로 월별로 차이가 날 수 있고, 그 차액은 다음 해 연말정산에서 정산됩니다. 자녀·연금저축·의료비 같은 세액공제와 상여 비중은 반영하지 않았습니다."
        examples={[
          {
            title: "연봉 4,000만원 · 월 비과세 20만원 · 부양가족 본인 1명",
            steps: [
              "월 세전 급여 = 4,000만원 ÷ 12 = 3,333,333원",
              "과세대상 월급여 = 3,333,333 − 200,000(비과세) = 3,133,333원",
              "4대보험 = 국민연금 148,810 + 건강보험 112,640 + 장기요양 14,800 + 고용보험 28,190 = 304,440원",
              "총급여(연) = 4,000만원 − (20만원 × 12) = 37,600,000원",
              "근로소득공제 = 10,890,000원 → 근로소득금액 26,710,000원",
              "과세표준 = 근로소득금액 − 인적공제 150만원 − 연금·보험료 공제 = 21,556,720원",
              "산출세액 = 21,556,720 × 15% − 1,260,000 = 1,973,508원",
              "근로소득세액공제 703,200원을 빼면 결정세액 1,270,300원, 지방소득세 127,030원",
              "월 소득세 105,850 + 월 지방소득세 10,580 + 4대보험 304,440 = 월 공제 420,870원",
            ],
            result: "월 실수령액 2,912,463원 (월 세전 3,333,333원 대비 약 87%)",
          },
          {
            title: "연봉 6,000만원 · 월 비과세 20만원 · 부양가족 본인 1명",
            steps: [
              "월 세전 급여 5,000,000원, 과세대상 월급여 4,800,000원",
              "4대보험 합계 466,430원",
              "총급여 57,600,000원 → 과세표준 37,872,840원",
              "산출세액 4,420,926원 − 세액공제 660,000원 = 결정세액 3,760,920원",
              "월 소득세 313,410 + 월 지방소득세 31,340 + 4대보험 466,430 = 월 공제 811,180원",
            ],
            result: "월 실수령액 4,188,820원 (연봉이 1.5배여도 실수령은 1.44배)",
          },
        ]}
        pitfalls={[
          {
            heading: "연봉을 12로 나눈 값이 세전 월급이 아닌 경우가 있습니다",
            body:
              "계약서상 연봉에 상여가 포함돼 있으면 매달 받는 금액은 그보다 적고, 상여가 나오는 달에 몰립니다. 이 계산기는 연봉을 12등분하는 구조이므로, 상여 비중이 큰 급여체계라면 월별 실수령이 계산값과 다르게 느껴질 수 있습니다.",
          },
          {
            heading: "비과세는 4대보험까지 줄여줍니다",
            body:
              "식대 같은 비과세 항목은 소득세뿐 아니라 4대보험 부과 기준에서도 빠집니다. 그래서 같은 연봉이라도 비과세 구성이 다르면 실수령액 차이가 생깁니다. 대부분의 회사는 식대 월 20만원을 비과세로 잡습니다.",
          },
          {
            heading: "국민연금은 일정 소득을 넘으면 더 오르지 않습니다",
            body:
              "기준소득월액 상한이 637만원이라, 과세대상 월급여가 이를 넘으면 국민연금 근로자 부담이 302,570원에서 고정됩니다. 반면 건강보험은 상한이 사실상 없어 급여에 비례해 계속 늘어납니다. 고소득 구간에서 건강보험이 국민연금보다 커지는 이유입니다.",
          },
          {
            heading: "부양가족은 소득세만 줄입니다",
            body:
              "인적공제는 과세표준을 낮춰 소득세를 줄이는 것이라 4대보험에는 영향이 없습니다. 부양가족을 늘려도 4대보험료는 그대로입니다.",
          },
        ]}
        sources={[
          { label: "국민연금공단", href: "https://www.nps.or.kr" },
          { label: "국민건강보험공단", href: "https://www.nhis.or.kr" },
          { label: "국세청 홈택스", href: "https://www.hometax.go.kr" },
          { label: "고용노동부", href: "https://www.moel.go.kr" },
        ]}
      />

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
      <CalcGuides calcHref="/calc/salary" />
    </div>
  );
}
