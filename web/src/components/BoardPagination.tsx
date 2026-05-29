import { Link } from '@/i18n/navigation';

/**
 * 서버 컴포넌트 페이지네이션. 좌우 5개 윈도우 + … + 마지막.
 * basePath: '/notice' 등 (locale 무관, next-intl Link 가 자동으로 prefix).
 * query: 검색어/필터 등 유지할 추가 파라미터.
 */
export default function BoardPagination({
  basePath,
  currentPage,
  totalPages,
  query = {},
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  query?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function href(page: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v) params.set(k, v);
    }
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ''}` as never;
  }

  // 윈도우 생성: [1] … [c-2..c+2] … [last]  (윈도우는 최대 5개)
  const win: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) win.push(i);

  const showFirst = start > 1;
  const showFirstGap = start > 2;
  const showLast = end < totalPages;
  const showLastGap = end < totalPages - 1;

  return (
    <nav className="board_pagination" aria-label="페이지 네비게이션">
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} className="nav" aria-label="이전 페이지">‹</Link>
      ) : (
        <span className="nav" aria-hidden>‹</span>
      )}

      {showFirst && (
        <Link href={href(1)}>1</Link>
      )}
      {showFirstGap && <span>…</span>}

      {win.map((p) => (
        p === currentPage ? (
          <span key={p} className="active" aria-current="page">{p}</span>
        ) : (
          <Link key={p} href={href(p)}>{p}</Link>
        )
      ))}

      {showLastGap && <span>…</span>}
      {showLast && (
        <Link href={href(totalPages)}>{totalPages}</Link>
      )}

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} className="nav" aria-label="다음 페이지">›</Link>
      ) : (
        <span className="nav" aria-hidden>›</span>
      )}
    </nav>
  );
}
