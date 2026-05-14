import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { supportTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';

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
      <main id="sub_contents" className="contact_view_page">
        <SubVisual
          parentLabel={t('menu_support')}
          currentLabel={t('sub_inquiry_1to1')}
          title={t('sub_inquiry_1to1')}
          desc={t('contact_hero_desc')}
          tabBar={<SubTabBar tabs={supportTabs(t)} activeKey="contact" />}
        />
        <StubBody note={`문의 #${id} — DB 마이그레이션 후 표시`} />
      </main>
    </>
  );
}
