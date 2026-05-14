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
      <main id="sub_contents" className="product_page">
        <SubVisual
          parentLabel={t('menu_product')}
          currentLabel="밀키트"
          title="밀키트"
          desc=""
          tabBar={<SubTabBar tabs={[...productsTabs(t), { key: 'mealkit', href: '/products/mealkit', label: '밀키트' }]} activeKey="mealkit" />}
        />
        <StubBody note="밀키트 제품 페이지 (원본 product_mealkit.php는 placeholder였음)" />
      </main>
    </>
  );
}
