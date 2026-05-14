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
          currentLabel="밀키트"
          title="밀키트 공정"
          desc=""
          tabBar={<SubTabBar tabs={productsTabs(t)} activeKey="mealkit" />}
        />
        <StubBody note="밀키트 공정 (원본 process_mealkit.php는 placeholder였음)" />
      </main>
    </>
  );
}
