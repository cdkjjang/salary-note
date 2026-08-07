import type { Metadata } from "next";
import Link from "next/link";
import InsuranceCalculator from "@/components/InsuranceCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "4대보험 계산기 — 월급에서 얼마 떼나요?",
  description:
    "월 급여를 넣으면 국민연금·건강보험·장기요양·고용보험 근로자 부담액을 항목별로 계산합니다. 2026년 요율, 국민연금 상한 반영.",
  alternates: { canonical: "/calc/insurance" },
};

const faq = [
  {
    q: "4대보험 요율은 얼마인가요? (2026년)",
    a: "근로자 부담 기준으로 국민연금 4.75%, 건강보험 3.595%, 장기요양보험은 건강보험료의 13.14%, 고용보험(실업급여) 0.9%입니다. 회사도 비슷한 금액을 함께 부담해, 실제 사회보험료의 절반가량만 근로자가 냅니다. 국민연금은 연금개혁에 따라 2026년 9.5%(근로자 4.75%)로 인상되었습니다.",
  },
  {
    q: "회사(사업주)는 얼마를 부담하나요?",
    a: "국민연금 4.75%, 건강보험·장기요양은 근로자와 같은 금액, 고용보험은 0.9%에 회사 규모별 고용안정·직업능력개발 부담(0.25~0.85%)이 더해집니다. 산재보험은 전액 회사 부담이라 근로자 급여에서는 빠지지 않습니다.",
  },
  {
    q: "국민연금은 상한이 있다는데요?",
    a: "네. 국민연금은 기준소득월액 상한(2025.7~2026.6 기준 637만원)과 하한(40만원)이 있습니다. 월 과세급여가 637만원을 넘어도 그 이상은 보험료가 붙지 않아 근로자 부담이 약 28만 원대에서 고정됩니다. 상·하한은 매년 7월 조정됩니다.",
  },
];

export default function InsurancePage() {
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
          { "@type": "ListItem", position: 2, name: "4대보험 계산기" },
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

      <CalcNotes
        updated="2026-08-02"
        basis={[
          {
            law: "국민연금법 제88조·시행령 제5조",
            detail:
              "기준소득월액을 천원 단위로 절사한 뒤 상한 637만원·하한 40만원을 적용하고 요율을 곱합니다. 2026년 총 요율은 연금개혁으로 9.5%가 되어 근로자 부담은 4.75%입니다.",
          },
          {
            law: "국민건강보험법 제73조 (2026년 보험료율 고시)",
            detail:
              "건강보험료율 총 7.19%를 근로자와 사업주가 절반씩 부담하므로 근로자 부담은 3.595%입니다. 건강보험은 국민연금과 달리 소득 상한이 사실상 없습니다.",
          },
          {
            law: "노인장기요양보험법 제9조",
            detail:
              "장기요양보험료는 급여가 아니라 건강보험료를 기준으로 산출합니다. 2026년 요율은 건강보험료의 13.14%입니다.",
          },
          {
            law: "고용보험법 시행령 제12조",
            detail:
              "실업급여 계정 근로자 부담분은 0.9%입니다. 고용안정·직업능력개발사업 부담분(0.25~0.85%)과 산재보험료는 전액 사업주가 냅니다.",
          },
        ]}
        note="기관마다 원 단위 절사 방식이 달라 실제 고지액과 수십 원 차이가 날 수 있습니다. 이 계산기는 네 항목 모두 10원 미만 절사로 통일했습니다."
        examples={[
          {
            title: "과세대상 월급여 300만원",
            steps: [
              "국민연금 = 3,000,000 × 4.75% = 142,500원 (상한 미만이라 그대로 적용)",
              "건강보험 = 3,000,000 × 3.595% = 107,850원",
              "장기요양 = 107,850 × 13.14% = 14,170원",
              "고용보험 = 3,000,000 × 0.9% = 27,000원",
            ],
            result: "근로자 부담 합계 291,520원 (월급의 약 9.7%)",
          },
          {
            title: "과세대상 월급여 700만원 — 국민연금 상한이 걸리는 구간",
            steps: [
              "기준소득월액 = 7,000,000이지만 상한 6,370,000원이 적용됩니다",
              "국민연금 = 6,370,000 × 4.75% = 302,570원 (여기서 고정)",
              "건강보험 = 7,000,000 × 3.595% = 251,650원 (상한 없이 계속 증가)",
              "장기요양 = 251,650 × 13.14% = 33,060원",
              "고용보험 = 7,000,000 × 0.9% = 63,000원",
            ],
            result: "합계 650,280원 — 건강보험이 국민연금보다 커지는 지점입니다",
          },
        ]}
        pitfalls={[
          {
            heading: "비과세 급여는 부과 대상에서 빠집니다",
            body:
              "식대처럼 비과세로 처리되는 금액은 4대보험 산정 기준에서도 제외됩니다. 계산할 때는 세전 총급여가 아니라 비과세를 뺀 과세대상 급여를 넣어야 합니다.",
          },
          {
            heading: "보수총액 신고 후 정산이 있습니다",
            body:
              "건강보험은 전년도 보수를 기준으로 부과했다가 실제 소득이 확정되면 정산합니다. 그래서 4월 무렵 정산분이 한꺼번에 부과되거나 환급되는 일이 생깁니다. 매달 떼는 금액이 갑자기 달라졌다면 이 정산일 수 있습니다.",
          },
          {
            heading: "국민연금 상·하한은 매년 7월에 바뀝니다",
            body:
              "전체 가입자 평균소득 변동에 맞춰 조정되므로, 상한 근처의 소득이라면 7월에 보험료가 달라집니다. 이 계산기는 현재 적용 중인 상·하한을 반영하고 있습니다.",
          },
          {
            heading: "퇴사하면 지역가입자로 바뀝니다",
            body:
              "직장가입자 자격을 잃으면 소득뿐 아니라 재산까지 반영하는 지역가입자 보험료가 부과되어 부담이 커질 수 있습니다. 임의계속가입 제도나 가족의 피부양자 등록을 검토할 수 있고, 신청 기한이 있으니 퇴사 직후 확인하세요.",
          },
        ]}
        sources={[
          { label: "국민연금공단", href: "https://www.nps.or.kr" },
          { label: "국민건강보험공단", href: "https://www.nhis.or.kr" },
          { label: "근로복지공단", href: "https://www.comwel.or.kr" },
          { label: "4대사회보험 정보연계센터", href: "https://www.4insure.or.kr" },
        ]}
      />

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
