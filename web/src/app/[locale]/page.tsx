import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import HeroSwiper from '@/components/HeroSwiper';
import MainScript from '@/components/MainScript';
import { nl2br } from '@/lib/nl2br';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/main.css';
import '@/styles/partners-carousel.css';
import 'swiper/css';

export const revalidate = 0;

type ProcTab = { tag: string; title: string; link: string; desc: string };
type ProdCategory = { name: string; link: string };
type ProdItem = {
  img: string;
  name: string;
  eng: string;
  desc: string;
  storage?: string;
  weight?: string;
  hide_meta?: boolean;
};
function productImageUrl(img: string) {
  if (img.startsWith('/') || /^https?:\/\//i.test(img)) return img;
  return `/images/main/${img}`;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const bizItems = t.raw('main_biz_items') as Array<{ title: string; desc: string }>;
  const procTabs = t.raw('main_proc_tabs') as ProcTab[];
  const prodCategories = t.raw('main_prod_categories') as ProdCategory[];
  const prodList = t.raw('main_prod_list') as Record<string, ProdItem[]>;
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

        <section className="business_section">
          <div className="business_inner">
            <div className="biz_header">
              <div className="title_group">
                <h2 className="biz_title">{nl2br(t('main_biz_title'))}</h2>
                <span className="biz_sub">{t('main_biz_sub')}</span>
              </div>
              <Link href="/about#area" className="biz_more_btn">
                <span>{t('main_biz_more')}</span>
                <ArrowIcon />
              </Link>
            </div>

            <div className="biz_grid">
              {bizItems.map((item, idx) => (
                <article
                  key={idx}
                  className="biz_card"
                  style={{ backgroundImage: `url('/images/main/biz-area-${idx + 1}.png')` }}
                >
                  <div className="card_text_area">
                    <h3 className="card_main_txt">{item.title}</h3>
                    <div className="card_sub_txt">{nl2br(item.desc)}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="process_section process_section--cards">
          <div className="process_inner">
            <div className="proc_card_grid">
              {procTabs.map((item, idx) => (
                <article key={idx} className="proc_card">
                  <div
                    className="proc_card_img"
                    style={{ backgroundImage: `url('/images/main/section4-${idx + 1}.png')` }}
                  >
                    {/* 더 알아보기 — 이미지 우측 상단 (사용자 요청, PC) */}
                    <Link href={item.link} className="proc_card_link proc_card_link--float">
                      <span>{t('common_more')}</span>
                      <ArrowIcon />
                    </Link>
                  </div>
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

        <section className="product_section">
          <div className="product_inner">
            <div className="prod_header">
              <h2 className="prod_title">{t('main_prod_title')}</h2>
              <span className="prod_sub">{t('main_prod_sub')}</span>
            </div>

            <div className="prod_nav_wrap">
              <div className="prod_categories">
                {prodCategories.map((cate, idx) => (
                  <button
                    key={cate.name}
                    type="button"
                    className={`prod_cate_btn${idx === 0 ? ' active' : ''}`}
                    data-cate={cate.name}
                    data-link={cate.link}
                  >
                    {cate.name}
                  </button>
                ))}
              </div>

              <a
                href={prodCategories[0]?.link ?? '#'}
                id="prod_more_link"
                className="prod_more_link"
              >
                <span>{t('main_prod_more_text')}</span>
                <ArrowIcon />
              </a>
            </div>

            <div className="prod_content">
              {Object.entries(prodList).map(([cateName, items]) => (
                <div
                  key={cateName}
                  className={`prod_grid${cateName === prodCategories[0]?.name ? ' active' : ''}`}
                  data-cate={cateName}
                >
                  {items.map((item, idx) => (
                    <div className="prod_card" key={idx}>
                      <div
                        className="prod_img"
                        style={{ backgroundImage: `url('${productImageUrl(item.img)}')` }}
                      ></div>
                      <div className="prod_info">
                        <div className="prod_name_group">
                          <h3 className="prod_name">{item.name}</h3>
                          <span className="prod_eng">{item.eng}</span>
                        </div>
                        <p className="prod_desc">{item.desc}</p>
                        {!item.hide_meta && (
                          <div className="prod_meta">
                            <span className="meta_label">{t('main_prod_label_storage')}</span>
                            <span className="meta_val highlight">{item.storage}</span>
                            <i className="v_line"></i>
                            <span className="meta_label">{t('main_prod_label_package')}</span>
                            <span className="meta_val highlight">{item.weight}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
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
              <div className="notice_title_group">
                <h2 className="notice_title">{t('main_notice_title')}</h2>
                <span className="notice_sub">{t('main_notice_sub')}</span>
              </div>
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
