import { getTranslations, setRequestLocale } from 'next-intl/server';
import { aboutTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/about_organization.css';

const ORG_CHART_BY_LOCALE: Record<string, string> = {
  ko: '/images/sub/org-chart-v3.png',
  en: '/images/sub/org-chart-en.png',
  zh: '/images/sub/org-chart-zh.png',
};

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const orgChartSrc =
    (t.raw('org_chart_image') as string | undefined) ?? ORG_CHART_BY_LOCALE[locale] ?? ORG_CHART_BY_LOCALE.ko;

  return (
    <>

      <main id="sub_contents" className="organization_page">
        <section className="org_content_section">
          <div className="org_container">
            <div className="org_chart_wrap">
              <div className="org_chart_image_wrap">
                <img
                  src={orgChartSrc}
                  alt={t('org_title')}
                  className="org_chart_image"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="org_bg_typo">{t('org_bg_text')}</div>
          </div>
        </section>
      </main>
    </>
  );
}
