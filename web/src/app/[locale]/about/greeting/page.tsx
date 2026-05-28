import { getTranslations, setRequestLocale } from 'next-intl/server';
import { aboutTabs } from '@/lib/sub-tabs';
import { nl2br } from '@/lib/nl2br';
import '@/styles/sub.css';

export default async function GreetingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>

      <main id="sub_contents" className="greeting_page">
        <section className="ceo_intro_section">
          <div className="ceo_inner">
            <div className="ceo_main_group">
              <span className="ceo_tag">{t('greeting_ceo_intro')}</span>

              <div className="ceo_content_group">
                <div className="ceo_main_title">
                  <h3 className="light">{t('greeting_hello_1')}</h3>
                  <h3 className="bold">{t('greeting_hello_2')}</h3>
                </div>

                <p className="ceo_desc">{nl2br(t('greeting_ceo_text'))}</p>
              </div>
            </div>

            <div className="ceo_signature">
              <span className="ceo_label">{t('greeting_ceo_label')}</span>
              <strong className="ceo_name">{t('greeting_ceo_name')}</strong>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
