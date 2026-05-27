import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { businessTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/business_process.css';

type Cat = { key: string; modKey: string; prefix: string; label: string; steps: number };

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
  const CATEGORIES: Cat[] = [
    { key: 'pickles', modKey: 'pickles', prefix: 'proc_pickles_step', label: t('sub_prod_pickles'),    steps: 7 },
    { key: 'braised', modKey: 'braised', prefix: 'proc_braised_step', label: t('sub_prod_braised'),    steps: 5 },
    { key: 'salted',  modKey: 'pickle',  prefix: 'proc_salted_step',  label: t('sub_prod_salted'),     steps: 5 },
    { key: 'sauce',   modKey: 'sauce',   prefix: 'proc_sauce_step',   label: t('sub_prod_sauce'),      steps: 4 },
  ];

  return (
    <>
      <main id="sub_contents" className="business_process_page">
        <SubVisual
          parentLabel={t('menu_business')}
          currentLabel={t('sub_biz_process')}
          title={t('sub_biz_process')}
          desc={t('biz_process_sub_desc')}
          tabBar={<SubTabBar tabs={businessTabs(t)} activeKey="process" />}
          heroClass="business_process_hero_visual"
        />

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
                  return (
                    <div key={n} className="biz_pf_step biz_pf_step--grid">
                      <div className="biz_pf_step_badge">Step {nn}</div>
                      <div className="biz_pf_step_circle">
                        <p className="biz_pf_step_label">{t(`${cat.prefix}${nn}_tit`)}</p>
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
