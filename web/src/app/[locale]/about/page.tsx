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
import NextSectionLink from '@/components/NextSectionLink';
import SectionHeader from '@/components/SectionHeader';
import HistoryTimeline from '@/components/HistoryTimeline';
import { nl2br } from '@/lib/nl2br';
import { getSupabase } from '@/lib/supabase';
import '@/styles/sub.css';
import '@/styles/board_pages.css';
import '@/styles/business_area.css';
import '@/styles/about_organization.css';
import '@/styles/about_location.css';
import '@/styles/about_history.css';

const STATS = [1, 2, 3, 4] as const;
const AREAS = [1, 2, 3, 4] as const;
// HistoryTimeline 은 PERIODS 사용 안 함 (전체 연도를 한 흐름으로 보여줌)

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

  // ---- 오시는길 — QR/지도 검색어를 주소 대신 회사 상호로 변경 ----
  //   첫번째 카드: "이음푸드시스템", 두번째 카드: "화산푸드시스템"
  // 지도/QR/외부링크 검색 쿼리 — 회사 상호만으로 매칭.
  const factoryQuery = '이음푸드시스템';
  const centerQuery = '화산푸드시스템';
  const factoryAddr = t('loc_factory_addr'); // 표시용
  const centerAddr = t('loc_center_addr');   // 표시용

  // (지도 이미지 클릭 링크는 사용자 요청으로 제거 — QR 코드만 유지)

  // QR 코드 (qrserver.com 동적 생성)
  const qr = (url: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=${encodeURIComponent(url)}`;
  const factoryQR = {
    tmap: qr(`https://tmap.life/?q=${encodeURIComponent(factoryQuery)}`),
    kakao: qr(`https://map.kakao.com/?q=${encodeURIComponent(factoryQuery)}`),
    naver: qr(`https://map.naver.com/p/search/${encodeURIComponent(factoryQuery)}`),
  };
  const centerQR = {
    tmap: qr(`https://tmap.life/?q=${encodeURIComponent(centerQuery)}`),
    kakao: qr(`https://map.kakao.com/?q=${encodeURIComponent(centerQuery)}`),
    naver: qr(`https://map.naver.com/p/search/${encodeURIComponent(centerQuery)}`),
  };

  const sections = [
    { id: 'greeting', label: t('sub_greeting') },
    { id: 'history', label: t('sub_history') },
    { id: 'area', label: t('sub_biz_area') },
    { id: 'organization', label: t('sub_org') },
    { id: 'location', label: t('sub_location') },
  ];

  return (
    <main id="sub_contents" className="about_onepage onepage_story">
      <div className="onepage_content">

      {/* ===== 1. 인사말 ===== */}
      <div id="greeting" className="story_section">
        <SectionHeader title={t('sub_greeting')} en="Greeting" />
        <section className="ceo_intro_section">
          <div className="ceo_inner">
            <div className="ceo_main_group">
              {/* ceo_tag (CEO Introduce 영문 eyebrow) 제거 (사용자 요청) */}
              <div className="ceo_content_group">
                <div className="ceo_main_title">
                  {/* '안녕하십니까' 한 줄만 (회사명/대표 부분 제거 — 사용자 요청) */}
                  <h3 className="bold">{t('greeting_hello_1')}</h3>
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
        <NextSectionLink prevId="greeting" nextId="history" nextLabel={t('sub_history')} />
      </div>

      {/* ===== 2. 회사연혁 — 세로 탭 + 연도 카드 그리드 ===== */}
      <div id="history" className="story_section">
        <SectionHeader title={t('sub_history')} en="History" />
        <HistoryTimeline byYear={byYear} sortedYears={sortedYears} />
        <NextSectionLink prevId="greeting" nextId="area" nextLabel={t('sub_biz_area')} />
      </div>

      {/* ===== 3. 주요 사업 ===== */}
      <div id="area" className="story_section">
        <SectionHeader title={t('sub_biz_area')} en="Business" />
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
                      {n === 4 ? (
                        <span>
                          HACCP
                          <span className="stat_label_extra"> 인증현황</span>
                        </span>
                      ) : (
                        <span>{t(`biz_stat_label${n}`)}</span>
                      )}
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
            {/* biz_area_header (Core Business / 주요 사업 텍스트) 제거 — 사용자 요청 */}
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
        <NextSectionLink prevId="history" nextId="organization" nextLabel={t('sub_org')} />
      </div>

      {/* ===== 4. 조직도 ===== */}
      <div id="organization" className="story_section">
        <SectionHeader title={t('sub_org')} en="Organization" />
        <section className="org_content_section">
          <div className="org_container">
            <div className="org_chart_wrap">
              <div className="org_chart" aria-label={t('org_title')}>
                {/* L1: 대표이사 + 우측 경리·회계·인사 분기 */}
                <div className="org_l1">
                  <div className="org_node org_node--ceo">{t('org_role_ceo')}</div>
                  <div className="org_node org_node--staff org_staff_right">
                    {t('org_staff_finance')}
                  </div>
                </div>

                {/* L2: 총괄이사 */}
                <div className="org_l2">
                  <div className="org_node org_node--director">{t('org_role_director')}</div>
                </div>

                {/* L3: 8개 부서 + L4 소속팀 */}
                <div className="org_l3">
                  <div className="org_dept_col">
                    <div className="org_node org_node--dept">{t('org_dept_production')}</div>
                    <div className="org_node org_node--sub">{t('org_sub_production_a')}</div>
                    <div className="org_node org_node--sub">{t('org_sub_production_b')}</div>
                  </div>
                  <div className="org_dept_col">
                    <div className="org_node org_node--dept">{t('org_dept_research')}</div>
                    <div className="org_node org_node--sub">{t('org_sub_rnd_dedicated')}</div>
                  </div>
                  <div className="org_dept_col">
                    <div className="org_node org_node--dept">{t('org_dept_planning')}</div>
                  </div>
                  <div className="org_dept_col">
                    <div className="org_node org_node--dept">{t('org_dept_purchase')}</div>
                    <div className="org_node org_node--sub">{t('org_sub_logistics')}</div>
                  </div>
                  <div className="org_dept_col">
                    <div className="org_node org_node--dept">{t('org_dept_safety')}</div>
                    <div className="org_node org_node--sub">
                      {t('org_sub_safety_law')} {t('org_sub_safety_mgmt')}
                    </div>
                  </div>
                  <div className="org_dept_col">
                    <div className="org_node org_node--dept">{t('org_dept_sales')}</div>
                  </div>
                  <div className="org_dept_col">
                    <div className="org_node org_node--dept">{t('org_dept_quality')}</div>
                    <div className="org_node org_node--sub">{t('org_sub_lab')}</div>
                  </div>
                  <div className="org_dept_col">
                    <div className="org_node org_node--dept">{t('org_dept_facility')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <NextSectionLink prevId="area" nextId="location" nextLabel={t('sub_location')} />
      </div>

      {/* ===== 5. 오시는길 ===== */}
      <div id="location" className="story_section">
        <SectionHeader title={t('sub_location')} en="Location" />
        <section className="location_content_section">
          <div className="sub_inner location_inner">
            {/* 본사·공장 — 지도 LEFT / 정보 RIGHT */}
            <article className="loc_card loc_card--map_left">
              <div className="loc_card_body">
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(factoryQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="loc_card_map"
                  aria-label={t('loc_map_factory_alt')}
                >
                  <img src="/images/sub/map_factory.png" alt={t('loc_map_factory_alt')} width={726} height={454} loading="lazy" />
                </a>
                <div className="loc_card_info">
                  <span className="loc_eyebrow">{t('loc_way_to_come')}</span>
                  <h3 className="loc_card_name">{t('loc_factory_title')}</h3>
                  <ul className="loc_card_meta">
                    <li className="loc_meta_row">
                      <span className="loc_meta_icon" aria-hidden="true"><PinIcon /></span>
                      <div className="loc_meta_text">
                        <p className="loc_meta_value">{t('loc_factory_addr')}</p>
                      </div>
                    </li>
                    <li className="loc_meta_row">
                      <span className="loc_meta_icon" aria-hidden="true"><PhoneIcon /></span>
                      <div className="loc_meta_text">
                        <div className="loc_meta_tel_grid">
                          <span>{t('loc_tel_quality')}</span>
                          <span>{t('loc_tel_sales')}</span>
                          <span>{t('loc_tel_mgmt')}</span>
                          <span>{t('loc_tel_purchase')}</span>
                          <span>{t('loc_tel_rd')}</span>
                        </div>
                      </div>
                    </li>
                    <li className="loc_meta_row">
                      <span className="loc_meta_icon" aria-hidden="true"><FaxIcon /></span>
                      <div className="loc_meta_text">
                        <p className="loc_meta_value">FAX. {t('loc_factory_fax')}</p>
                      </div>
                    </li>
                  </ul>
                  <div className="loc_qr_group">
                    {/* 티맵 QR 제거 (사용자 요청) */}
                    <a className="loc_qr_item" href={`https://map.kakao.com/?q=${encodeURIComponent(factoryQuery)}`} target="_blank" rel="noopener noreferrer">
                      <img src={factoryQR.kakao} alt={t('loc_qr_kakao')} width={120} height={120} />
                      <span className="loc_qr_label">{t('loc_qr_kakao')}</span>
                    </a>
                    <a className="loc_qr_item" href={`https://map.naver.com/p/search/${encodeURIComponent(factoryQuery)}`} target="_blank" rel="noopener noreferrer">
                      <img src={factoryQR.naver} alt={t('loc_qr_naver')} width={120} height={120} />
                      <span className="loc_qr_label">{t('loc_qr_naver')}</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* 물류센터 — 정보 LEFT / 지도 RIGHT (반전) */}
            <article className="loc_card loc_card--map_right">
              <div className="loc_card_body">
                <div className="loc_card_info">
                  <span className="loc_eyebrow">{t('loc_way_to_come')}</span>
                  <h3 className="loc_card_name">{t('loc_center_title')}</h3>
                  <ul className="loc_card_meta">
                    <li className="loc_meta_row">
                      <span className="loc_meta_icon" aria-hidden="true"><PinIcon /></span>
                      <div className="loc_meta_text">
                        <p className="loc_meta_value">{t('loc_center_addr')}</p>
                      </div>
                    </li>
                    <li className="loc_meta_row">
                      <span className="loc_meta_icon" aria-hidden="true"><PhoneIcon /></span>
                      <div className="loc_meta_text">
                        <p className="loc_meta_value">TEL. {t('loc_center_tel')}</p>
                      </div>
                    </li>
                  </ul>
                  <div className="loc_qr_group">
                    {/* 티맵 QR 제거 (사용자 요청) */}
                    <a className="loc_qr_item" href={`https://map.kakao.com/?q=${encodeURIComponent(centerQuery)}`} target="_blank" rel="noopener noreferrer">
                      <img src={centerQR.kakao} alt={t('loc_qr_kakao')} width={120} height={120} />
                      <span className="loc_qr_label">{t('loc_qr_kakao')}</span>
                    </a>
                    <a className="loc_qr_item" href={`https://map.naver.com/p/search/${encodeURIComponent(centerQuery)}`} target="_blank" rel="noopener noreferrer">
                      <img src={centerQR.naver} alt={t('loc_qr_naver')} width={120} height={120} />
                      <span className="loc_qr_label">{t('loc_qr_naver')}</span>
                    </a>
                  </div>
                </div>
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(centerQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="loc_card_map"
                  aria-label={t('loc_map_center_alt')}
                >
                  <img src="/images/sub/map_center.png" alt={t('loc_map_center_alt')} width={726} height={454} loading="lazy" />
                </a>
              </div>
            </article>
          </div>
        </section>
        <NextSectionLink isLast />
      </div>

      </div>
    </main>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.71 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.71A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function FaxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}
