import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { supportTabs } from '@/lib/sub-tabs';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <link rel="stylesheet" href="/css/sub.css" />
      <main id="sub_contents" className="contact_page">
        <SubVisual
          parentLabel={t('menu_support')}
          currentLabel={t('sub_inquiry_1to1')}
          title={t('sub_inquiry_1to1')}
          desc={t('contact_hero_desc')}
          tabBar={<SubTabBar tabs={supportTabs(t)} activeKey="contact" />}
        />
        <StubBody note="1:1 문의 목록 — DB 마이그레이션 후 표시. /contact/write 로 글쓰기 가능." />
      </main>
    </>
  );
}
