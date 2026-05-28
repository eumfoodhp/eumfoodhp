import { getTranslations, setRequestLocale } from 'next-intl/server';
import { businessTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/business_process.css';

type Cat = {
  key: string;
  modKey: string;
  prefix: string;
  label: string;
  steps: number;
  iconDir: string;  // /images/sub/figma/{iconDir}/{NN}.png
};

export default async function BusinessProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Figma 541:5032 — 4개 공정 카테고리. 각 카테고리별 step 데이터는
  // 기존 proc_{cat}_step{NN}_tit/desc 키 재활용.
  // iconDir = 레거시 PHP 사이트에서 가져온 step 아이콘 폴더명.
  const CATEGORIES: Cat[] = [
    { key: 'pickles', modKey: 'pickles', prefix: 'proc_pickles_step', label: t('sub_prod_pickles'), steps: 7, iconDir: 'biz-pf-pickles-5535977' },
    { key: 'braised', modKey: 'braised', prefix: 'proc_braised_step', label: t('sub_prod_braised'), steps: 5, iconDir: 'biz-pf-braised-5535890' },
    { key: 'salted',  modKey: 'pickle',  prefix: 'proc_salted_step',  label: t('sub_prod_salted'),  steps: 5, iconDir: 'biz-pf-pickle-5535894' },
    { key: 'sauce',   modKey: 'sauce',   prefix: 'proc_sauce_step',   label: t('sub_prod_sauce'),   steps: 4, iconDir: 'biz-pf-sauce-flow' },
  ];

  return (
    <>
      <main id="sub_contents" className="business_process_page">
        {CATEGORIES.map((cat) => (
          <section
            key={cat.key}
            className={`biz_process_flow_section biz_process_flow_section--${cat.modKey}`}
          >
            <div className="sub_inner biz_pf_inner">
              <div className="biz_pf_flow_head">
                <p className="biz_pf_eyebrow">Process Flow</p>
                <h2 className="biz_pf_flow_title">{cat.label}</h2>
              </div>
              <div className="biz_pf_steps_grid">
                {Array.from({ length: cat.steps }, (_, i) => i + 1).map((n) => {
                  const nn = String(n).padStart(2, '0');
                  const iconSrc = `/images/sub/figma/${cat.iconDir}/${nn}.png`;
                  const label = t(`${cat.prefix}${nn}_tit`);
                  return (
                    <div key={n} className="biz_pf_step biz_pf_step--grid">
                      <div className="biz_pf_step_badge">Step {nn}</div>
                      <div className="biz_pf_step_circle">
                        <div className="biz_pf_step_icon">
                          <img src={iconSrc} alt={label} width={90} height={90} loading="lazy" />
                        </div>
                        <p className="biz_pf_step_label">{label}</p>
                      </div>
                      <p className="biz_pf_step_desc">{t(`${cat.prefix}${nn}_desc`)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
