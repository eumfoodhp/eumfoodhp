import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';

import { Link } from '@/i18n/navigation';
import HeroSwiper from '@/components/HeroSwiper';
import { nl2br } from '@/lib/nl2br';
import '@/styles/main.css';
import 'swiper/css';

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
type DirTab = {
  name: string;
  addr_label: string;
  address: string;
  phone_label: string;
  phones: Record<string, string>;
  fax_label: string;
  fax: string;
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
  const partners = t.raw('main_partner_logos') as Array<{ img: string }>;
  const dirTabs = t.raw('main_dir_tabs') as Record<string, DirTab>;

  const mapFactorySrc =
    locale === 'en'
      ? '/images/main/en1.png'
      : locale === 'zh'
      ? '/images/main/zh1.png'
      : '/images/main/map_ko_factory.png';

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
                <span className="ov_sub">{t('main_ov_sub')}</span>

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

                <div className="ov_bottom_group">
                  <p className="ov_desc">{nl2br(t('main_ov_desc'))}</p>
                  <Link href="/about/greeting" className="ov_more_btn">
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
                <span className="biz_sub">{t('main_biz_sub')}</span>
                <h2 className="biz_title">{t('main_biz_title')}</h2>
              </div>
              <Link href="/business/area" className="biz_more_btn">
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

        <section className="process_section">
          <div className="process_inner">
            <div className="proc_img_box">
              {procTabs.map((_, i) => (
                <img
                  key={i}
                  src={`/images/main/section4-${i + 1}.png`}
                  alt="process"
                  className={`proc_img${i === 0 ? ' active' : ''}`}
                  data-proc={i + 1}
                />
              ))}
            </div>

            <div className="proc_info_box">
              <div className="proc_text_content">
                {procTabs.map((item, idx) => (
                  <div
                    key={idx}
                    className={`proc_info_group${idx === 0 ? ' active' : ''}`}
                    data-proc={idx + 1}
                  >
                    <div className="proc_title_wrap">
                      <span className="proc_tag">{item.tag}</span>
                      <h2 className="proc_title">{nl2br(item.title)}</h2>
                    </div>
                  </div>
                ))}

                <div className="proc_tabs">
                  {procTabs.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`proc_tab_btn${idx === 0 ? ' active' : ''}`}
                      data-proc={idx + 1}
                      data-link={item.link}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="proc_desc_wrap">
                  {procTabs.map((item, idx) => (
                    <p
                      key={idx}
                      className={`proc_desc${idx === 0 ? ' active' : ''}`}
                      data-proc={idx + 1}
                    >
                      {item.desc}
                    </p>
                  ))}
                </div>
              </div>

              <Link href="/business/area" id="proc_more_btn" className="proc_more_btn">
                <span>{t('common_more')}</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        <section className="product_section">
          <div className="product_inner">
            <div className="prod_header">
              <span className="prod_sub">{t('main_prod_sub')}</span>
              <h2 className="prod_title">{t('main_prod_title')}</h2>
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

        <section className="partner_section">
          <div className="partner_inner">
            <div className="partner_text_box">
              <span className="partner_sub">{t('main_partner_sub')}</span>
              <h2 className="partner_title">{nl2br(t('main_partner_title'))}</h2>
            </div>

            <div className="partner_logo_area">
              <div className="logo_track to_left">
                <div className="logo_list">
                  {partners.concat(partners).map((p, i) => (
                    <div key={`l-${i}`} className="partner_item">
                      <img src={`/images/common/${p.img}`} alt="" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="logo_track to_right">
                <div className="logo_list">
                  {[...partners].reverse().concat([...partners].reverse()).map((p, i) => (
                    <div key={`r-${i}`} className="partner_item">
                      <img src={`/images/common/${p.img}`} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="notice_section">
          <div className="notice_inner">
            <div className="notice_header">
              <div className="notice_title_group">
                <span className="notice_sub">{t('main_notice_sub')}</span>
                <h2 className="notice_title">{t('main_notice_title')}</h2>
              </div>
              <Link href="/notice" className="notice_more_link">
                <span>{t('main_notice_more')}</span>
                <ArrowIcon />
              </Link>
            </div>

            <div className="notice_content">
              {/* DB 미연결 — 일단 빈 카드 3개 (마이그레이션 시 채워짐) */}
              {[0, 1, 2].map((i) => (
                <div key={i} className="notice_card notice_card_empty">
                  <div className="card_img card_img_empty"></div>
                  <div className="card_info">
                    <div className="card_top_group">
                      <div className="card_cate_group" style={{ opacity: 0.3 }}>
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                          <circle cx="3" cy="3" r="3" fill="#ddd" />
                        </svg>
                        <span className="card_cate" style={{ color: '#ccc' }}>
                          {t('main_notice_coming')}
                        </span>
                      </div>
                      <h3
                        className="card_title"
                        style={{ color: '#ccc', textAlign: 'center' }}
                      >
                        {t('main_notice_none')}
                      </h3>
                    </div>
                    <span className="card_date" style={{ color: '#eee' }}>
                      0000.00.00
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="direction_section">
          <img
            src={mapFactorySrc}
            alt={t('main_dir_title')}
            className="dir_bg_map"
            id="dir_map_img"
            data-map-factory={mapFactorySrc}
          />

          <div className="direction_inner">
            <div className="dir_content_area">
              <div className="dir_header">
                <span className="dir_sub">{t('main_dir_sub')}</span>
                <h2 className="dir_title">{t('main_dir_title')}</h2>
                <p className="dir_desc">{t('main_dir_desc')}</p>
              </div>

              <div className="dir_tabs">
                <button type="button" className="dir_tab_btn active" data-dir="factory">
                  {dirTabs.factory?.name}
                </button>
              </div>

              <div className="dir_info_box">
                {Object.entries(dirTabs).map(([key, info]) => (
                  <div
                    key={key}
                    className={`dir_detail_group${key === 'factory' ? ' active' : ''}`}
                    data-dir={key}
                  >
                    <div className="detail_item">
                      <span className="detail_label">{info.addr_label}</span>
                      <p className="detail_val">{info.address}</p>
                    </div>
                    <div className="detail_item">
                      <span className="detail_label">{info.phone_label}</span>
                      <div className="detail_val phone_grid">
                        {Object.entries(info.phones).map(([pName, pNum]) => (
                          <span key={pName}>
                            {pName} : {pNum}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="detail_item">
                      <span className="detail_label">{info.fax_label}</span>
                      <p className="detail_val">{info.fax}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Script src="/js/main.js" strategy="afterInteractive" />
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
