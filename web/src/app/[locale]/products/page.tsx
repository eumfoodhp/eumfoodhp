/**
 * 제품 (Products) — 원페이지 형태.
 * 6개 카테고리 (절임식품 / 조림류 / 나물류 / 양념젓갈·젓갈류 / 소스 / 액상차)
 * 단일 페이지 스택. 각 섹션 상단에 story_section_head + NextSectionLink.
 *
 * 기존 /products/* 페이지는 그대로 유지 (직접 링크 호환).
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';
import BrochureLink from '@/components/BrochureLink';
import NextSectionLink from '@/components/NextSectionLink';
import SectionHeader from '@/components/SectionHeader';
import { nl2br } from '@/lib/nl2br';
import enMessages from '@/i18n/messages/en.json';
import '@/styles/sub.css';
import '@/styles/board_pages.css';
import '@/styles/product_pickles.css';
import '@/styles/product_braised.css';
import '@/styles/product_namul.css';
import '@/styles/product_salted.css';
import '@/styles/product_sauce.css';
import '@/styles/product_tea.css';
// ↑ 카테고리별 CSS 들. ↓ 그 위에 덮어쓰는 "그리드 단일 소스" (반드시 마지막).
import '@/styles/product_grid_unified.css';

// 영문(장식용) 텍스트 — en.json 직접 참조 (locale 무관 동일 표기)
const EN = enMessages as unknown as Record<string, string>;

// --- 카테고리별 데이터 ---
const PICKLES_ORDER = [9, 1, 3, 2, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const BRAISED_IMG_RECT = [30, 39, 31, 33, 34, 35, 36, 37, 38];
const NAMUL_ITEMS = [
  { id: '01', rect: 55 },
  { id: '02', rect: 56 },
  { id: '03', rect: 58 },
  { id: '04', rect: 61 },
];
const SALTED_ITEMS = [
  { id: '01', img: '/images/main/prod-salted-squid-new.png' },
  { id: '02', img: '/images/main/prod-salted-octopus-new.png' },
  { id: '03', img: '/images/main/prod-salted-shrimp-new.png' },
];
type SauceSection = {
  subKey: string;
  mainKey: string;
  noteKey?: string;
  ids: number[];
  isPack?: boolean;
};

const SAUCE_SECTIONS: SauceSection[] = [
  { subKey: 'prod_sauce_pack_sub_tit', mainKey: 'prod_sauce_pack_main_tit', noteKey: 'prod_sauce_pack_note', ids: [1, 2, 3, 4], isPack: true },
  { subKey: 'prod_sauce_korean_sub_tit', mainKey: 'prod_sauce_korean_main_tit', ids: [5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { subKey: 'prod_sauce_china_sub_tit', mainKey: 'prod_sauce_china_main_tit', ids: [14, 15, 17, 18, 19, 20, 21] },
  { subKey: 'prod_sauce_asia_sub_tit', mainKey: 'prod_sauce_asia_main_tit', ids: [16, 23, 24, 25, 26, 27, 28, 30, 31] },
];
const TEA_ITEMS = [
  { key: '03', img: 3 },
  { key: '01', img: 1 },
  { key: '02', img: 2 },
  { key: '05', img: 5 },
  { key: '04', img: 4 },
];

function safe(t: (k: string) => string, key: string, fallback: string) {
  try {
    const v = t(key);
    if (typeof v === 'string' && v !== key && !v.startsWith('[')) return v;
  } catch { /* ignore */ }
  return fallback;
}

