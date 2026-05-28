import BrochureLink from '@/components/BrochureLink';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import { productsTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/product_namul.css';

// 고사리볶음·고구마순볶음·데친고사리·데친곤드레 4종 → 썸네일 55,56,58,61
const ITEMS = [
  { id: '01', rect: 55 },
  { id: '02', rect: 56 },
  { id: '03', rect: 58 },
  { id: '04', rect: 61 },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <main id="sub_contents" className="product_page product_namul_page">
        <section className="product_list_section">
          <div className="product_inner">
            <div className="product_top_area">
              <div className="tit_group">
                <span className="sub_tit">{t('prod_namul_sub_tit')}</span>
                <h3 className="main_tit">{t('prod_namul_main_tit')}</h3>
              </div>
              <BrochureLink className="btn_download">
                <span>{t('btn_product_intro')}</span>
                <img src="/images/sub/download.png" alt="" />
              </BrochureLink>
            </div>

            <div className="product_grid">
              {ITEMS.map(({ id, rect }) => {
                const key = `prod_namul_item${id}`;
                return (
                  <div className="product_card" key={id}>
                    <div
                      className="prod_img"
                      style={{ backgroundImage: `url('/images/sub/namul_rect_${rect}.png')` }}
                    ></div>
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
      </main>

      <Script id="namul-reveal" strategy="afterInteractive">
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
  document.querySelectorAll('.product_namul_page .product_card').forEach((c) => ob.observe(c));
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __init);
else __init();
        `}
      </Script>
    </>
  );
}
