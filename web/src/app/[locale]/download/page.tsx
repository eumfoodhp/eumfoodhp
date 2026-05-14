import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { newsroomTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <main id="sub_contents" className="download_page">
        <SubVisual
          parentLabel={t('menu_news')}
          currentLabel={t('sub_board')}
          title={t('sub_board')}
          desc=""
          tabBar={<SubTabBar tabs={newsroomTabs(t)} activeKey="download" />}
        />
        <StubBody note="다운로드 자료실(회사소개서/카탈로그/CI로고 등) — 정식 페이지 포팅 예정" />
      </main>
    </>
  );
}
