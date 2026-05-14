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
      <main id="sub_contents" className="contact_sales_page">
        <SubVisual
          parentLabel={t('menu_support')}
          currentLabel={t('sub_inquiry_sales')}
          title={t('sub_inquiry_sales')}
          desc=""
          tabBar={<SubTabBar tabs={supportTabs(t)} activeKey="sales" />}
        />
        <StubBody note="영업문의 폼 — Server Action + 이메일 발송으로 포팅 예정" />
      </main>
    </>
  );
}
