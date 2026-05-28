/**
 * 소개 (About) — 원페이지 형태.
 * 인사말 / 회사연혁 / 주요 사업 / 조직도 / 오시는길 5개 섹션을 단일 페이지에
 * 스택. 각 섹션 상단에 SectionHeader (이전 작게 / 현재 BIG / 다음 작게) 배치.
 * 항목 클릭 시 anchor 스크롤.
 *
 * 기존 /about/greeting, /about/history, /business/area, /about/organization,
 * /about/location 페이지는 그대로 유지 (직접 링크 호환). 이 페이지는 그들의
 * 컨텐츠를 통합한 인덱스 페이지.
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';
import SideNav from '@/components/SideNav';
import { nl2br } from '@/lib/nl2br';
import { getSupabase } from '@/lib/supabase';
import '@/styles/sub.css';
import '@/styles/business_area.css';
import '@/styles/about_organization.css';
import '@/styles/about_location.css';

const STATS = [1, 2, 3, 4] as const;
const AREAS = [1, 2, 3, 4] as const;
const PERIODS = [
  { id: 'p1', label: 'NOW ~ 2022', start: 2022, end: 9999 },
  { id: 'p2', label: '2021 ~ 2017', start: 2017, end: 2021 },
  { id: 'p3', label: '2016 ~ 2012', start: 2012, end: 2016 },
  { id: 'p4', label: '2011 ~ 2009', start: 2009, end: 2011 },
];

const ORG_CHART_BY_LOCALE: Record<string, string> = {
  ko: '/images/sub/org-chart-v3.png',
  en: '/images/sub/org-chart-en.png',
  zh: '/images/sub/org-chart-zh.png',
};

export const revalidate = 0;

type HistoryDataItem = { year: string; list: Array<{ month: string; content: string }> };
type HistoryListItem = { year: string; contents: string[] };

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // ---- 회사연혁 데이터 (Supabase 우선, 실패 시 i18n fallback) ----
  const byYear: Record<string, string[]> = {};
  try {
    const supabase = getSupabase();
    const { data: entries } = await supabase
      .from('history_entries')
      .select('year, month, title, sort_order')
      .order('year', { ascending: false })
      .order('sort_order', { ascending: true });
    if (entries && entries.length > 0) {
      for (const e of entries as Array<{ year: number; title: string }>) {
        const y = String(e.year);
        byYear[y] = (byYear[y] ?? []).concat(e.title);
      }
    }
  } catch {
    /* fallback below */
  }
  if (Object.keys(byYear).length === 0) {
    const data = (t.raw('history_data') ?? []) as HistoryDataItem[];
    const list = (t.raw('history_list') ?? []) as HistoryListItem[];
    for (const item of data) byYear[item.year] = (byYear[item.year] ?? []).concat(item.list.map((x) => x.content));
    for (const item of list) byYear[item.year] = (byYear[item.year] ?? []).concat(item.contents);
  }
  const sortedYears = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  // ---- 조직도 ----
  const orgChartSrc =
    (t.raw('org_chart_image') as string | undefined) ?? ORG_CHART_BY_LOCALE[locale] ?? ORG_CHART_BY_LOCALE.ko;

  // ---- 오시는길 지도 URLs ----
  const mapHl = locale === 'zh' ? 'zh-CN' : locale;
  const factoryMapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(t('loc_factory_addr'))}&hl=${encodeURIComponent(mapHl)}&z=16&output=embed`;
  const centerMapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(t('loc_center_addr'))}&hl=${encodeURIComponent(mapHl)}&z=16&output=embed`;

  const sections = [
    { id: 'greeting', label: t('sub_greeting') },
    { id: 'history', label: t('sub_history') },
    { id: 'area', label: t('sub_biz_area') },
    { id: 'organization', label: t('sub_org') },
    { id: 'location', label: t('sub_location') },
  ];

  return (
    <main id="sub_contents" className="about_onepage onepage_layout">
      <SideNav sections={sections} category={t('menu_about')} />

      <div className="onepage_content">

      {/* ===== 1. 인사말 ===== */}
      <div id="greeting">
        <section className="ceo_intro_section">
          <div className="ceo_inner">
            <div className="ceo_main_group">
              <span className="ceo_tag">{t('greeting_ceo_intro')}</span>
              <div className="ceo_content_group">
                <div className="ceo_main_title">
                  <h3 className="light">{t('greeting_hello_1')}</h3>
                  <h3 className="bold">{t('greeting_hello_2')}</h3>
                </div>
                <p className="ceo_desc">{nl2br(t('greeting_ceo_text'))}</p>
              </div>
            </div>
            <div className="ceo_signature">
              <span className="ceo_label">{t('greeting_ceo_label')}</span>
              <strong className="ceo_name">{t('greeting_ceo_name')}</strong>
            </div>
          </div>
        </section>
      </div>

      {/* ===== 2. 회사연혁 ===== */}
      <div id="history">
        <section className="new_history_section">
          <div className="sub_inner">
            <div className="new_history_container">
              <div className="history_main">
                {PERIODS.map((p) => (
                  <div key={p.id} id={p.id} className="period_group">
                    <h3 className="period_title">{p.label}</h3>
                    <div className="period_content">
                      {sortedYears
                        .filter((y) => Number(y) >= p.start && Number(y) <= p.end)
                        .map((year) => (
                          <div key={year} className="year_item">
                            <h4 className="year_tit">{year}</h4>
                            <ul className="year_details">
                              {byYear[year].map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ===== 3. 주요 사업 ===== */}
      <div id="area">
        <section className="biz_overview_section">
          <div className="sub_inner biz_ov_inner">
            <div className="ov_left">
              <span className="ov_cate">{t('biz_ov_cate')}</span>
              <h3 className="ov_title">
                <span className="ov_line ov_line--bold">{t('biz_ov_line1')}</span>
                <span className="ov_line ov_line--light">{t('biz_ov_line2')}</span>
                <span className="ov_line ov_line--light">{t('biz_ov_line3')}</span>
              </h3>
            </div>
            <div className="ov_right">
              <div className="stat_grid">
                {STATS.map((n) => (
                  <div key={n} className="stat_item">
                    <div className="stat_label">
                      <img src={`/images/sub/bus-icon${n}.png`} alt="icon" />
                      <span>{t(`biz_stat_label${n}`)}</span>
                    </div>
                    <div className="stat_value">
                      <strong>{t(`biz_stat_value${n}`)}</strong>
                      <span>{t(`biz_stat_unit${n}`)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="biz_area_detail_section">
          <div className="sub_inner biz_area_container">
            <div className="biz_area_header">
              <span className="area_cate">{t('biz_area_cate')}</span>
              <h2 className="area_title">{t('biz_area_title')}</h2>
            </div>
            <div className="biz_area_list">
              {AREAS.map((n) => (
                <div key={n} className={`area_item${n % 2 === 0 ? ' reverse' : ''}`}>
                  <div className="area_img" style={{ backgroundImage: `url('/images/sub/bus-img${n}.png')` }}></div>
                  <div className="area_text_wrap">
                    <div className="area_text_head">
                      <div className="area_label_row">
                        <span className="num">{t(`biz_item_num${n}`)}</span>
                        <span className="sub_ttl">{t(`biz_item_sub${n}`)}</span>
                      </div>
                      <h3 className="main_ttl">{t(`biz_item_ttl${n}`)}</h3>
                    </div>
                    <p className="desc">{nl2br(t(`biz_item_desc${n}`))}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ===== 4. 조직도 ===== */}
      <div id="organization">
        <section className="org_content_section">
          <div className="org_container">
            <div className="org_chart_wrap">
              <div className="org_chart_image_wrap">
                <img src={orgChartSrc} alt={t('org_title')} className="org_chart_image" loading="lazy" />
              </div>
            </div>
            <div className="org_bg_typo">{t('org_bg_text')}</div>
          </div>
        </section>
      </div>

      {/* ===== 5. 오시는길 ===== */}
      <div id="location">
        <section className="location_content_section">
          <div className="sub_inner location_inner">
            {/* 본사·공장 */}
            <div className="location_row">
              <div className="map_area">
                <iframe
                  src={factoryMapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('loc_map_factory_alt')}
                />
              </div>
              <div className="info_area">
                <div className="loc_heading">
                  <span className="loc_cate">{t('loc_way_to_come')}</span>
                  <h3 className="loc_name">{t('loc_factory_title')}</h3>
                </div>
                <ul className="loc_detail_list">
                  <li className="loc_detail_row">
                    <span className="label">{t('loc_factory_addr_label')}</span>
                    <span className="loc_pipe" aria-hidden="true"></span>
                    <p className="content">{t('loc_factory_addr')}</p>
                  </li>
                  <li className="loc_detail_row loc_detail_row--tel">
                    <span className="label">{t('loc_factory_tel_label')}</span>
                    <span className="loc_pipe" aria-hidden="true"></span>
                    <div className="loc_tel_wrap">
                      <span className="loc_tel_item">{t('loc_tel_quality')}</span>
                      <span className="loc_tel_item">{t('loc_tel_sales')}</span>
                      <span className="loc_tel_item">{t('loc_tel_purchase')}</span>
                      <span className="loc_tel_item">{t('loc_tel_rd')}</span>
                      <span className="loc_tel_item">{t('loc_tel_mgmt')}</span>
                    </div>
                  </li>
                  <li className="loc_detail_row">
                    <span className="label">{t('loc_factory_fax_label')}</span>
                    <span className="loc_pipe" aria-hidden="true"></span>
                    <p className="content">{t('loc_factory_fax')}</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* 물류센터 */}
            <div className="location_row location_row--center">
              <div className="map_area">
                <iframe
                  src={centerMapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('loc_center_title')}
                />
              </div>
              <div className="info_area">
                <div className="loc_heading">
                  <span className="loc_cate">{t('loc_way_to_come')}</span>
                  <h3 className="loc_name">{t('loc_center_title')}</h3>
                </div>
                <ul className="loc_detail_list">
                  <li className="loc_detail_row">
                    <span className="label">{t('loc_factory_addr_label')}</span>
                    <span className="loc_pipe" aria-hidden="true"></span>
                    <p className="content">{t('loc_center_addr')}</p>
                  </li>
                  <li className="loc_detail_row">
                    <span className="label">{t('loc_factory_tel_label')}</span>
                    <span className="loc_pipe" aria-hidden="true"></span>
                    <p className="content">{t('loc_center_tel')}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      </div>
    </main>
  );
}
