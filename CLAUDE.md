# CLAUDE.md — 급여노트 (salary-note)

연봉 실수령액·4대보험·퇴직금·시급/주휴수당 등 직장인이 반복 검색하는 급여 정보를
계산기 4종과 가이드 글로 해결하는 애드센스 수익형 미니사이트. 생활반장 노트 시리즈.

## 스택·명령

- Next.js 16.2.10 (App Router) + TypeScript + Tailwind CSS 4. DB·로그인·결제 없음, 전부 정적.
- 개발 서버: 워크스페이스 `.claude/launch.json`의 `salary-note-dev` (포트 3600, preview_start 사용)
- 빌드: `npm run build` / 테스트: `npm test` (vitest 32개)
- Node는 포터블: 명령 앞에 `$env:Path = "E:\클로드\tools\node;$env:Path"` 필요
- 배포: `git push origin main` (Vercel 자동 배포)만 사용. 절차는 `DEPLOY.md`
- 도메인: salary.lifebanjang.com (허브 lifebanjang-hub의 `lib/notes.ts`에 등록)

## 구조

- `lib/date.ts` — 공통 날짜·금액 유틸 (UTC 자정 기준, formatWon)
- 계산 엔진 + 테스트 (로직 수정 시 반드시 테스트 함께 갱신):
  - `lib/insurance.ts` 4대보험 근로자 부담 (국민연금 4.75%·건강 3.595%·장기요양 13.14%·고용 0.9%, 국민연금 기준소득월액 상·하한)
  - `lib/salary.ts` 연봉→월 실수령액 (근로소득공제·기본세율·근로소득세액공제 → 연 소득세 추정, insurance 재사용)
  - `lib/severance.ts` 퇴직금 (1일 평균임금×30×재직일수/365, 상여 3/12 가산)
  - `lib/hourly.ts` 시급·최저임금·주휴수당·월 209시간 환산
- 가이드 글 5편: `lib/guides-1.ts`(실수령·4대보험 2)·`guides-2.ts`(퇴직금·최저임금·연말정산 3), `lib/guides.ts`(집계)
- 계산기 페이지: `app/calc/{salary,severance,hourly,insurance}/page.tsx` — 각 페이지에 SEO 해설 + FAQPage JSON-LD
- 애드센스: `components/AdSlot.tsx` — `NEXT_PUBLIC_ADSENSE_CLIENT` 설정 전에는 아무것도 렌더링 안 함

## 주의사항 (매년 갱신 대상 — 값 변경 시 테스트 동반)

> 전 노트의 갱신 항목과 월별 일정은 워크스페이스 `E:\클로드\CLAUDE.md`의
> **"기준값 갱신 캘린더"**에 모아 두었다. 이 노트는 **7월 갱신 항목을 가진
> 두 저장소 중 하나**라 특히 놓치기 쉽다.

- **국민연금 기준소득월액 상·하한**: **매년 7월 조정**. `lib/insurance.ts`의
  `RATES.pensionBaseMax/Min` (현재 2026.7~2027.6: **659만 / 41만**).
  세금노트 `lib/year-end.ts`가 같은 상한을 인라인으로 들고 있으니 **함께 고칠 것.**
- **건강보험료율**: 매년 초 고시. `RATES.health`(근로자 **3.595%** = 7.19%의 절반)·
  `longTermCareOfHealth`(**13.14%** = 장기요양 0.9448% ÷ 7.19%)
- **국민연금 보험료율**: 2025년 개혁으로 9% → 13% **단계 인상 중**.
  `RATES.pension`(현재 근로자 **4.75%**, 총 9.5%) — 연초마다 그해 요율 확인
- **최저임금**: 매년 8월 고시, 이듬해 1월 1일 시행. `lib/hourly.ts`의 `MIN_WAGE` 표에
  **연도별로 추가**하면 된다(2025: 10,030 / 2026: 10,320 / 2027: 10,700 — 2026.8.5 고시).
  `CURRENT_MIN_WAGE`는 `minWageFor()`가 오늘 날짜로 고르므로 **1월 1일에 손댈 일이 없다.**
  새 고시가 나오면 표에 한 줄 추가하고 `hourly.test.ts`의 고시값 고정 테스트에도 추가할 것.
  월 환산액(고시문에 함께 나온다)과 `monthlyFromHourly()` 결과가 맞는지로 검산된다.
- **고시값 고정 테스트**: `lib/insurance.test.ts`에 요율·상하한을 리터럴로 고정한
  테스트가 있다. 다른 테스트는 상수를 기호로 참조해 값이 낡아도 통과하므로,
  **이 테스트가 실패해야 갱신을 놓치지 않는다.** 값을 고치면 이 테스트도 함께 고칠 것.
- 값을 고치면 **가이드 본문(`lib/guides-*.ts`)에 그대로 쓴 숫자**도 함께 훑을 것.
  2026년 8월 점검에서 상한 637만이 가이드 4곳에 남아 있었다.
- **소득세 세율·근로소득공제**: 소득세법 개정 시 `lib/salary.ts`의 `BRACKETS`·`earnedIncomeDeduction` 갱신
- 소득세는 '간이세액표'가 아니라 연간 기준 추정이라는 고지(계산기·Footer)를 유지할 것
- 세무·노무 자문이 아니라는 면책 고지를 유지할 것
- 브라우저 스크린샷은 이 환경에서 타임아웃 가능 — get_page_text/read_page로 검증
- PowerShell에서 `app/guide/[slug]` 경로를 다룰 때는 `-LiteralPath` 사용 (대괄호가 와일드카드로 해석됨)
