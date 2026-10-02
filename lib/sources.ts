// 가이드 "이 글의 근거"에 쓰는 링크.
//
// 2026-10-02 전수 대조에서 **본문을 열어 확인한 것만** 넣었다.
// 판결은 대법원이 공개한 판결문 PDF 본문을, 법령은 law.go.kr 조문 본문을 읽었다.
// ⚠️ 확인하지 않은 링크를 여기에 추가하지 말 것.

type Source = { label: string; href: string; note?: string };

export const SRC = {
  wageRuling: {
    label: "대법원 2024. 12. 19. 선고 2020다247190 전원합의체 판결",
    href: "https://www.scourt.go.kr/sjudge/1734594587787_164947.pdf",
    note: "고정성을 통상임금 요건에서 제외, 재직조건부 정기상여도 통상임금, 선고일 이후 근로분부터 적용",
  },
  settle: {
    label: "국민건강보험법 시행령 제39조",
    href: "https://www.law.go.kr/법령/국민건강보험법시행령/제39조",
    note: "보수월액보험료 정산, 추가징수액이 그달 보험료 이상이면 12회 이내 분할",
  },
} satisfies Record<string, Source>;
