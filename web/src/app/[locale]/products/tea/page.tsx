import BrochureLink from '@/components/BrochureLink';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { productsTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/product_tea.css';

// 표기 순서: 생강 → 배도라지 → 복분자 → 타트체리 → 애플망고
const ITEMS = [
  { key: '03', img: 3 },
  { key: '01', img: 1 },
  { key: '02', img: 2 },
  { key: '05', img: 5 },
  { key: '04', img: 4 },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <main id="sub_contents" className="product_page product_tea_page">
        <SubVisual
          parentLabel={t('menu_product')}
          currentLabel={t('sub_prod_tea')}
          title={t('sub_prod_tea')}
          desc={t('fac_sub_desc')}
          tabBar={<SubTabBar tabs={productsTabs(t)} activeKey="tea" />}
          heroClass="product_tea_hero_visual"
        />

        <section className="product_list_section">
          <div className="product_inner">
            <div className="product_top_area">
              <div className="tit_group">
                <span className="sub_tit">{t('prod_tea_sub_tit')}</span>
                <h3 className="main_tit">{t('prod_tea_main_tit')}</h3>
              </div>
              <BrochureLink className="btn_download">
                <span>{t('btn_product_intro')}</span>
                <img src="/images/sub/download.png" alt="" />
              </BrochureLink>
            </div>

            <div className="product_grid">
              {ITEMS.map(({ key, img }) => (
                <div className="product_card" key={key}>
                  <div
                    className="prod_img"
                    style={{ backgroundImage: `url('/images/sub/prod5-${img}.png')` }}
                  ></div>
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
      </main>

      <Script id="tea-reveal" strategy="afterInteractive">
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
  document.querySelectorAll('.product_tea_page .product_card').forEach((c) => ob.observe(c));
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __init);
else __init();
        `}
      </Script>
    </>
  );
}
