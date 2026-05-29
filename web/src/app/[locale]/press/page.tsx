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
    .from('press_releases')
    .select('id, title, source, thumbnail, view_count, created_at')
    .order('created_at', { ascending: false })
    .limit(60);

  const total = list?.length ?? 0;
  // 상단 히어로 슬라이드 — 최근 5건에서 첫 번째 노출 (인디케이터: 1 / N)
  const heroItems = (list ?? []).slice(0, 5);
  const hero = heroItems[0];
  const gridItems = (list ?? []).slice(heroItems.length === 0 ? 0 : 0); // 전체를 카드 그리드에도 노출

  return (
    <main id="sub_contents" className="press_page">
      <div className="sub_inner">
        <header className="board_page_head">
          <span className="eyebrow">PRESS RELEASE</span>
          <h1>보도자료</h1>
        </header>

        {hero && (
          <section className="board_hero" aria-label="대표 보도자료">
            <Link href={`/press/${hero.id}`} className="board_hero_thumb">
              {hero.thumbnail ? (
                <img src={hero.thumbnail} alt="" loading="eager" />
              ) : (
                <div className="board_hero_thumb_placeholder">
                  <ImagePlaceholderIcon />
                </div>
              )}
            </Link>
            <div className="board_hero_body">
              <span className="board_hero_tag">NEWS</span>
              <h2 className="board_hero_title">
                <Link href={`/press/${hero.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {hero.title}
                </Link>
              </h2>
              <span className="board_hero_date">
                {new Date(hero.created_at).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '')}
              </span>
            </div>
            <div className="board_hero_pager">
              <span className="board_hero_indicator">
                <b>1</b> / {heroItems.length}
              </span>
              <button type="button" className="board_hero_nav board_hero_nav--prev" aria-label="이전">‹</button>
              <button type="button" className="board_hero_nav board_hero_nav--next" aria-label="다음">›</button>
            </div>
          </section>
        )}

        <div className="board_toolbar">
          <span className="total">Total <b>{total}</b></span>
          <span className="spacer" />
          <select className="board_filter_select" defaultValue="all" aria-label="필터">
            <option value="all">제목</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <div className="board_search">
            <input type="search" placeholder="검색어를 입력해주세요" aria-label="검색어" />
            <button type="button" aria-label="검색">
              <SearchIcon />
            </button>
          </div>
        </div>

        {total === 0 ? (
          <div className="board_empty">등록된 보도자료가 없습니다.</div>
        ) : (
          <ul className="board_grid">
            {gridItems.map((p) => (
              <li key={p.id} className="card">
                <Link href={`/press/${p.id}`}>
                  <div className="thumb">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt="" loading="lazy" />
                    ) : (
                      <div className="thumb_placeholder">
                        <ImagePlaceholderIcon />
                      </div>
                    )}
                  </div>
                  <div className="body">
                    <span className="tag">NEWS</span>
                    <h3 className="title">{p.title}</h3>
                    <span className="date">
                      {new Date(p.created_at).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '')}
                    </span>
                  </div>
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
function ImagePlaceholderIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
