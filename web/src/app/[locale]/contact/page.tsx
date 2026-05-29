import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/sub.css';
import '@/styles/public-forms.css';
import '@/styles/inquiry-sales-forms.css';

export const revalidate = 0;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ submitted?: string; sort?: string; field?: string; q?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  setRequestLocale(locale);
  const t = await getTranslations();

  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const PAGE_SIZE = 8;
  const sort = sp.sort === 'oldest' ? 'oldest' : 'latest';
  const field = sp.field ?? 'subject';
  const q = (sp.q ?? '').trim();

  const supabase = await createServerSupabase();
  let query = supabase
    .from('contacts')
    .select('id, writer_name, subject, status, is_private, created_at', { count: 'exact' });

  if (q) {
    if (field === 'writer') query = query.ilike('writer_name', `%${q}%`);
    else query = query.ilike('subject', `%${q}%`);
  }
  query = query.order('created_at', { ascending: sort === 'oldest' });
  query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const { data: list, count } = await query;
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main id="sub_contents" className="contact_page">
      <div className="sub_inner inquiry_inner">
        {sp.submitted === '1' && (
          <div className="public_notice success" role="status">
            문의가 정상적으로 접수되었습니다. 빠른 시일 내 답변드리겠습니다.
          </div>
        )}

        {/* 페이지 헤딩 */}
        <header className="inquiry_head">
          <p className="inquiry_eyebrow">Meaning of a passage</p>
          <h2 className="inquiry_title">1:1 문의</h2>
        </header>

        {/* 필터 바 — 정렬 / 검색 필드 / 검색어 / 글쓰기 */}
        <form className="inquiry_filter_bar" method="get">
          <div className="inquiry_filters">
            <select name="sort" defaultValue={sort} className="inquiry_select">
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
            <select name="field" defaultValue={field} className="inquiry_select">
              <option value="subject">제목</option>
              <option value="writer">작성자</option>
            </select>
            <div className="inquiry_search">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="검색어를 입력해주세요"
                className="inquiry_search_input"
              />
              <button type="submit" className="inquiry_search_btn" aria-label="검색">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
          </div>
          <Link href="/contact/write" className="inquiry_write_btn">글쓰기</Link>
        </form>

        <table className="inquiry_table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>NO</th>
              <th>제목</th>
              <th style={{ width: 140 }}>작성자</th>
              <th style={{ width: 140 }}>작성일</th>
              <th style={{ width: 120 }}>문의상태</th>
            </tr>
          </thead>
          <tbody>
            {!list || list.length === 0 ? (
              <tr>
                <td colSpan={5} className="inquiry_table_empty">
                  아직 등록된 문의가 없습니다.
                </td>
              </tr>
            ) : (
              list.map((c, idx) => {
                const rowNo = total - ((page - 1) * PAGE_SIZE + idx);
                return (
                  <tr key={c.id}>
                    <td>No.{rowNo}</td>
                    <td className="inquiry_table_title">
                      {c.is_private && <span aria-hidden="true">🔒 </span>}
                      {c.is_private ? '비공개 글입니다.' : c.subject}
                    </td>
                    <td>{maskName(c.writer_name)}</td>
                    <td>{formatDate(c.created_at)}</td>
                    <td>
                      {c.status === 'answered' ? (
                        <span className="status_chip status_chip--answered">답변완료</span>
                      ) : (
                        <span className="status_chip status_chip--wait">답변대기</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <nav className="inquiry_pagination" aria-label="페이지">
            <PageLink page={Math.max(1, page - 1)} sort={sort} field={field} q={q} disabled={page <= 1}>
              &lsaquo;
            </PageLink>
            {makePageList(page, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={`gap-${i}`} className="inquiry_page_gap">…</span>
              ) : (
                <PageLink key={p} page={p as number} sort={sort} field={field} q={q} active={p === page}>
                  {String(p)}
                </PageLink>
              )
            )}
            <PageLink page={Math.min(totalPages, page + 1)} sort={sort} field={field} q={q} disabled={page >= totalPages}>
              &rsaquo;
            </PageLink>
          </nav>
        )}
      </div>
    </main>
  );
}

function maskName(name: string): string {
  if (!name) return '';
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

function formatDate(s: string): string {
  const d = new Date(s);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `20${yy}.${mm}.${dd}`;
}

function makePageList(current: number, total: number): Array<number | '...'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | '...'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('...');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('...');
  pages.push(total);
  return pages;
}

function PageLink({
  page,
  sort,
  field,
  q,
  active,
  disabled,
  children,
}: {
  page: number;
  sort: string;
  field: string;
  q: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const params = new URLSearchParams();
  if (sort && sort !== 'latest') params.set('sort', sort);
  if (field && field !== 'subject') params.set('field', field);
  if (q) params.set('q', q);
  if (page > 1) params.set('page', String(page));
  const href = '/contact' + (params.toString() ? `?${params.toString()}` : '');
  if (disabled) {
    return <span className="inquiry_page_btn is_disabled" aria-disabled="true">{children}</span>;
  }
  return (
    <Link href={href} className={`inquiry_page_btn${active ? ' is_active' : ''}`}>
      {children}
    </Link>
  );
}
