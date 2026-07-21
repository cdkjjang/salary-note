import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
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
      <AdSlot slot="home-bottom" />
    </div>
  );
}
