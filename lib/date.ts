// 날짜·금액 유틸 — 타임존 영향을 받지 않도록 모든 날짜를 UTC 자정 기준으로 다룬다.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" → UTC 자정 Date. 형식이 잘못되면 null */
export function parseDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const [, y, mo, d] = m;
  const date = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)));
  if (
    date.getUTCFullYear() !== Number(y) ||
    date.getUTCMonth() !== Number(mo) - 1 ||
    date.getUTCDate() !== Number(d)
  ) {
    return null;
  }
  return date;
}

export function formatDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 두 날짜 사이 일수 (b - a). 같은 날이면 0 */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/** n개월 더하기 (음수 가능). 결과 월에 같은 날이 없으면 그 월의 말일로 보정. */
export function addMonths(d: Date, n: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + n;
  const targetY = y + Math.floor(m / 12);
  const targetM = ((m % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetY, targetM + 1, 0)).getUTCDate();
  const day = Math.min(d.getUTCDate(), lastDay);
  return new Date(Date.UTC(targetY, targetM, day));
}

/** 오늘 날짜 (UTC 자정 기준의 로컬 오늘) */
export function today(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

/** 원 단위 금액을 "1,234,567원" 형태로 */
export function formatWon(n: number): string {
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}
