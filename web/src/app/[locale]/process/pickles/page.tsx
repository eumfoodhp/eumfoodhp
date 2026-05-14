import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { productsTabs } from '@/lib/sub-tabs';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <link rel="stylesheet" href="/css/sub.css" />
      <main id="sub_contents" className="process_page">
        <SubVisual
          parentLabel={t('sub_biz_process')}
          currentLabel={t('sub_prod_pickles')}
          title={t('proc_pickles_title')}
          desc={t('proc_pickles_top_desc')}
          tabBar={<SubTabBar tabs={productsTabs(t)} activeKey="pickles" />}
        />
        <StubBody note="절임식품 공정 8단계 상세 다이어그램 포팅 예정 (원본 process_pickles.php)" />
      </main>
    </>
  );
}
