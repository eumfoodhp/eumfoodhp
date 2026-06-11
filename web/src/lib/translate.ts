/**
 * 무료(비공식) Google 번역 — 한글 → 중국어(간체). API 키 불필요.
 * 서버에서만 호출. 실패하면 null 반환 (호출부에서 한글 fallback).
 * ⚠ 비공식 엔드포인트라 드물게 막히거나 형식이 바뀔 수 있음 — 안정성이 필요하면 정식 API로 교체.
 */
export async function translateKoToZh(text: string): Promise<string | null> {
  const q = (text ?? '').trim();
  if (!q) return null;
  try {
    const url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=zh-CN&dt=t&q=' +
      encodeURIComponent(q);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; eumfoodbot/1.0)' },
      cache: 'no-store',
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    // 형식: [[["译文","원문",...], ...], null, "ko", ...]
    const data = (await res.json()) as unknown;
    const segs = Array.isArray(data) && Array.isArray(data[0]) ? (data[0] as unknown[]) : [];
    const out = segs
      .map((s) => (Array.isArray(s) ? String(s[0] ?? '') : ''))
      .join('')
      .trim();
    return out || null;
  } catch {
    return null;
  }
}
