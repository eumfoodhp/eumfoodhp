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
import BizProcessSnake from '@/components/BizProcessSnake';
import { getCertImageMap, certStaticPath } from '@/lib/certs';
import '@/styles/sub.css';
import '@/styles/board_pages.css';
import '@/styles/business_facility.css';
import '@/styles/business_process.css';
import '@/styles/about_cert.css';

// 인증서 이미지는 Supabase Storage 사용 → 어드민 교체가 바로 반영되게 동적 렌더
export const revalidate = 0;

// 제조공정 — 카테고리별 스텝(한/영/중 + 아이콘 prefix). 아이콘: /images/sub/process/{iconPrefix}{n}.png
const PROCESS = [
  {
    key: 'pickles', modKey: 'pickles', iconPrefix: 'pf',
    ko: '절임식품', zh: '腌制食品', en: 'Pickled Food',
    steps: [
      { ko: '입고', en: 'Inbound', zh: '入库' },
      { ko: '원재료 검사', en: 'Raw Material Inspection', zh: '原料检验' },
      { ko: '불림', en: 'Soaking', zh: '浸泡' },
      { ko: '세척', en: 'Washing', zh: '清洗' },
      { ko: '배합(무침)', en: 'Mixing', zh: '配料(拌制)' },
      { ko: '내포장', en: 'Inner Packaging', zh: '内包装' },
      { ko: '금속검출', en: 'Metal Detection', zh: '金属检测' },
      { ko: 'X-ray', en: 'X-ray', zh: 'X光检测' },
      { ko: '외포장/출하', en: 'Outer Packaging / Shipping', zh: '外包装/出货' },
    ],
  },
  {
    key: 'braised', modKey: 'braised', iconPrefix: 'sf',
    ko: '조림류', zh: '炖煮类', en: 'Stewed Food',
    steps: [
      { ko: '입고', en: 'Inbound', zh: '入库' },
      { ko: '원재료 검사', en: 'Raw Material Inspection', zh: '原料检验' },
      { ko: '선별', en: 'Sorting', zh: '筛选' },
      { ko: '가열(조림)', en: 'Heating (Stewing)', zh: '加热(炖煮)' },
      { ko: '내포장', en: 'Inner Packaging', zh: '内包装' },
      { ko: '금속검출', en: 'Metal Detection', zh: '金属检测' },
      { ko: 'X-ray', en: 'X-ray', zh: 'X光检测' },
      { ko: '외포장/출하', en: 'Outer Packaging / Shipping', zh: '外包装/出货' },
    ],
  },
  {
    key: 'pickle', modKey: 'pickle', iconPrefix: 'p',
    ko: '피클', zh: '泡菜', en: 'Pickle',
    steps: [
      { ko: '입고', en: 'Inbound', zh: '入库' },
      { ko: '원재료 검사', en: 'Raw Material Inspection', zh: '原料检验' },
      { ko: '선별', en: 'Sorting', zh: '筛选' },
      { ko: '세척', en: 'Washing', zh: '清洗' },
      { ko: '절단', en: 'Cutting', zh: '切割' },
      { ko: '내포장', en: 'Inner Packaging', zh: '内包装' },
      { ko: '금속검출', en: 'Metal Detection', zh: '金属检测' },
      { ko: '외포장/출하', en: 'Outer Packaging / Shipping', zh: '外包装/出货' },
    ],
  },
  {
    key: 'sauce', modKey: 'sauce', iconPrefix: 'sml',
    ko: '소스& 혼합장& 액상차', zh: '酱料& 混合酱& 液态茶', en: 'Sauce& Mixing Sauce& Liquid Tea',
    steps: [
      { ko: '입고', en: 'Inbound', zh: '入库' },
      { ko: '원재료 검사', en: 'Raw Material Inspection', zh: '原料检验' },
      { ko: '계량', en: 'Weighing', zh: '计量' },
      { ko: '가열 후 냉각', en: 'Heating & Cooling', zh: '加热后冷却' },
      { ko: '내포장', en: 'Inner Packaging', zh: '内包装' },
      { ko: '금속검출', en: 'Metal Detection', zh: '金属检测' },
      { ko: '외포장/출하', en: 'Outer Packaging / Shipping', zh: '外包装/出货' },
    ],
  },
];

// 공정 흐름 = 번호 배지 + 원형 스텝을 자연 줄바꿈 그리드로 (PC4·태블릿3·모바일2).
// 스네이크 절대배치/연결선은 제거 — 순서는 번호로 표시해 어느 화면에서도 좌→우·위→아래로 읽힘.
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
  { key: 'cert_name_1', file: 'cert-01-pickles.png' },
  { key: 'cert_name_2', file: 'cert-02-braise.png' },
  { key: 'cert_name_3', file: 'cert-03-salted.png' },
  { key: 'cert_name_4', file: 'cert-04-jeotgal.png' },
  { key: 'cert_name_5', file: 'cert-05-sauce.png' },
  { key: 'cert_name_6', file: 'cert-06-mix.png' },
  { key: 'cert_name_7', file: 'cert-07-tea.png' },
];
const OTHER_CERTS = [
  { key: 'cert_name_9', file: 'cert-09-master.png' }, // 전통식품마스터
  { key: 'cert_name_8', file: 'cert-08-tax.png' },    // 성실납세자
];

export default async function BusinessOnePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const certMap = await getCertImageMap();
  const certImg = (file: string) => certMap[file] ?? certStaticPath(file);

  const isZh = locale === 'zh';

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
        {PROCESS.map((cat) => {
          const steps = cat.steps.map((s, i) => ({
            n: i + 1,
            iconSrc: `/images/sub/process/${cat.iconPrefix}${i + 1}.png`,
            label: isZh ? s.zh : s.ko,
            en: s.en,
          }));
          return (
            <section
              key={cat.key}
              className={`biz_process_flow_section biz_process_flow_section--${cat.modKey}`}
            >
              <div className="sub_inner biz_pf_inner">
                <div className="biz_pf_flow_head">
                  <h2 className="biz_pf_flow_title">{isZh ? cat.zh : cat.ko}</h2>
                  <p className="biz_pf_eyebrow">{cat.en}</p>
                </div>
                {/* 반응형 스네이크 흐름 — 열수 계산/줄 묶기는 클라이언트에서 */}
                <BizProcessSnake steps={steps} />
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
                    src={certImg('cert-haccp-mark.png')}
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
                  items={HACCP_CERTS.map((c) => ({ key: c.key, img: certImg(c.file), label: t(c.key) }))}
                />
                <h4 className="cert_group_title cert_group_title--other">{t('cert_group_other')}</h4>
                <CertGrid
                  items={OTHER_CERTS.map((c) => ({ key: c.key, img: certImg(c.file), label: t(c.key) }))}
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
