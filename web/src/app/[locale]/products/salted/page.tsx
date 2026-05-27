import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { productsTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/product_salted.css';

// 오징어젓·낙지젓·새우젓 3종 (메인 페이지와 같은 이미지 사용)
const ITEMS = [
  { id: '01', img: '/images/main/prod-salted-squid-new.png' },
  { id: '02', img: '/images/main/prod-salted-octopus-new.png' },
  { id: '03', img: '/images/main/prod-salted-shrimp-new.png' },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <main id="sub_contents" className="product_page product_salted_page">
        <SubVisual
          parentLabel={t('menu_product')}
          currentLabel={t('sub_prod_salted')}
          title={t('sub_prod_salted')}
          desc={t('fac_sub_desc')}
          tabBar={<SubTabBar tabs={productsTabs(t)} activeKey="salted" />}
          heroClass="product_salted_hero_visual"
        />

        <section className="product_list_section">
          <div className="product_inner">
            <div className="product_top_area">
              <div className="tit_group">
                <span className="sub_tit">{t('prod_salted_sub_tit')}</span>
                <h3 className="main_tit">{t('prod_salted_main_tit')}</h3>
              </div>
              <a href="/data/catalogue.pdf" className="btn_download" download>
                <span>{t('btn_product_intro')}</span>
                <img src="/images/sub/download.png" alt="" />
              </a>
            </div>

            <div className="product_grid product_grid--salted_three">
              {ITEMS.map(({ id, img }) => (
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
      </main>

      <Script id="salted-reveal" strategy="afterInteractive">
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
  document.querySelectorAll('.product_salted_page .product_card').forEach((c) => ob.observe(c));
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __init);
else __init();
        `}
      </Script>
    </>
  );
}
