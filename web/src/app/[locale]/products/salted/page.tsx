import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { productsTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/product_salted.css';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <main id="sub_contents" className="product_page">
        <SubVisual
          parentLabel={t('menu_product')}
          currentLabel={t('sub_prod_salted')}
          title={t('sub_prod_salted')}
          desc=""
          tabBar={<SubTabBar tabs={productsTabs(t)} activeKey="salted" />}
        />
        <StubBody note="양념젓갈·젓갈류 제품 상세 포팅 예정 (원본 product_salted.php)" />
      </main>
    </>
  );
}
