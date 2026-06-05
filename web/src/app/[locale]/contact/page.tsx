import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import NextSectionLink from '@/components/NextSectionLink';
import SectionHeader from '@/components/SectionHeader';
import { createServerSupabase } from '@/lib/supabase-server';
import { submitSales } from './sales/actions';
import '@/styles/sub.css';
import '@/styles/board_pages.css';
import '@/styles/public-forms.css';
import '@/styles/inquiry-sales-forms.css';

export const revalidate = 0;

/**
 * 문의 — 원페이지 형태 (소식 페이지와 동일 패턴).
 * 1:1 문의(게시판) 아래에 영업문의(폼)를 단일 페이지에 스택.
 */
export default async function ContactOnePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    submitted?: string;
    sales_submitted?: string;
    sort?: string;
    field?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  setRequestLocale(locale);
  const t = await getTranslations();

  // ----- 1:1 문의 게시판 데이터 -----
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

  const salesSubmitted = sp.sales_submitted === '1';

  return (
    <main id="sub_contents" className="contact_onepage onepage_story">
      <div className="onepage_content">

        {/* ===== 1. 1:1 문의 (게시판) ===== */}
        <div id="contact" className="story_section">
          <SectionHeader title={t('sub_inquiry_1to1')} en="Inquiry" />

          <div className="sub_inner inquiry_inner">
            {sp.submitted === '1' && (
              <div className="public_notice success" role="status">
                {t('contact_submitted_notice')}
              </div>
            )}

            {/* 필터 바 — 정렬 / 검색 필드 / 검색어 / 글쓰기 */}
            <form className="inquiry_filter_bar" method="get">
              <div className="inquiry_filters">
                <select name="sort" defaultValue={sort} className="inquiry_select">
                  <option value="latest">{t('contact_sort_latest')}</option>
                  <option value="oldest">{t('contact_sort_oldest')}</option>
                </select>
                <select name="field" defaultValue={field} className="inquiry_select">
                  <option value="subject">{t('contact_search_subject')}</option>
                  <option value="writer">{t('contact_search_writer')}</option>
                </select>
                <div className="inquiry_search">
                  <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder={t('contact_search_placeholder')}
                    className="inquiry_search_input"
                  />
                  <button type="submit" className="inquiry_search_btn" aria-label={t('contact_search_aria')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                </div>
              </div>
              <Link href="/contact/write" className="inquiry_write_btn">{t('contact_write')}</Link>
            </form>

            <table className="inquiry_table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>{t('contact_col_no')}</th>
                  <th>{t('contact_col_title')}</th>
                  <th style={{ width: 140 }}>{t('contact_col_writer')}</th>
                  <th style={{ width: 140 }}>{t('contact_col_date')}</th>
                  <th style={{ width: 120 }}>{t('contact_col_state')}</th>
                </tr>
              </thead>
              <tbody>
                {!list || list.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="inquiry_table_empty">{t('contact_empty')}</td>
                  </tr>
                ) : (
                  list.map((c, idx) => {
                    const rowNo = total - ((page - 1) * PAGE_SIZE + idx);
                    return (
                      <tr key={c.id}>
                        <td>No.{rowNo}</td>
                        <td className="inquiry_table_title">
                          {c.is_private && <span aria-hidden="true">🔒 </span>}
                          {c.is_private ? t('contact_private_text') : c.subject}
                        </td>
                        <td>{maskName(c.writer_name)}</td>
                        <td>{formatDate(c.created_at)}</td>
                        <td>
                          {c.status === 'answered' ? (
                            <span className="status_chip status_chip--answered">{t('contact_state_done')}</span>
                          ) : (
                            <span className="status_chip status_chip--wait">{t('contact_state_pending')}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <nav className="inquiry_pagination" aria-label={t('contact_pagination_aria')}>
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
          <NextSectionLink prevId="contact" nextId="sales" nextLabel={t('sub_inquiry_sales')} />
        </div>

        {/* ===== 2. 영업문의 (폼) ===== */}
        <div id="sales" className="story_section">
          <SectionHeader title={t('sub_inquiry_sales')} en="Sales" />

          <div className="sub_inner sales_inner">
            {salesSubmitted ? (
              <div className="public_notice success" role="status">
                <strong>{t('sales_submitted_title')}</strong>
                <br />
                {t('sales_submitted_desc')}
              </div>
            ) : (
              <form action={submitSales} className="public_form sales_form" encType="multipart/form-data">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                  aria-hidden="true"
                />

                {/* ===== STEP 01 ===== */}
                <section className="sales_step">
                  <div className="sales_step_head">
                    <span className="sales_step_no">STEP 01</span>
                    <h3 className="sales_step_title">{t('sales_step1_title')}</h3>
                  </div>
                  <div className="pf_row">
                    <div className="pf_field">
                      <label htmlFor="company">{t('sales_form_company')} *</label>
                      <input id="company" name="company" type="text" required placeholder={t('sales_form_company_ph')} />
                    </div>
                    <div className="pf_field">
                      <label htmlFor="position">{t('sales_form_position')} *</label>
                      <input id="position" name="position" type="text" required placeholder={t('sales_form_position_ph')} />
                    </div>
                  </div>
                  <div className="pf_row">
                    <div className="pf_field">
                      <label htmlFor="writer_name">{t('sales_form_name')} *</label>
                      <input id="writer_name" name="writer_name" type="text" required maxLength={50} placeholder={t('sales_form_name_ph')} />
                    </div>
                    <div className="pf_field">
                      <label htmlFor="email">{t('sales_form_email')} *</label>
                      <input id="email" name="email" type="email" required placeholder={t('sales_form_email_ph')} />
                    </div>
                  </div>
                  <div className="pf_row">
                    <div className="pf_field">
                      <label htmlFor="phone">{t('sales_form_phone')} *</label>
                      <input id="phone" name="phone" type="tel" required placeholder={t('sales_form_phone_ph')} />
                    </div>
                    <div className="pf_field">
                      <label htmlFor="country">{t('sales_form_country')} *</label>
                      <input id="country" name="country" type="text" required placeholder={t('sales_form_country_ph')} />
                    </div>
                  </div>
                </section>

                {/* ===== STEP 02 ===== */}
                <section className="sales_step">
                  <div className="sales_step_head">
                    <span className="sales_step_no">STEP 02</span>
                    <h3 className="sales_step_title">{t('sales_step2_title')}</h3>
                  </div>

                  <div className="pf_field">
                    <label className="pf_label_with_required">{t('sales_form_category')} *</label>
                    <div className="sales_radio_row">
                      <label className="sales_radio">
                        <input type="radio" name="category" value="product" required defaultChecked />
                        <span>{t('sales_cat_product_brand')}</span>
                      </label>
                      <label className="sales_radio">
                        <input type="radio" name="category" value="partnership" />
                        <span>{t('sales_cat_partnership')}</span>
                      </label>
                      <label className="sales_radio">
                        <input type="radio" name="category" value="general" />
                        <span>{t('sales_cat_product_sponsorship')}</span>
                      </label>
                      <label className="sales_radio">
                        <input type="radio" name="category" value="sponsor" />
                        <span>{t('sales_cat_corporate_general')}</span>
                      </label>
                    </div>
                  </div>

                  <div className="pf_field">
                    <label htmlFor="content">{t('sales_form_content')} *</label>
                    <textarea
                      id="content"
                      name="content"
                      required
                      rows={8}
                      maxLength={5000}
                      placeholder={t('sales_form_content_ph')}
                    />
                  </div>

                  <div className="pf_field">
                    <label htmlFor="attachment">{t('sales_form_attach')} *</label>
                    <div className="sales_file_row">
                      <input
                        id="attachment_label"
                        name="attachment_label"
                        type="text"
                        readOnly
                        placeholder={t('sales_form_attach_ph')}
                        className="sales_file_display"
                      />
                      <label htmlFor="attachment" className="sales_file_btn">{t('sales_form_file_btn')}</label>
                      <input id="attachment" name="attachment" type="file" style={{ display: 'none' }} />
                    </div>
                  </div>
                </section>

                {/* ===== STEP 03 ===== */}
                <section className="sales_step">
                  <div className="sales_step_head">
                    <span className="sales_step_no">STEP 03</span>
                    <h3 className="sales_step_title">{t('sales_step3_title')}</h3>
                  </div>

                  <details className="sales_terms" open>
                    <summary className="sales_terms_summary">
                      <span className="sales_terms_check_icon" aria-hidden="true">✓</span>
                      <span className="sales_terms_title">{t('sales_privacy_agree')}</span>
                      <span className="sales_terms_required">{t('sales_privacy_required')}</span>
                      <span className="sales_terms_arrow" aria-hidden="true">⌃</span>
                    </summary>
                    <div className="sales_terms_body">
                      <p>{t('sales_privacy_p1')}</p>
                      <p>{t('sales_privacy_p2')}</p>
                      <p>{t('sales_privacy_p3')}</p>
                    </div>
                  </details>

                  <label className="pf_checkbox sales_terms_agree">
                    <input type="checkbox" name="privacy_agreed" required />
                    <span>{t('sales_privacy_agree')} *</span>
                  </label>
                </section>

                <div className="pf_actions sales_actions">
                  <button type="submit" className="pf_submit sales_submit">{t('sales_submit')}</button>
                </div>
              </form>
            )}
          </div>
          <NextSectionLink isLast />
        </div>

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
  const href = '/contact' + (params.toString() ? `?${params.toString()}` : '') + '#contact';
  if (disabled) {
    return <span className="inquiry_page_btn is_disabled" aria-disabled="true">{children}</span>;
  }
  return (
    <Link href={href} className={`inquiry_page_btn${active ? ' is_active' : ''}`}>
      {children}
    </Link>
  );
}
