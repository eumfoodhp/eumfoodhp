/**
 * 소식 (Newsroom) — 원페이지 형태.
 * 공지사항 + 보도자료 2개 섹션을 단일 페이지에 스택.
 * 각 섹션 상단에 story_section_head, 사이에 NextSectionLink.
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import NextSectionLink from '@/components/NextSectionLink';
import SectionHeader from '@/components/SectionHeader';
import PressHeroSlider from '@/components/PressHeroSlider';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/sub.css';
import '@/styles/board_pages.css';
import '@/styles/inquiry-sales-forms.css';

export const revalidate = 0;

const NOTICE_LIMIT = 10;
const PRESS_LIMIT = 9;

export default async function NewsroomOnePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const supabase = await createServerSupabase();

  const { data: notices } = await supabase
    .from('notices')
    .select('id, title, category, is_pinned, view_count, created_at, attachments')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(NOTICE_LIMIT);

  const { data: presses, count: pressCount } = await supabase
    .from('press_releases')
    .select('id, title, source, thumbnail, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(PRESS_LIMIT);

  // hero 슬라이더용 — 최신 5개 (featured)
  const heroItems = (presses ?? []).slice(0, 5);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString(locale).replace(/\. /g, '.').replace(/\.$/, '');

  return (
    <main id="sub_contents" className="newsroom_onepage onepage_story">
      <div className="onepage_content">

        {/* ===== 1. 공지사항 ===== 문의 페이지 테이블 UI 통일 */}
        <div id="notice" className="story_section">
          <SectionHeader title={t('sub_notice')} en="Notice" />

          <div className="sub_inner">
            <table className="inquiry_table">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>{t('contact_col_no')}</th>
                  <th>{t('contact_col_title')}</th>
                  <th style={{ width: 150 }}>{t('contact_col_date')}</th>
                </tr>
              </thead>
              <tbody>
                {!notices || notices.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="inquiry_table_empty">{t('board_empty_notice')}</td>
                  </tr>
                ) : (
                  notices.map((n, idx) => (
                    <tr key={n.id}>
                      <td>{n.is_pinned ? t('label_notice_pinned') : `No.${notices.length - idx}`}</td>
                      <td className="inquiry_table_title">
                        <Link href={`/notice/${n.id}` as never}>{n.title}</Link>
                      </td>
                      <td>{fmtDate(n.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <NextSectionLink prevId="notice" nextId="press" nextLabel={t('sub_news_press')} />
        </div>

        {/* ===== 2. 보도자료 ===== 카드 형태 (hero + Total + 그리드) */}
        <div id="press" className="story_section">
          <SectionHeader title={t('sub_news_press')} en="Press" />

          <div className="sub_inner">
            {(!presses || presses.length === 0) ? (
              <div className="board_empty">{t('board_empty_press')}</div>
            ) : (
              <>
                {/* 상단 featured hero 슬라이더 */}
                {heroItems.length > 0 && <PressHeroSlider items={heroItems} />}

                {/* Total 개수 툴바 */}
                <div className="board_toolbar">
                  <span className="total">Total<b>{pressCount ?? presses.length}</b></span>
                  <span className="spacer" />
                </div>

                {/* 카드 그리드 */}
                <ul className="board_grid">
                  {presses.map((p) => (
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
                          <span className="date">{fmtDate(p.created_at)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <NextSectionLink isLast />
        </div>

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
