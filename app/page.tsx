import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import HomeNotes from "@/components/HomeNotes";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const TOOLS = [
  {
    href: "/calc/salary",
    title: "연봉 실수령액 계산기",
    desc: "4대보험·세금 떼면 월 얼마? 비과세·부양가족까지 반영",
    badge: "실수령",
  },
  {
    href: "/calc/severance",
    title: "퇴직금 계산기",
    desc: "입사·퇴사일과 월급으로 법정 퇴직금 바로 계산",
    badge: "퇴직금",
  },
  {
    href: "/calc/hourly",
    title: "시급·주휴수당 계산기",
    desc: "최저임금 기준 월급 환산, 주휴수당 포함·미달 경고",
    badge: "시급",
  },
  {
    href: "/calc/insurance",
    title: "4대보험 계산기",
    desc: "국민연금·건강·장기요양·고용, 항목별로 얼마씩",
    badge: "4대보험",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-6 text-center sm:py-10">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          내 월급, 실제로
          <br className="sm:hidden" /> 얼마 받는 걸까
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          연봉에서 4대보험과 세금을 뗀 월 실수령액부터 퇴직금·주휴수당까지, 내
          급여와 관련된 계산을 한곳에서 30초 안에 끝내세요.
        </p>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md"
          >
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent-strong">
              {tool.badge}
            </span>
            <h2 className="mt-3 text-lg font-bold leading-snug">{tool.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {tool.desc}
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">급여 가이드</h2>
          <Link href="/guide" className="text-sm text-accent hover:underline">
            전체 보기 →
          </Link>
        </div>
        <ul className="space-y-3">
          {guides.slice(0, 5).map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guide/${g.slug}`}
                className="block rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent"
              >
                <p className="font-bold leading-snug">{g.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {g.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">
          급여 계산은 &lsquo;내가 직접 확인&rsquo;이 답입니다
        </h2>
        <p>
          연봉 협상, 이직 비교, 아르바이트 시급, 퇴사 준비 — 돈이 걸린 순간마다
          &lsquo;실제로 얼마&rsquo;가 궁금해집니다. 하지만 4대보험과 세금 구조는
          복잡하고, 회사가 알아서 계산해 주니 정작 본인은 근거를 모른 채 넘어가기
          쉽습니다.
        </p>
        <p>
          {SITE_NAME}는 국민연금법·소득세법·근로기준법 등 공개된 기준으로 만든
          계산기를 제공합니다. 연봉에서 실수령액이 어떻게 나오는지, 퇴직금은 어떻게
          쌓이는지, 최저임금과 주휴수당은 얼마인지 직접 확인하세요. 회원가입도,
          개인정보 입력도 없습니다. 입력한 숫자는 브라우저 안에서만 계산되고 서버로
          전송되지 않습니다.
        </p>
      </section>
      <HomeNotes
        siteName={SITE_NAME}
        updated="2026-08-02"
        intro="급여는 평소에 신경 쓰지 않다가 특정 순간에 갑자기 정확한 숫자가 필요해집니다. 아래 네 가지가 그런 순간입니다."
        scenarios={[
          {
            situation: "이직 제안을 받아 연봉을 비교할 때",
            action:
              "제시받은 연봉을 12로 나눈 금액이 통장에 들어오는 것이 아닙니다. 4대보험과 소득세를 뗀 실수령액으로 비교해야 실제 차이가 보입니다. 비과세 구성에 따라 같은 연봉도 실수령이 달라집니다.",
            href: "/calc/salary",
            label: "연봉 실수령액 계산하기",
          },
          {
            situation: "퇴사를 앞두고 퇴직금이 얼마인지 알고 싶을 때",
            action:
              "계속근로기간 1년이 절대 요건이라 며칠 차이로 못 받을 수 있습니다. 상여금과 연차수당도 평균임금에 반영되므로 빠뜨리면 금액이 크게 달라집니다.",
            href: "/calc/severance",
            label: "퇴직금 계산하기",
          },
          {
            situation: "아르바이트 시급이 최저임금에 맞는지 확인할 때",
            action:
              "주 15시간 이상 일하면 주휴수당이 붙습니다. 주휴수당을 빼고 시급만 최저임금에 맞추면 실질 시급이 미달이 되는 경우가 많습니다.",
            href: "/calc/hourly",
            label: "시급·주휴수당 계산하기",
          },
          {
            situation: "급여명세서의 공제 항목이 맞는지 검산할 때",
            action:
              "국민연금·건강보험·장기요양·고용보험이 각각 얼마씩 빠지는지 항목별로 확인할 수 있습니다. 국민연금은 상한이 있어 일정 소득을 넘으면 더 오르지 않습니다.",
            href: "/calc/insurance",
            label: "4대보험료 계산하기",
          },
        ]}
        faq={[
          {
            q: "계산 결과가 실제 급여명세서와 몇천 원 다릅니다.",
            a: "정상입니다. 매달 떼는 소득세는 국세청 근로소득 간이세액표를 따르는 임시 금액이고, 이 계산기는 부양가족과 비과세를 반영한 연간 기준 추정치입니다. 1년치 차액은 다음 해 연말정산에서 정산됩니다.",
          },
          {
            q: "2026년에 실수령액이 줄었다는데 왜 그런가요?",
            a: "연금개혁으로 국민연금 요율이 총 9%에서 9.5%(근로자 4.75%)로 올랐고, 건강보험료율도 7.09%에서 7.19%로 인상되었습니다. 장기요양보험료율도 함께 올라 공제액이 늘었습니다.",
          },
          {
            q: "입력한 연봉 정보가 저장되나요?",
            a: "저장되지 않습니다. 모든 계산은 이용자의 브라우저 안에서 이루어지며 입력값이 서버로 전송되지 않습니다. 회원가입이나 로그인도 없습니다.",
          },
          {
            q: "세무·노무 상담을 받을 수 있나요?",
            a: "개별 사안에 대한 자문은 제공하지 않습니다. 이곳의 계산은 공개된 법령 기준을 정리한 참고용 추정치이며, 구체적인 판단이 필요하면 세무사·노무사나 고용노동부에 문의하세요.",
          },
        ]}
        maintained={[
          "국민연금 요율과 기준소득월액 상·하한 (상·하한은 매년 7월 조정)",
          "건강보험료율과 장기요양보험료율 (매년 초 고시)",
          "최저임금 (매년 8월 고시, 다음 해 1월 적용)",
          "소득세 기본세율과 근로소득공제·근로소득세액공제 (소득세법 개정 시)",
        ]}
      />

      <AdSlot slot="home-bottom" />
    </div>
  );
}
