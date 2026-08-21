import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description:
    "급여노트는 연봉 실수령액·4대보험·퇴직금·주휴수당을 계산기와 가이드로 정리한 생활 정보 서비스입니다. 근거와 갱신 방식, 계산하지 않는 것까지 밝혀 두었습니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">{SITE_NAME} 소개</h1>
      <p>
        {SITE_NAME}는 재직 중에 받는 돈 — <strong>실수령액·4대보험·퇴직금·
        주휴수당</strong>을 계산하는 무료 도구 모음입니다. 회원가입도, 개인정보
        수집도 없습니다.
      </p>

      <h2 className="pt-2 text-lg font-bold">왜 이 네 가지인가</h2>
      <p>
        급여명세서는 항목이 많은데 정작 <strong>왜 그 금액인지는 안 적혀
        있습니다.</strong> 그래서 맞는지 확인할 방법이 없습니다.
      </p>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          <strong>연봉 실수령액</strong> — 근로소득공제, 기본세율, 근로소득
          세액공제를 거쳐야 나옵니다. 연봉만 알고는 알 수 없습니다
        </li>
        <li>
          <strong>4대보험료</strong> — 요율이 매년 바뀌고 국민연금은{" "}
          <strong>상·하한이 7월에</strong> 따로 조정됩니다
        </li>
        <li>
          <strong>퇴직금</strong> — 평균임금 기준이라 마지막 3개월 급여에 따라
          달라집니다. 연차수당과 상여금이 들어가는지가 갈립니다
        </li>
        <li>
          <strong>주휴수당</strong> — 주 15시간이 경계입니다. 여기서 하루만
          모자라도 통째로 없어집니다
        </li>
      </ul>

      <h2 className="pt-2 text-lg font-bold">근거와 갱신</h2>
      <p>
        모든 기준은 <strong>소득세법</strong>, <strong>근로기준법</strong>,{" "}
        <strong>국민연금법·국민건강보험법</strong>과 각 공단·부처의 연도별 고시를
        근거로 합니다. 각 계산기 페이지에 적용한 조문과 고시를 함께 표기합니다.
      </p>
      <p>
        이 노트가 다루는 값은 <strong>해마다 바뀌는 것이 대부분</strong>입니다.
        그래서 고시값 자체를 숫자로 고정하는 검증 테스트를 따로 두었습니다. 값이
        낡으면 테스트가 먼저 실패해서, 계산기가 조용히 틀린 답을 내는 일을
        막습니다. 실제로 국민연금 상·하한이 7월에 바뀐 것을 이 방식으로 잡았습니다.
      </p>

      <h2 className="pt-2 text-lg font-bold">소득세는 연간 기준 추정입니다</h2>
      <p>
        이 부분은 분명히 밝혀 둡니다. 회사가 매달 떼는 소득세는{" "}
        <strong>근로소득 간이세액표</strong>를 따르는데, 이 표는 부양가족 수에 따라
        수백 개의 칸으로 나뉩니다.
      </p>
      <p>
        이 사이트는 간이세액표 대신 <strong>연간 소득을 기준으로 세액을 계산해 12로
        나누는 방식</strong>을 씁니다. 그래서 실제 명세서와 월별로 차이가 날 수
        있습니다. 다만 연말정산까지 마치면 결국 같은 곳으로 수렴합니다.
      </p>

      <h2 className="pt-2 text-lg font-bold">계산하지 않는 것</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          <strong>연말정산 전체 환급액</strong> — 공제 항목이 훨씬 많아 세금노트
          몫으로 두었습니다
        </li>
        <li>
          <strong>실업급여</strong> — 그만둔 뒤의 것이라 퇴사노트가 맡습니다
        </li>
        <li>
          <strong>연금 수령액</strong> — 연금노트 몫입니다
        </li>
        <li>
          <strong>회사별 수당·상여 규정</strong> — 취업규칙과 단체협약에 따라
          달라 일률적으로 계산할 수 없습니다
        </li>
      </ul>

      <h2 className="pt-2 text-lg font-bold">한계와 문의</h2>
      <p>
        이 사이트의 계산은 <strong>참고용 추정치</strong>이며 노무·세무 자문이
        아닙니다. 확정 금액은 회사 급여 담당자, <strong>국세청 홈택스</strong>,{" "}
        <strong>고용노동부 고객상담센터(1350)</strong>에서 확인하세요. 입력한
        급여는 브라우저 안에서만 계산되며 서버로 전송되지 않습니다.
      </p>
      <p>
        {SITE_NAME}는 생활반장(lifebanjang.com) 노트 시리즈의 하나입니다. 문의는{" "}
        <a
          href="mailto:cdkjjang@gmail.com"
          className="text-accent underline-offset-4 hover:underline"
        >
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
