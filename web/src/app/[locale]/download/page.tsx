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
    .from('downloads')
    .select('id, title, description, category, file_url, file_size, file_type, download_count, created_at')
    .order('created_at', { ascending: false });

  const total = list?.length ?? 0;

  return (
    <main id="sub_contents" className="download_page">
      <div className="sub_inner">
        <header className="board_page_head">
          <span className="eyebrow">DOWNLOAD</span>
          <h1>자료실</h1>
        </header>

        <div className="board_toolbar">
          <span className="total">Total <b>{total}</b></span>
          <span className="spacer" />
          <select className="board_filter_select" defaultValue="all" aria-label="카테고리 필터">
            <option value="all">카테고리</option>
            <option value="brochure">회사소개서</option>
            <option value="catalog">e-카탈로그</option>
          </select>
          <div className="board_search">
            <input type="search" placeholder="검색어를 입력해주세요" aria-label="검색어" />
            <button type="button" aria-label="검색">
              <SearchIcon />
            </button>
          </div>
        </div>

        {total === 0 ? (
          <div className="board_empty">등록된 자료가 없습니다.</div>
        ) : (
          <ul className="board_dl_list" style={{ marginTop: 28 }}>
            {list!.map((d) => (
              <li key={d.id} className="board_dl_item">
                <span className="board_dl_chip">{d.category ?? '자료'}</span>
                <div className="board_dl_main">
                  <h3>{d.title}</h3>
                  {d.description && <p>{d.description}</p>}
                </div>
                <Link href={`/download/${d.id}`} className="board_dl_btn">
                  <span>Next</span>
                  <ArrowIcon />
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
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
