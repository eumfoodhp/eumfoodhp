import BrochureLink from '@/components/BrochureLink';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import { productsTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/product_sauce.css';

type Section = {
  subKey: string;
  mainKey: string;
  noteKey?: string;
  ids: number[];
  isPack?: boolean;
};

const SECTIONS: Section[] = [
  // Pack sauces 01~04
  { subKey: 'prod_sauce_pack_sub_tit', mainKey: 'prod_sauce_pack_main_tit', noteKey: 'prod_sauce_pack_note', ids: [1, 2, 3, 4], isPack: true },
  // Korean 05~13
  { subKey: 'prod_sauce_korean_sub_tit', mainKey: 'prod_sauce_korean_main_tit', ids: [5, 6, 7, 8, 9, 10, 11, 12, 13] },
  // Western/China (돈까스(16)는 아시아로 이동, 크림스파게티(22)는 삭제)
  { subKey: 'prod_sauce_china_sub_tit', mainKey: 'prod_sauce_china_main_tit', ids: [14, 15, 17, 18, 19, 20, 21] },
  // Asia
  { subKey: 'prod_sauce_asia_sub_tit', mainKey: 'prod_sauce_asia_main_tit', ids: [16, 23, 24, 25, 26, 27, 28, 30, 31] },
];

function safe(t: (k: string) => string, key: string, fallback: string) {
  // next-intl t()는 누락 키에 대해 키 문자열 또는 에러를 반환할 수 있어
  // 안전하게 fallback 처리. raw 접근으로 존재 여부 확인.
  try {
    const v = t(key);
    if (typeof v === 'string' && v !== key && !v.startsWith('[')) return v;
  } catch {
    /* ignore */
  }
  return fallback;
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <main id="sub_contents" className="product_page product_sauce_page">
        <div className="sauce_section">
          {SECTIONS.map((sec, secIdx) => {
            const note = sec.noteKey ? t(sec.noteKey) : '';
            return (
              <section className="product_list_section" key={secIdx}>
                <div className="product_inner">
                  <div className="product_top_area">
                    <div className="sauce_top_left">
                      <div className="tit_group">
                        <span className="sub_tit">{t(sec.subKey)}</span>
                        <h3 className="main_tit">{t(sec.mainKey)}</h3>
                      </div>
                      {note && <p className="sauce_note">{note}</p>}
                    </div>
                    {sec.isPack && (
                      <BrochureLink className="btn_download">
                        <span>{t('btn_product_intro')}</span>
                        <img src="/images/sub/download.png" alt="" />
                      </BrochureLink>
                    )}
                  </div>

                  <div className={`product_grid${sec.isPack ? ' product_grid--sauce_pack' : ''}`}>
                    {sec.ids.map((id) => {
                      const num = String(id).padStart(2, '0');
                      const refrigerated = t('prod_spec_refrigerated');
                      const unit1kg = t('prod_spec_unit_1kg');
                      const storage = safe(t, `prod_sauce_${num}_storage`, refrigerated);
                      const unit = safe(t, `prod_sauce_${num}_unit`, unit1kg);
                      const imgUrl = sec.isPack
                        ? `/images/sub/sauce_pack/sauce-pack-${num}.png`
                        : `/images/sub/prod4-${id}.png`;
                      const descRaw = safe(t, `prod_sauce_${num}_desc`, '');

                      return (
                        <div className="product_card" key={id}>
                          <div className="prod_img" style={{ backgroundImage: `url('${imgUrl}')` }}></div>
                          <div className="prod_info">
                            <div className="name_group">
                              <div className="name_row">
                                <h4>{t(`prod_sauce_${num}_name`)}</h4>
                                <span className="en">{t(`prod_sauce_${num}_en`)}</span>
                              </div>
                              {descRaw && <p className="desc">{descRaw}</p>}
                            </div>
                            {sec.isPack ? (
                              <div className="spec_info spec_info--volume_only">
                                <div className="spec_group">
                                  <span className="spec_label">{t('prod_spec_volume')}</span>
                                  <i className="v_line"></i>
                                  <span className="spec_val">{unit}</span>
                                </div>
                              </div>
                            ) : (
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
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {note && <p className="sauce_note_mobile">* {note}</p>}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <Script id="sauce-reveal" strategy="afterInteractive">
        {`
const __init = () => {
  const opts = { threshold: 0.2, rootMargin: '0px 0px -8% 0px' };
  const ob = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is_visible');
        ob.unobserve(entry.target);
      }
    });
  }, opts);
  document.querySelectorAll('.product_sauce_page .product_card').forEach((c) => ob.observe(c));
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __init);
else __init();
        `}
      </Script>
    </>
  );
}
