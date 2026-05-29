import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import BoardSearchForm from '@/components/BoardSearchForm';
import BoardPagination from '@/components/BoardPagination';
import '@/styles/sub.css';
import '@/styles/board_pages.css';

export const revalidate = 0;

const PAGE_SIZE = 8;

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

  // 사용 중인 카테고리 distinct 추출 (필터 옵션)
  const { data: catRows } = await supabase
    .from('downloads')
    .select('category')
    .not('category', 'is', null);
  const uniqueCats = Array.from(new Set((catRows ?? []).map((r) => r.category).filter(Boolean) as string[]));

  let query = supabase
    .from('downloads')
    .select('id, title, description, category, file_url, file_size, file_type, download_count, created_at', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (q) query = query.ilike('title', `%${q}%`);
  if (cat && cat !== 'all') query = query.eq('category', cat);

  const { data: list, count } = await query.range(from, to);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
          <BoardSearchForm
            initialQ={q}
            initialCat={cat || 'all'}
            filterPlaceholder="카테고리"
            filterOptions={uniqueCats.map((c) => ({ value: c, label: c }))}
          />
        </div>

        {total === 0 ? (
          <div className="board_empty">
            {q ? `"${q}" 에 대한 검색 결과가 없습니다.` : '등록된 자료가 없습니다.'}
          </div>
        ) : (
          <ul className="board_dl_list" style={{ marginTop: 28 }}>
            {list!.map((d) => (
              <li key={d.id} className="board_dl_item">
                <span className="board_dl_chip">{d.category ?? '자료'}</span>
                <div className="board_dl_main">
                  <h3>{d.title}</h3>
                  {d.description && <p>{d.description}</p>}
                </div>
                <Link href={`/download/${d.id}` as never} className="board_dl_btn">
                  <span>Next</span>
                  <ArrowIcon />
                </Link>
              </li>
            ))}
          </ul>
        )}

        <BoardPagination
          basePath="/download"
          currentPage={pageNum}
          totalPages={totalPages}
          query={{ q: q || undefined, cat: cat && cat !== 'all' ? cat : undefined }}
        />
      </div>
    </main>
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
