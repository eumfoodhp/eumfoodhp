/**
 * 제조 (Manufacturing) — 원페이지 형태.
 * 시설현황 / 제조공정 / 인증·특허 3개 섹션을 단일 페이지에 스택.
 * 각 섹션 상단에 SectionHeader (3등분 균등 그리드) 배치.
 * 항목 클릭 시 anchor 스무스 스크롤.
 *
 * 기존 /business/facility, /business/process, /about/cert 페이지는 그대로
 * 유지 (직접 링크 호환).
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';
import NextSectionLink from '@/components/NextSectionLink';
import SectionHeader from '@/components/SectionHeader';
import FacilitySection from '@/components/FacilitySection';
import CertGrid from '@/components/CertGrid';
import '@/styles/sub.css';
import '@/styles/board_pages.css';
import '@/styles/business_facility.css';
import '@/styles/business_process.css';
import '@/styles/about_cert.css';

// 카테고리별 스네이크 흐름도 배치 — 행은 자연순서(1,2,3,4 / 5,6,7,8 / 9)로 렌더.
// 데스크탑 CSS 에서 짝수행(row2)을 row-reverse 로 시각 반전 → 스네이크.
// (모바일 세로 스택 시 자연순서 그대로라 역순 방지)
const FLOW_CONFIG: Record<
  string,
  { flowMod: string; diagramMod: string; lines: string[]; rows: { cls: string; ids: number[] }[] }
> = {
  pickles: {
    flowMod: '', diagramMod: '', lines: ['h1', 'h2', 'v1', 'v2'],
    rows: [
      { cls: 'r1', ids: [1, 2, 3, 4] },
      { cls: 'r2', ids: [5, 6, 7, 8] },
      { cls: 'r3', ids: [9] },
    ],
  },
  braised: {
    flowMod: 'braised', diagramMod: 'braised', lines: ['bh1', 'bh2', 'bv1'],
    rows: [
      { cls: 'br1', ids: [1, 2, 3, 4] },
      { cls: 'br2', ids: [5, 6, 7, 8] },
    ],
  },
  salted: {
    flowMod: 'pickle', diagramMod: 'pickle', lines: ['ph1', 'ph2', 'pv1'],
    rows: [
      { cls: 'pr1', ids: [1, 2, 3, 4] },
      { cls: 'pr2', ids: [5, 6, 7, 8] },
    ],
  },
  sauce: {
    flowMod: 'sauce', diagramMod: 'sauce', lines: ['sh1', 'sh2', 'sv1'],
    rows: [
      { cls: 'sr1', ids: [1, 2, 3, 4] },
      { cls: 'sr2', ids: [5, 6, 7] },
    ],
  },
};

type Cat = {
  key: string;
  modKey: string;
  prefix: string;
  label: string;
  eyebrow: string;
  steps: number;
  iconDir: string;
};

const HACCP_CERTS = [
  { key: 'cert_name_1', img: '/images/sub/cert/cert-01-pickles.png' },
  { key: 'cert_name_2', img: '/images/sub/cert/cert-02-braise.png' },
  { key: 'cert_name_3', img: '/images/sub/cert/cert-03-salted.png' },
  { key: 'cert_name_4', img: '/images/sub/cert/cert-04-jeotgal.png' },
  { key: 'cert_name_5', img: '/images/sub/cert/cert-05-sauce.png' },
  { key: 'cert_name_6', img: '/images/sub/cert/cert-06-mix.png' },
  { key: 'cert_name_7', img: '/images/sub/cert/cert-07-tea.png' },
];
const OTHER_CERTS = [
  { key: 'cert_name_9', img: '/images/sub/cert/cert-09-master.png' }, // 전통식품마스터
  { key: 'cert_name_8', img: '/images/sub/cert/cert-08-tax.png' },    // 성실납세자
];

export default async function BusinessOnePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const CATEGORIES: Cat[] = [
    { key: 'pickles', modKey: 'pickles', prefix: 'proc_pickles_step', label: t('sub_prod_pickles'), eyebrow: 'Pickles',          steps: 9, iconDir: 'biz-pf-pickles-5535977' },
    { key: 'braised', modKey: 'braised', prefix: 'proc_braised_step', label: t('sub_prod_braised'), eyebrow: 'Braised Dishes',   steps: 8, iconDir: 'biz-pf-braised-5535890' },
    { key: 'salted',  modKey: 'pickle',  prefix: 'proc_salted_step',  label: t('sub_prod_salted'),  eyebrow: 'Salted Seafood',   steps: 8, iconDir: 'biz-pf-pickle-5535894' },
    { key: 'sauce',   modKey: 'sauce',   prefix: 'proc_sauce_step',   label: t('biz_proc_cat_sauce'), eyebrow: 'Sauce & Beverage', steps: 7, iconDir: 'biz-pf-sauce-flow' },
  ];

  const sections = [
    { id: 'facility', label: t('sub_facility') },
    { id: 'process', label: t('sub_biz_process') },
    { id: 'cert', label: t('sub_cert') },
  ];

  return (
    <main id="sub_contents" className="business_onepage onepage_story">
      <div className="onepage_content">

      {/* ===== 1. 시설현황 ===== */}
      <div id="facility" className="business_facility_page story_section">
        <SectionHeader title={t('sub_facility')} en="Facility" />
        <FacilitySection />
        <NextSectionLink prevId="facility" nextId="process" nextLabel={t('sub_biz_process')} />
      </div>

      {/* ===== 2. 제조공정 ===== */}
      <div id="process" className="business_process_page story_section">
        <SectionHeader title={t('sub_biz_process')} en="Process" />
        {CATEGORIES.map((cat) => {
          const flow = FLOW_CONFIG[cat.key];
          // 스텝 1개 — 아이콘 + 라벨 (브로셔처럼 Step배지·영문·설명 없음)
          const renderStep = (n: number) => {
            const nn = String(n).padStart(2, '0');
            // 절임식품 06~09 만 실제 PNG, 나머지는 SVG (원본 파일 확장자 이슈)
            const ext = cat.key === 'pickles' && n >= 6 ? 'png' : 'svg';
            const iconSrc = `/images/sub/figma/${cat.iconDir}/${nn}.${ext}`;
            const label = t(`${cat.prefix}${nn}_tit`);
            return (
              <div key={n} className="biz_pf_step">
                <div className="biz_pf_step_circle">
                  <div className="biz_pf_step_icon">
                    <img src={iconSrc} alt={label} width={90} height={90} loading="lazy" />
                  </div>
                  <p className="biz_pf_step_label">{label}</p>
                </div>
              </div>
            );
          };
          return (
            <section
              key={cat.key}
              className={`biz_process_flow_section biz_process_flow_section--${cat.modKey}`}
            >
              <div className="sub_inner biz_pf_inner">
                <div className="biz_pf_flow_head">
                  <h2 className="biz_pf_flow_title">{cat.label}</h2>
                  <p className="biz_pf_eyebrow">{cat.eyebrow}</p>
                </div>
                {/* 스네이크 흐름도 — 데스크탑 절대좌표 / 모바일 세로 스택(CSS) */}
                <div
                  className={`biz_pf_pickles_flow${flow.flowMod ? ` biz_pf_pickles_flow--${flow.flowMod}` : ''}`}
                >
                  <div
                    className={`biz_pf_diagram${flow.diagramMod ? ` biz_pf_diagram--${flow.diagramMod}` : ''}`}
                  >
                    <div className="biz_pf_snake_lines" aria-hidden="true">
                      {flow.lines.map((ln) => (
                        <span key={ln} className={`biz_pf_ln biz_pf_ln--${ln}`}></span>
                      ))}
                    </div>
                    {flow.rows.map((row) => (
                      <div
                        key={row.cls}
                        className={`biz_pf_flow_row biz_pf_flow_row--${row.cls}`}
                      >
                        {row.ids.map(renderStep)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
        <NextSectionLink prevId="facility" nextId="cert" nextLabel={t('sub_cert')} />
      </div>

      {/* ===== 3. 인증·특허 ===== */}
      <div id="cert" className="cert_page story_section">
        <SectionHeader title={t('sub_cert')} en="Certificate" />
        <section className="cert_content_section">
          <div className="sub_inner">
            <div className="cert_container">
              {/* 1. 약속 텍스트 — 풀폭 상단 */}
              <p className="cert_promise">{t('cert_desc')}</p>

              {/* 2. 제목 (좌) / HACCP 마크 (우) */}
              <div className="cert_title_row">
                <h3 className="cert_main_title">
                  <span className="cert_main_title_l1">{t('cert_main_tit_1')}</span>
                  <br />
                  <span className="cert_main_title_l2">{t('cert_main_tit_2')}</span>
                </h3>
                <div className="haccp_icon_wrap">
                  <img
                    src="/images/sub/cert/cert-haccp-mark.png"
                    alt="HACCP MAFRA 인증 마크"
                    className="haccp_icon"
                    width="107"
                    height="107"
                  />
                </div>
              </div>

              {/* 3. HACCP 인증 이점 4가지 — 풀폭 */}
              <div className="haccp_benefit">
                <h5 className="benefit_title">{t('cert_benefit_tit')}</h5>
                <ul>
                  <li>{t('cert_benefit_1')}</li>
                  <li>{t('cert_benefit_2')}</li>
                  <li>{t('cert_benefit_3')}</li>
                  <li>{t('cert_benefit_4')}</li>
                </ul>
              </div>
              <div className="cert_bottom">
                {/* HACCP 라벨 제거 (사용자 요청) */}
                <CertGrid
                  items={HACCP_CERTS.map((c) => ({ key: c.key, img: c.img, label: t(c.key) }))}
                />
                <h4 className="cert_group_title cert_group_title--other">기타</h4>
                <CertGrid
                  items={OTHER_CERTS.map((c) => ({ key: c.key, img: c.img, label: t(c.key) }))}
                />
              </div>
            </div>
          </div>
        </section>
        <NextSectionLink isLast />
      </div>

      </div>
    </main>
  );
}
