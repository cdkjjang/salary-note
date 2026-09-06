import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 보안 헤더 — 콘텐츠나 광고 동작에는 영향을 주지 않는다.
  // HSTS와 HTTPS 리다이렉트는 Vercel이 처리하므로 여기서는 세 가지만 둔다.
  // X-Frame-Options는 SAMEORIGIN — 광고는 우리 페이지 '안에' 들어오는
  // iframe이라 이 헤더의 영향을 받지 않는다.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // 이 사이트는 카메라·마이크·위치·결제를 쓰지 않는다. 명시적으로 꺼 두면
          // 광고 iframe을 포함한 하위 프레임에서도 요청할 수 없다.
          // 애드센스가 쓰는 기능이 아니라 광고 게재에 영향이 없다.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },

  // 2026-09-06 가이드 통합으로 사라진 슬러그 → 흡수한 글로 301.
  //
  // 얇은 글을 주제 단위로 합치면서 URL이 사라졌다. 그냥 지우면 404가 생기고
  // 이미 색인된 것과 외부에서 걸린 링크가 전부 끊긴다.
  // permanent: true는 308로 나가고 구글은 301과 같게 처리한다.
  // **이 목록을 지우지 말 것.**
  //
  // 아래 세 건은 다른 노트로 보낸다. 같은 주제를 두 노트가 나눠 갖고 있었고,
  // 그쪽이 그 주제의 본거지다. 이런 노트 간 중복이 애드센스 재반려의 원인 중
  // 하나였다(워크스페이스 CLAUDE.md 8장).
  async redirects() {
    const merged: Record<string, string> = {
      // → 연봉 실수령액 (같은 연봉인데 갈리는 이유까지)
      "same-salary-different-net": "/guide/salary-net-explained",
      // → 4대보험 요율 총정리 (2026년 인상분 포함)
      "four-insurance-2026": "/guide/four-insurance-explained",
      // → 최저임금 총정리 (연도별 금액을 한 글에 모음)
      "minimum-wage-2026": "/guide/minimum-wage-2027",
      // → 퇴직금 총정리 (DB·DC·IRP까지)
      "retirement-pension-types": "/guide/severance-guide",
      // → 연차수당과 연차촉진제
      "annual-leave-promotion": "/guide/annual-leave-allowance",

      // 노트 간 중복 해소 — 그 주제의 본거지로 보낸다
      "year-end-settlement":
        "https://tax.lifebanjang.com/guide/year-end-settlement-guide",
      "unemployment-benefit":
        "https://toesa.lifebanjang.com/guide/benefit-amount-truth",
      "health-insurance-after-quit":
        "https://toesa.lifebanjang.com/guide/health-insurance-after-quitting",
    };

    return Object.entries(merged).map(([from, to]) => ({
      source: `/guide/${from}`,
      destination: to,
      permanent: true,
    }));
  },
};

export default nextConfig;
