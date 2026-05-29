import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import BoardSearchForm from '@/components/BoardSearchForm';
import BoardPagination from '@/components/BoardPagination';
import '@/styles/sub.css';
import '@/styles/board_pages.css';

export const revalidate = 0;

const PAGE_SIZE = 10;

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
  let query = supabase
    .from('notices')
    .select('id, title, category, is_pinned, view_count, created_at, file_url', { count: 'exact' })
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (q) query = query.ilike('title', `%${q}%`);
  if (cat && cat !== 'all') query = query.eq('category', cat);

  const { data: list, count } = await query.range(from, to);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main id="sub_contents" className="notice_page">
      <div className="sub_inner">
        <header className="board_page_head">
          <span className="eyebrow">NOTICE</span>
          <h1>공지사항</h1>
        </header>

        <div className="board_toolbar">
          <span className="total">Total <b>{total}</b></span>
          <span className="spacer" />
          <BoardSearchForm
            initialQ={q}
            initialCat={cat || 'all'}
            filterPlaceholder="카테고리"
          />
        </div>

        {total === 0 ? (
          <div className="board_empty">
            {q ? `"${q}" 에 대한 검색 결과가 없습니다.` : '등록된 공지사항이 없습니다.'}
          </div>
        ) : (
          <ul className="board_line_list">
            {list!.map((n, idx) => (
              <li key={n.id} className="row">
                <Link href={`/notice/${n.id}` as never}>
                  <span className={`col_no${n.is_pinned ? ' pinned' : ''}`}>
                    {n.is_pinned ? '공지' : `No.${total - from - idx}`}
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

        <BoardPagination
          basePath="/notice"
          currentPage={pageNum}
          totalPages={totalPages}
          query={{ q: q || undefined, cat: cat && cat !== 'all' ? cat : undefined }}
        />
      </div>
    </main>
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
