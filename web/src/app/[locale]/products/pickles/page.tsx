import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { productsTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/product_pickles.css';
import './pickles-responsive.css';

// Figma 291:7410 ~ 291:7430 행 순서. slot_index(1-based) → pick_id 매핑.
const DISPLAY_ORDER = [9, 1, 3, 2, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <main id="sub_contents" className="product_page product_pickles_page">
        <SubVisual
          parentLabel={t('menu_product')}
          currentLabel={t('sub_prod_pickles')}
          title={t('sub_prod_pickles')}
          desc={t('fac_sub_desc')}
          tabBar={<SubTabBar tabs={productsTabs(t)} activeKey="pickles" />}
        />

        <section className="product_list_section">
          <div className="product_inner">
            <div className="product_top_area">
              <div className="tit_group">
                <span className="sub_tit">{t('prod_pickles_sub_tit')}</span>
                <h3 className="main_tit">{t('prod_pickles_main_tit')}</h3>
              </div>
              <a href="/data/catalogue.pdf" className="btn_download" download>
                <span>{t('btn_product_intro')}</span>
                <img src="/images/sub/download.png" alt="" />
              </a>
            </div>

            <div className="product_grid">
              {DISPLAY_ORDER.map((pickId, slotIndex) => {
                const num = String(pickId).padStart(2, '0');
                const imgNum = slotIndex + 1;
                return (
                  <div className="product_card" key={num}>
                    <div
                      className="prod_img"
                      style={{ backgroundImage: `url('/images/sub/prod1-${imgNum}.png')` }}
                    ></div>
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
      </main>

      <Script id="pickles-reveal" strategy="afterInteractive">
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
  document.querySelectorAll('.product_pickles_page .product_card').forEach((c) => ob.observe(c));
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __init);
else __init();
        `}
      </Script>
    </>
  );
}
