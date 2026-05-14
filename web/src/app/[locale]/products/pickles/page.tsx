import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { productsTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/product_pickles.css';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <main id="sub_contents" className="product_page">
        <SubVisual
          parentLabel={t('menu_product')}
          currentLabel={t('sub_prod_pickles')}
          title={t('sub_prod_pickles')}
          desc=""
          tabBar={<SubTabBar tabs={productsTabs(t)} activeKey="pickles" />}
        />
        <StubBody note="제품 상세 그리드 포팅 예정 (원본 product_pickles.php 18개 아이템)" />
      </main>
    </>
  );
}
