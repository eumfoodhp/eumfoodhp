import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { productsTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <main id="sub_contents" className="process_page">
        <SubVisual
          parentLabel={t('sub_biz_process')}
          currentLabel={t('sub_prod_salted')}
          title={t('sub_prod_salted')}
          desc={t('proc_salted_top_desc')}
          tabBar={<SubTabBar tabs={productsTabs(t)} activeKey="salted" />}
        />
        <StubBody note="양념젓갈·젓갈류 공정 다이어그램 포팅 예정 (원본 process_salted.php)" />
      </main>
    </>
  );
}
