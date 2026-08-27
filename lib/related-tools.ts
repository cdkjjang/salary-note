/**
 * 이 노트의 계산기를 쓴 사람이 **다음에 마주칠 질문**과, 그 답이 있는
 * 다른 노트의 계산기.
 *
 * ⚠️ 이 파일은 워크스페이스 생성기로 만든다. 손으로 고치면 다음 생성 때 덮인다.
 *
 * 규칙 (components/RelatedTools.tsx 주석 참조):
 *   - 계산기마다 최대 3개. 페이지마다 내용이 달라야 한다.
 *   - 같은 노트 안의 계산기는 넣지 않는다.
 *   - "관련 계산기"가 아니라 그 사람이 실제로 다음에 겪는 일로 적는다.
 */
export type RelatedTool = {
  /** 그 사람이 다음에 던지는 질문 — 링크 텍스트가 된다 */
  question: string;
  /** 어느 노트인지 */
  note: string;
  /** 어떤 계산기인지 */
  tool: string;
  /** 전체 URL (다른 도메인이므로 절대 경로) */
  href: string;
};

export const RELATED_TOOLS: Record<string, RelatedTool[]> = {
  "/calc/salary": [
    {
      question: "연말정산에서 환급을 받을까요 더 낼까요",
      note: "세금노트",
      tool: "연말정산 계산기",
      href: "https://tax.lifebanjang.com/calc/year-end",
    },
    {
      question: "이 소득으로 대출을 얼마나 받을 수 있나요",
      note: "대출노트",
      tool: "DSR 계산기",
      href: "https://loan.lifebanjang.com/calc/dsr",
    },
    {
      question: "지금 내는 국민연금으로 나중에 얼마를 받나요",
      note: "연금노트",
      tool: "국민연금 예상액 계산기",
      href: "https://pension.lifebanjang.com/calc/national",
    },
  ],
  "/calc/severance": [
    {
      question: "퇴직연금으로 받으면 세금이 줄어드나요",
      note: "연금노트",
      tool: "퇴직연금 세금 계산기",
      href: "https://pension.lifebanjang.com/calc/retirement",
    },
    {
      question: "그만두면 실업급여는 얼마나 받나요",
      note: "퇴사노트",
      tool: "실업급여 계산기",
      href: "https://toesa.lifebanjang.com/calc/benefit",
    },
    {
      question: "퇴사하면 건강보험료가 얼마 나오나요",
      note: "퇴사노트",
      tool: "퇴사 후 건강보험 계산기",
      href: "https://toesa.lifebanjang.com/calc/health",
    },
  ],
  "/calc/hourly": [
    {
      question: "대중교통비를 얼마나 돌려받을 수 있나요",
      note: "청년정책노트",
      tool: "K-패스 환급 계산기",
      href: "https://youth.lifebanjang.com/calc/kpass",
    },
    {
      question: "학자금대출은 연봉 얼마부터 갚나요",
      note: "학자금노트",
      tool: "학자금 상환액 계산기",
      href: "https://hakjagum.lifebanjang.com/calc/icl",
    },
    {
      question: "아르바이트도 연말정산을 하나요",
      note: "세금노트",
      tool: "연말정산 계산기",
      href: "https://tax.lifebanjang.com/calc/year-end",
    },
  ],
  "/calc/insurance": [
    {
      question: "낸 만큼 국민연금을 얼마나 받게 되나요",
      note: "연금노트",
      tool: "국민연금 예상액 계산기",
      href: "https://pension.lifebanjang.com/calc/national",
    },
    {
      question: "부모님을 피부양자로 올릴 수 있나요",
      note: "건강보험노트",
      tool: "피부양자 자격 계산기",
      href: "https://health.lifebanjang.com/calc/dependent",
    },
    {
      question: "연말정산에서 보험료는 어떻게 반영되나요",
      note: "세금노트",
      tool: "연말정산 계산기",
      href: "https://tax.lifebanjang.com/calc/year-end",
    },
  ],
};
