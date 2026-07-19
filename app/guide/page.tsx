import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "급여 가이드 — 실수령액·4대보험·퇴직금·최저임금",
  description:
    "연봉 실수령액 구조, 4대보험 요율, 퇴직금 계산법, 2026년 최저임금과 주휴수당, 연말정산까지 — 직장인이 알아야 할 급여 상식을 글 하나씩으로 정리했습니다.",
  alternates: { canonical: "/guide" },
};

export default function GuideListPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-extrabold">급여 가이드</h1>
      <p className="mb-8 text-muted">
        실수령액·4대보험·퇴직금·최저임금 — 월급과 관련해 한 번쯤 궁금했던 것들을
        순서대로 읽어도 좋고 필요한 글만 골라 읽어도 좋습니다.
      </p>
      <ul className="space-y-4">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guide/${g.slug}`}
              className="block rounded-2xl border border-border-soft bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md"
            >
              <h2 className="font-bold leading-snug">{g.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {g.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