export default async function ProductsOnePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main id="sub_contents" className="product_page products_onepage onepage_story">
      <div className="onepage_content">

        {/* ===== 1. 절임식품 ===== */}
        <div id="pickles" className="product_pickles_page story_section">
          <SectionHeader
            title={t('sub_prod_pickles')}
            en="Pickles"
            action={
              <BrochureLink className="btn_download story_section_action">
                <span>{t('btn_product_intro')}</span>
                <img src="/images/sub/download.png" alt="" />
              </BrochureLink>
            }
          />
          <section className="product_list_section">
            <div className="product_inner">
              <div className="product_grid">
                {PICKLES_ORDER.map((pickId, slotIndex) => {
                  const num = String(pickId).padStart(2, '0');
                  const imgNum = slotIndex + 1;
                  return (
                    <div className="product_card" key={num}>
                      <div className="prod_img" style={{ backgroundImage: `url('/images/sub/prod1-${imgNum}.png')` }}></div>
                      <div className="prod_info">
                        <div className="name_group">
                          <div className="name_row">
                            <h4>{t(`prod_pickles_${num}_name`)}</h4>
                            <span className="en">{t(`prod_pickles_${num}_en`)}</span>
                          </div>
                          <p className="desc">{t(`prod_pickles_${num}_desc`)}</p>
                        </div>
                        <div className="spec_info">
                          <div className="spec_group">
                            <span className="spec_label">{t('prod_spec_storage')}</span>
                            <i className="v_line"></i>
                            <span className="spec_val">{t('prod_spec_refrigerated')}</span>
                          </div>
                          <div className="spec_group">
                            <span className="spec_label">{t('prod_spec_package')}</span>
                            <i className="v_line"></i>
                            <span className="spec_val">{t('prod_spec_unit_1kg')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
          <NextSectionLink prevId="pickles" nextId="braised" nextLabel={t('sub_prod_braised')} />
        </div>

        {/* ===== 2. 조림류 ===== */}
        <div id="braised" className="product_braised_page story_section">
          <SectionHeader title={t('sub_prod_braised')} en="Braised Dishes" />
          <section className="product_list_section">
            <div className="product_inner">
              <div className="product_grid">
                {Array.from({ length: 9 }, (_, i) => {
                  const num = String(i + 1).padStart(2, '0');
                  const rect = BRAISED_IMG_RECT[i];
                  return (
                    <div className="product_card" key={num}>
                      <div className="prod_img" style={{ backgroundImage: `url('/images/sub/braised_rect_${rect}.png')` }}></div>
                      <div className="prod_info">
                        <div className="name_group">
                          <div className="name_row">
                            <h4>{t(`prod_braised_${num}_name`)}</h4>
                            <span className="en">{t(`prod_braised_${num}_en`)}</span>
                          </div>
                          <p className="desc">{t(`prod_braised_${num}_desc`)}</p>
                        </div>
                        <div className="spec_info">
                          <div className="spec_group">
                            <span className="spec_label">{t('prod_spec_storage')}</span>
                            <i className="v_line"></i>
                            <span className="spec_val">{t('prod_spec_refrigerated')}</span>
                          </div>
                          <div className="spec_group">
                            <span className="spec_label">{t('prod_spec_package')}</span>
                            <i className="v_line"></i>
                            <span className="spec_val">{t('prod_spec_unit_1kg')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
          <NextSectionLink prevId="pickles" nextId="namul" nextLabel={t('sub_prod_namul')} />
        </div>

        {/* ===== 3. 나물류 ===== */}
        <div id="namul" className="product_namul_page story_section">
          <SectionHeader title={t('sub_prod_namul')} en="Namul" />
          <section className="product_list_section">
            <div className="product_inner">
              <div className="product_grid">
                {NAMUL_ITEMS.map(({ id, rect }) => {
                  const key = `prod_namul_item${id}`;
                  return (
                    <div className="product_card" key={id}>
                      <div className="prod_img" style={{ backgroundImage: `url('/images/sub/namul_rect_${rect}.png')` }}></div>
                      <div className="prod_info">
                        <div className="name_group">
                          <div className="name_row">
                            <h4>{t(`${key}_name`)}</h4>
                            <span className="en">{t(`${key}_en`)}</span>
                          </div>
                          <p className="desc">{t(`${key}_desc`)}</p>
                        </div>
                        <div className="spec_info">
                          <div className="spec_group">
                            <span className="spec_label">{t('prod_spec_storage')}</span>
                            <i className="v_line"></i>
                            <span className="spec_val">{t('prod_spec_refrigerated')}</span>
                          </div>
                          <div className="spec_group">
                            <span className="spec_label">{t('prod_spec_package')}</span>
                            <i className="v_line"></i>
                            <span className="spec_val">{t('prod_spec_unit_1kg')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
          <NextSectionLink prevId="braised" nextId="salted" nextLabel={t('sub_prod_salted')} />
        </div>

        {/* ===== 4. 양념젓갈·젓갈류 ===== */}
        <div id="salted" className="product_salted_page story_section">
          <SectionHeader title={t('sub_prod_salted')} en="Seasoned & Salted Seafood" />
          <section className="product_list_section">
            <div className="product_inner">
              <div className="product_grid">
                {SALTED_ITEMS.map(({ id, img }) => (
                  <div className="product_card" key={id}>
                    <div className="prod_img" style={{ backgroundImage: `url('${img}')` }}></div>
                    <div className="prod_info">
                      <div className="name_group">
                        <div className="name_row">
                          <h4>{t(`prod_salted_${id}_name`)}</h4>
                          <span className="en">{t(`prod_salted_${id}_en`)}</span>
                        </div>
                        <p className="desc">{t(`prod_salted_${id}_desc`)}</p>
                      </div>
                      <div className="spec_info">
                        <div className="spec_group">
                          <span className="spec_label">{t('prod_spec_storage')}</span>
                          <i className="v_line"></i>
                          <span className="spec_val">{t('prod_spec_refrigerated')}</span>
                        </div>
                        <div className="spec_group">
                          <span className="spec_label">{t('prod_spec_package')}</span>
                          <i className="v_line"></i>
                          <span className="spec_val">{t('prod_spec_unit_1kg')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <NextSectionLink prevId="namul" nextId="sauce" nextLabel={t('sub_prod_sauce')} />
        </div>

        {/* ===== 5. 소스 (sub-sections 포함) ===== */}
        <div id="sauce" className="product_sauce_page story_section">
          <SectionHeader title={t('sub_prod_sauce')} en="Sauce" />
          <div className="sauce_section">
            {SAUCE_SECTIONS.map((sec, secIdx) => {
              const note = sec.noteKey ? t(sec.noteKey) : '';
              return (
                <section className="product_list_section" key={secIdx}>
                  <div className="product_inner">
                    <div className="pkg_subhead">
                      <h3 className="pkg_subhead_tit">{t(sec.mainKey)}</h3>
                      {note && <span className="pkg_subhead_note">{note}</span>}
                      {/* 영문 부제(초록) + note 영문(연한 초록) inline — 한글(제목+note) 패턴과 동일 (사용자 요청) */}
                      <span className="pkg_subhead_en">
                        {t(sec.subKey)}
                        {sec.noteKey && EN[sec.noteKey] ? (
                          <span className="pkg_subhead_note_en">{EN[sec.noteKey]}</span>
                        ) : null}
                      </span>
                    </div>
                    <div className={`product_grid${sec.isPack ? ' product_grid--sauce_pack' : ''}`}>
                      {sec.ids.map((id) => {
                        const num = String(id).padStart(2, '0');
                        // 모든 소스 제품 동일하게 '냉장 / 1KG'. 제품별 다른 값 필요 시
                        // ko.json 에 prod_sauce_XX_storage / _unit 키 추가 후 safe() 로 분기.
                        const storage = t('prod_spec_refrigerated');
                        const unit = t('prod_spec_unit_1kg');
                        const imgUrl = sec.isPack
                          ? `/images/sub/sauce_pack/sauce-pack-${num}.png`
                          : `/images/sub/prod4-${id}.png`;
                        const descRaw = safe(t, `prod_sauce_${num}_desc`, '');
                        return (
                          <div className="product_card" key={num}>
                            <div className="prod_img" style={{ backgroundImage: `url('${imgUrl}')` }}></div>
                            <div className="prod_info">
                              <div className="name_group">
                                <div className="name_row">
                                  <h4>{t(`prod_sauce_${num}_name`)}</h4>
                                  <span className="en">{safe(t, `prod_sauce_${num}_en`, '')}</span>
                                </div>
                                {descRaw && <p className="desc">{nl2br(descRaw)}</p>}
                              </div>
                              <div className="spec_info">
                                <div className="spec_group">
                                  <span className="spec_label">{t('prod_spec_storage')}</span>
                                  <i className="v_line"></i>
                                  <span className="spec_val">{storage}</span>
                                </div>
                                <div className="spec_group">
                                  <span className="spec_label">{t('prod_spec_package')}</span>
                                  <i className="v_line"></i>
                                  <span className="spec_val">{unit}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
          <NextSectionLink prevId="salted" nextId="tea" nextLabel={t('sub_prod_tea')} />
        </div>

        {/* ===== 6. 액상차 ===== */}
        <div id="tea" className="product_tea_page story_section">
          <SectionHeader title={t('sub_prod_tea')} en="Tea" />
          <section className="product_list_section">
            <div className="product_inner">
              <div className="product_grid">
                {TEA_ITEMS.map(({ key, img }) => (
                  <div className="product_card" key={key}>
                    <div className="prod_img" style={{ backgroundImage: `url('/images/sub/prod5-${img}.png')` }}></div>
                    <div className="prod_info">
                      <div className="name_group">
                        <div className="name_row">
                          <h4>{t(`prod_tea_${key}_name`)}</h4>
                          <span className="en">{t(`prod_tea_${key}_en`)}</span>
                        </div>
                        <p className="desc">{t(`prod_tea_${key}_desc`)}</p>
                      </div>
                      <div className="spec_info">
                        <div className="spec_group">
                          <span className="spec_label">{t('prod_spec_storage')}</span>
                          <i className="v_line"></i>
                          <span className="spec_val">{t('prod_spec_refrigerated')}</span>
                        </div>
                        <div className="spec_group">
                          <span className="spec_label">{t('prod_spec_package')}</span>
                          <i className="v_line"></i>
                          <span className="spec_val">{t(`prod_tea_${key}_unit`)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <NextSectionLink isLast />
        </div>

      </div>
    </main>
  );
}
