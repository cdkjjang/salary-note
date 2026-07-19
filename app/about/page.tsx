import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description:
    "급여노트는 연봉 실수령액·4대보험·퇴직금·최저임금 등 직장인이 반복해서 찾는 급여 정보를 계산기와 가이드로 정리한 생활 정보 서비스입니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">{SITE_NAME} 소개</h1>
      <p>
        {SITE_NAME}는 직장인이 반복해서 마주치는 돈 계산을 해결하는 무료 도구
        모음입니다. 연봉에서 4대보험과 세금을 뗀 월 실수령액, 퇴사 시 받을
        퇴직금, 시급·주휴수당과 최저임금, 4대보험 항목별 부담액을 계산기로 바로
        확인하고, 급여 상식을 가이드로 정리했습니다.
      </p>
      <p>
        모든 기준은 국민연금법·소득세법·근로기준법·근로자퇴직급여 보장법 등
        공개된 법령과 공공기관 고시를 근거로 하며, 요율과 상·하한이 매년 바뀌므로
        확인된 최신 값으로 갱신해 운영합니다.
      </p>
      <p>
        다만 이 사이트의 정보는 일반적인 안내이며 세무·노무 자문이 아닙니다. 매월
        실제 원천징수액은 간이세액표에 따라 다를 수 있고, 정확한 4대보험료는 각
        공단, 세금은 국세청 홈택스(hometax.go.kr)에서 확인하세요.
      </p>
      <p>
        입력한 연봉·급여·날짜는 이용자의 브라우저 안에서만 계산되며 서버로
        전송·저장되지 않습니다. 회원가입도 없습니다. 문의는{" "}
        <a href="mailto:cdkjjang@gmail.com" className="text-accent underline-offset-4 hover:underline">
          cdkjjang@gmail.com
        </a>
        으로 보내주세요.
      </p>
      <p>
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          홈으로 →
        </Link>
      </p>
    </div>
  );
}
