import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { businessTabs } from '@/lib/sub-tabs';

export default async function BusinessProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <link rel="stylesheet" href="/css/sub.css" />
      <link rel="stylesheet" href="/css/business_process.css" />

      <main id="sub_contents" className="business_process_page">
        <SubVisual
          parentLabel={t('menu_business')}
          currentLabel={t('sub_biz_process')}
          title={t('sub_biz_process')}
          desc={t('biz_process_sub_desc')}
          tabBar={<SubTabBar tabs={businessTabs(t)} activeKey="process" />}
        />
        <StubBody note="제조공정 상세 다이어그램은 원본에서 가져와 정식 포팅 예정입니다." />
      </main>
    </>
  );
}
