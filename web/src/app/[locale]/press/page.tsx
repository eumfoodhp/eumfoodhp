import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import BoardSearchForm from '@/components/BoardSearchForm';
import BoardPagination from '@/components/BoardPagination';
import PressHeroSlider from '@/components/PressHeroSlider';
import '@/styles/sub.css';
import '@/styles/board_pages.css';

export const revalidate = 0;

const PAGE_SIZE = 9; // 3x3 그리드

function pickStr(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  await getTranslations();

  const q = pickStr(sp.q).trim();
  const cat = pickStr(sp.cat).trim();
  const pageNum = Math.max(1, parseInt(pickStr(sp.page), 10) || 1);
  const from = (pageNum - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createServerSupabase();

  // 페이지 1 일 때만 히어로 슬라이드 (최근 5건) 노출.
  let heroItems: Array<{ id: number; title: string; thumbnail: string | null; created_at: string }> = [];
  if (pageNum === 1 && !q && !cat) {
    const { data: heroData } = await supabase
      .from('press_releases')
      .select('id, title, thumbnail, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    heroItems = heroData ?? [];
  }

  let query = supabase
    .from('press_releases')
    .select('id, title, source, thumbnail, view_count, created_at', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (q) query = query.ilike('title', `%${q}%`);
  if (cat && cat !== 'all') query = query.eq('source', cat);

  const { data: list, count } = await query.range(from, to);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main id="sub_contents" className="press_page">
      <div className="sub_inner">
        <header className="board_page_head">
          <span className="eyebrow">PRESS RELEASE</span>
          <h1>보도자료</h1>
        </header>

        {heroItems.length > 0 && <PressHeroSlider items={heroItems} />}

        <div className="board_toolbar">
          <span className="total">Total <b>{total}</b></span>
          <span className="spacer" />
          <BoardSearchForm
            initialQ={q}
            initialCat={cat || 'all'}
            filterPlaceholder="제목"
          />
        </div>

        {total === 0 ? (
          <div className="board_empty">
            {q ? `"${q}" 에 대한 검색 결과가 없습니다.` : '등록된 보도자료가 없습니다.'}
          </div>
        ) : (
          <ul className="board_grid">
            {list!.map((p) => (
              <li key={p.id} className="card">
                <Link href={`/press/${p.id}` as never}>
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

        <BoardPagination
          basePath="/press"
          currentPage={pageNum}
          totalPages={totalPages}
          query={{ q: q || undefined, cat: cat && cat !== 'all' ? cat : undefined }}
        />
      </div>
    </main>
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
