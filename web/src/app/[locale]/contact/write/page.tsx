import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { supportTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <main id="sub_contents" className="contact_write_page">
        <SubVisual
          parentLabel={t('menu_support')}
          currentLabel={t('contact_write')}
          title={t('contact_write')}
          desc={t('contact_write_desc')}
          tabBar={<SubTabBar tabs={supportTabs(t)} activeKey="contact" />}
        />
        <StubBody note="1:1 문의 글쓰기 폼 — Server Action + 이메일 발송으로 포팅 예정" />
      </main>
    </>
  );
}
