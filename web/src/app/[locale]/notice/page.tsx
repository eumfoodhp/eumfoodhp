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
    .select('id, title, category, is_pinned, view_count, created_at, file_url')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(NOTICE_LIMIT);

  const { data: presses } = await supabase
    .from('press_releases')
    .select('id, title, source, thumbnail, view_count, created_at')
    .order('created_at', { ascending: false })
    .limit(PRESS_LIMIT);

  const { data: heroData } = await supabase
    .from('press_releases')
    .select('id, title, thumbnail, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  const heroItems = heroData ?? [];

  return (
    <main id="sub_contents" className="newsroom_onepage onepage_story">
      <div className="onepage_content">

        {/* ===== 1. 공지사항 ===== */}
        <div id="notice" className="story_section">
          <SectionHeader title={t('sub_notice')} en="Notice" />

          {(!notices || notices.length === 0) ? (
            <div className="sub_inner board_empty">{t('board_empty_notice')}</div>
          ) : (
            <div className="sub_inner">
              <ul className="board_line_list">
                {notices.map((n, idx) => (
                  <li key={n.id} className="row">
                    <Link href={`/notice/${n.id}` as never}>
                      <span className={`col_no${n.is_pinned ? ' pinned' : ''}`}>
                        {n.is_pinned ? t('label_notice_pinned') : `No.${notices.length - idx}`}
                      </span>
                      <span className="col_title">{n.title}</span>
                      <span className="col_chip_wrap">
                        {n.file_url && (
                          <span className="col_chip">
                            <DownloadIcon />
                            <span>{t('btn_download')}</span>
                          </span>
                        )}
                      </span>
                      <span className="col_date">
                        {new Date(n.created_at).toLocaleDateString(locale).replace(/\. /g, '.').replace(/\.$/, '')}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <NextSectionLink prevId="notice" nextId="press" nextLabel={t('sub_news_press')} />
        </div>

        {/* ===== 2. 보도자료 ===== */}
        <div id="press" className="story_section">
          <SectionHeader title={t('sub_news_press')} en="Press" />

          <div className="sub_inner">
            {heroItems.length > 0 && <PressHeroSlider items={heroItems} />}

            {(!presses || presses.length === 0) ? (
              <div className="board_empty">{t('board_empty_press')}</div>
            ) : (
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
                        <span className="date">
                          {new Date(p.created_at).toLocaleDateString(locale).replace(/\. /g, '.').replace(/\.$/, '')}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <NextSectionLink isLast />
        </div>

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
function ImagePlaceholderIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
