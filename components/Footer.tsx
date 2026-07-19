import Link from "next/link";
import FamilyLinks from "@/components/FamilyLinks";
import { SITE_NAME } from "@/lib/site";

const TOOL_LINKS = [
  { href: "/calc/salary", label: "연봉 실수령액 계산기" },
  { href: "/calc/severance", label: "퇴직금 계산기" },
  { href: "/calc/hourly", label: "시급·주휴수당 계산기" },
  { href: "/calc/insurance", label: "4대보험료 계산기" },
  { href: "/guide", label: "급여 가이드" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border-soft bg-card">
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted">
        <nav aria-label="사이트 바로가기" className="mb-5">
          <p className="mb-2 font-semibold text-foreground">{SITE_NAME} 도구</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {TOOL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <FamilyLinks />
        <p className="mb-3">
          {SITE_NAME}의 계산 결과는 법령·공개 요율을 정리한 참고용 추정치이며,
          세무·노무 자문이 아닙니다. 매월 실제 원천징수액은 근로소득 간이세액표에
          따라 다를 수 있고 연말정산으로 정산됩니다. 정확한 4대보험료는 각 공단,
          세금은 국세청 홈택스(hometax.go.kr)에서 확인하세요.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-accent">
            소개
          </Link>
          <Link href="/terms" className="hover:text-accent">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-accent">
            개인정보처리방침
          </Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} {SITE_NAME}</p>
      </div>
    </footer>
  );
}
