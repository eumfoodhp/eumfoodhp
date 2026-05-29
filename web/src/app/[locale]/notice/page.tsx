import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/sub.css';
import '@/styles/board_pages.css';

export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('notices')
    .select('id, title, category, is_pinned, view_count, created_at, file_url')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100);

  const total = list?.length ?? 0;

  return (
    <main id="sub_contents" className="notice_page">
      <div className="sub_inner">
        <header className="board_page_head">
          <span className="eyebrow">NOTICE</span>
          <h1>새로운 소식</h1>
        </header>

        <div className="board_toolbar">
          <span className="total">Total <b>{total}</b></span>
          <span className="spacer" />
          <select className="board_filter_select" defaultValue="all" aria-label="카테고리 필터">
            <option value="all">카테고리</option>
            <option value="notice">공지</option>
            <option value="news">소식</option>
          </select>
          <div className="board_search">
            <input type="search" placeholder="검색어를 입력해주세요" aria-label="검색어" />
            <button type="button" aria-label="검색">
              <SearchIcon />
            </button>
          </div>
        </div>

        {total === 0 ? (
          <div className="board_empty">등록된 공지사항이 없습니다.</div>
        ) : (
          <ul className="board_line_list">
            {list!.map((n, idx) => (
              <li key={n.id} className="row">
                <Link href={`/notice/${n.id}`}>
                  <span className={`col_no${n.is_pinned ? ' pinned' : ''}`}>
                    {n.is_pinned ? '공지' : `No.${total - idx}`}
                  </span>
                  <span className="col_title">{n.title}</span>
                  <span className="col_chip_wrap">
                    {n.file_url && (
                      <span className="col_chip">
                        <DownloadIcon />
                        <span>다운로드</span>
                      </span>
                    )}
                  </span>
                  <span className="col_date">
                    {new Date(n.created_at).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {total > 0 && (
          <nav className="board_pagination" aria-label="페이지 네비게이션">
            <span className="nav" aria-hidden>‹</span>
            <span className="active">1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>…</span>
            <span>10</span>
            <span className="nav" aria-hidden>›</span>
          </nav>
        )}
      </div>
    </main>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
