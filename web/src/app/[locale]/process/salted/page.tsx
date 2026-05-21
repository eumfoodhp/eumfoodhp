import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import SubVisual from '@/components/SubVisual';
import { nl2br } from '@/lib/nl2br';
import '@/styles/sub.css';

const STEPS = ['01', '02', '03', '04', '05'];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <main id="sub_contents" className="process_page">
        <SubVisual
          parentLabel={t('sub_biz_process')}
          currentLabel={t('sub_proc_salted')}
          title={t('sub_proc_salted')}
          desc={t('sub_proc_slogan')}
        />

        <section className="process_content_section">
          <div className="process_inner">
            <div className="process_top_info">
              <div className="tit_group">
                <span className="sub_tit">{t('proc_salted_top_sub')}</span>
                <h3 className="main_tit">{t('proc_salted_top_main')}</h3>
              </div>
              <p className="desc_txt">{nl2br(t('proc_salted_top_desc'))}</p>
            </div>

            <div className="step_grid_container">
              {STEPS.map((num) => (
                <div className="step_item" key={num}>
                  <div className="step_head">
                    <span className="step_badge">Step {num}</span>
                  </div>
                  <div className="step_info">
                    <h4 className="step_tit">{t(`proc_salted_step${num}_tit`)}</h4>
                    <p className="step_desc">{nl2br(t(`proc_salted_step${num}_desc`))}</p>
                  </div>
                  <div
                    className="step_img"
                    style={{ backgroundImage: `url('/images/sub/03-${num}.png')` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Script id="process-salted-reveal" strategy="afterInteractive">
        {`
const __init = () => {
  const ob = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is_visible'), (index % 4) * 150);
        ob.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.step_item').forEach((el) => ob.observe(el));
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __init);
else __init();
        `}
      </Script>
    </>
  );
}
