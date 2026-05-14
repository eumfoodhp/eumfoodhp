import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { newsroomTabs } from '@/lib/sub-tabs';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <link rel="stylesheet" href="/css/sub.css" />
      <main id="sub_contents" className="notice_view_page">
        <SubVisual
          parentLabel={t('menu_news')}
          currentLabel={t('sub_notice')}
          title={t('sub_notice')}
          desc=""
          tabBar={<SubTabBar tabs={newsroomTabs(t)} activeKey="notice" />}
        />
        <StubBody note={`공지사항 #${id} — DB 마이그레이션 후 표시`} />
      </main>
    </>
  );
}
