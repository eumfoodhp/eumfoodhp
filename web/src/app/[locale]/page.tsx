import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import HeroSwiper from '@/components/HeroSwiper';
import MainScript from '@/components/MainScript';
import RevealOnScroll from '@/components/RevealOnScroll';
import { nl2br } from '@/lib/nl2br';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/main.css';
import '@/styles/partners-carousel.css';
import 'swiper/css';

export const revalidate = 0;

type ProcTab = { tag: string; title: string; link: string; desc: string };

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const procTabs = t.raw('main_proc_tabs') as ProcTab[];
  const partners = t.raw('main_partner_logos') as Array<{ img: string; name: string }>;
  // dirTabs / DirTab / mapFactorySrc 제거 — 지도 섹션 통째로 footer 로 이관됨.

  // ---- 소식 섹션: 공지사항 2 + 보도자료 2 (Supabase 실데이터) ----
  type NewsCard = { label: string; title: string; date: string; href: string; img: number };
  let newsCards: NewsCard[] = [];
  try {
    const supabase = await createServerSupabase();
    const [{ data: notices }, { data: presses }] = await Promise.all([
      supabase.from('notices').select('id, title, created_at').order('created_at', { ascending: false }).limit(2),
      supabase.from('press_releases').select('id, title, created_at').order('created_at', { ascending: false }).limit(2),
    ]);
    const fmt = (s: string) => new Date(s).toLocaleDateString(locale).replace(/\. /g, '.').replace(/\.$/, '');
    const noticeCards: NewsCard[] = (notices ?? []).map((n, i) => ({
      label: t('sub_notice'), title: n.title, date: fmt(n.created_at), href: '/notice#notice', img: (i % 3) + 1,
    }));
    const pressCards: NewsCard[] = (presses ?? []).map((p, i) => ({
      label: 'NEWS', title: p.title, date: fmt(p.created_at), href: '/notice#press', img: ((i + 2) % 3) + 1,
    }));
    newsCards = [...noticeCards, ...pressCards];
  } catch {
    /* DB 실패 시 빈 배열 → 섹션 카드 미노출 */
  }

  return (
    <>

      <main id="main">
        <section className="hero_section">
          <HeroSwiper />
          <div className="hero_inner">
            <div className="hero_title_group">
              <div className="hero_section_title">
                <p className="hero_brand">{t('main_hero_brand')}</p>
                <h2 className="main_title hero_headline">
                  <span className="hero_line">{t('main_hero_sub')}</span>
                  <span className="hero_line">{t('main_hero_title')}</span>
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="overview_section">
          <div className="sticky_wrapper">
            <div
              className="ov_bg_box ov_after"
              style={{ backgroundImage: "url('/images/main/overview_handshake.png')" }}
            ></div>

            <div className="ov_content">
              <div className="ov_stack">
                <div className="ov_hero_row">
                  <div className="ov_title_wrap">
                    <div className="ov_title_cell ov_title_cell--left">
                      <h2 className="ov_title left">{t('main_ov_title_1')}</h2>
                    </div>
                    <div className="ov_hex_cell">
                      <div className="ov_hex">
                        <img src="/images/main/overview_handshake.png" alt="" />
                      </div>
                    </div>
                    <div className="ov_title_cell ov_title_cell--right">
                      <h2 className="ov_title right">{t('main_ov_title_2')}</h2>
                    </div>
                  </div>
                </div>

                <span className="ov_sub">{t('main_ov_sub')}</span>

                <div className="ov_bottom_group">
                  <p className="ov_desc">{nl2br(t('main_ov_desc'))}</p>
                  <Link href="/about#greeting" className="ov_more_btn">
                    <span>{t('main_ov_more')}</span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="process_section process_section--cards">
          <div className="process_inner">
            <div className="proc_cards_head">
              <Link href="/about#area" className="proc_cards_more">
                <span>{t('common_more')}</span>
                <ArrowIcon />
              </Link>
            </div>
            <div className="proc_card_grid">
              {procTabs.map((item, idx) => (
                <article key={idx} className="proc_card">
                  {/* 사진 안 '더 알아보기' float 버튼 제거 (사용자 요청) — 카드 제목 링크로 이동 */}
                  <div
                    className="proc_card_img"
                    style={{ backgroundImage: `url('/images/main/section4-${idx + 1}.png')` }}
                  ></div>
                  <div className="proc_card_body">
                    <h3 className="proc_card_title">
                      <Link href={item.link} className="proc_card_title_link">
                        {nl2br(item.title)}
                      </Link>
                    </h3>
                    <p className="proc_card_desc">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="product_section product_gallery">
          <RevealOnScroll className="gallery_reveal">
          <div className="product_inner">
            <div className="product_gallery_head">
              <h2 className="product_gallery_title">{nl2br(t('main_prod_gallery_title'))}</h2>
              <p className="product_gallery_desc">{t('main_prod_gallery_desc')}</p>
            </div>
          </div>

          {/* 제품 — goods1~9 9장 1줄 가로 마퀴 (사용자 요청) */}
          <div className="prod_marquee prod_marquee--single">
            {(() => {
              const goods = Array.from({ length: 9 }, (_, i) => `/images/main/goods${i + 1}.png`);
              return (
                <div className="prod_marquee_row is-ltr">
                  <div className="prod_marquee_track">
                    {[...goods, ...goods].map((src, i) => {
                      const dup = i >= goods.length;
                      return (
                        <Link
                          key={i}
                          href="/products"
                          className="marquee_tile"
                          aria-hidden={dup || undefined}
                          tabIndex={dup ? -1 : undefined}
                        >
                          <div
                            className="marquee_img"
                            style={{ backgroundImage: `url('${src}')` }}
                          ></div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            </div>

          <div className="product_gallery_more">
            <Link href="/products" className="proc_cards_more">
              <span>{t('common_more')}</span>
              <ArrowIcon />
            </Link>
          </div>
          </RevealOnScroll>
        </section>

        <section className="partner_section partner_section--3d">
          <div className="partner_inner">
            <div className="partner_text_box">
              <h2 className="partner_title">{nl2br(t('main_partner_title'))}</h2>
              <span className="partner_sub">{t('main_partner_sub')}</span>
            </div>

            <div className="carousel_stage">
              {/* 바닥 가상 궤도 가이드 — 깊이감용 점선 원 */}
              <div className="orbit_guide" aria-hidden="true"></div>

              {/* 9개 카드가 원형 배치된 링 — 자동 회전, hover 시 정지 */}
              <div className="carousel_ring">
                {partners.slice(0, 9).map((p, i) => {
                  // 카드 합성 이미지: p_card_01.jpg ~ p_card_09.jpg (사용자가 추가)
                  const cardIndex = String(i + 1).padStart(2, '0');
                  const cardUrl = `/images/common/p_card_${cardIndex}.jpg`;
                  return (
                    <div
                      key={p.img}
                      className="carousel_card"
                      style={{ ['--i' as never]: i }}
                      role="group"
                      aria-label={p.name}
                    >
                      <img
                        src={cardUrl}
                        alt={p.name}
                        className="card_image"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="notice_section">
          <div className="notice_inner">
            <div className="notice_header">
              {/* 소식/NOTICE 제목 텍스트 삭제 (사용자 요청) — 더보기 링크만 우측 유지 */}
              <Link href="/notice" className="notice_more_link">
                <span>{t('main_notice_more')}</span>
                <ArrowIcon />
              </Link>
            </div>

            <div className="notice_content">
              {/* 공지 2 + 보도 2 — Supabase 실데이터 (newsCards). 없으면 미노출. */}
              {newsCards.map((item, i) => (
                <Link key={i} href={item.href as never} className="notice_card_link">
                  <article className="notice_card">
                    <div
                      className="card_img"
                      style={{ backgroundImage: `url('/images/main/ex${item.img}.png')` }}
                    ></div>
                    <div className="card_info">
                      <div className="card_top_group">
                        <div className="card_cate_group">
                          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                            <circle cx="3" cy="3" r="3" fill="#FF5D27" />
                          </svg>
                          <span className="card_cate">{item.label}</span>
                        </div>
                        <p className="card_title">{item.title}</p>
                      </div>
                      <span className="card_date">{item.date}</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 지도 섹션 통째 footer 로 이동 — 페이지 하단 정리 */}
      </main>

      <MainScript />
    </>
  );
}

function ArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
