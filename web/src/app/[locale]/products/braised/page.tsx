import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import StubBody from '@/components/StubBody';
import { productsTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/product_braised.css';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <main id="sub_contents" className="product_page">
        <SubVisual
          parentLabel={t('menu_product')}
          currentLabel={t('sub_prod_braised')}
          title={t('sub_prod_braised')}
          desc=""
          tabBar={<SubTabBar tabs={productsTabs(t)} activeKey="braised" />}
        />
        <StubBody note="조림류 제품 상세 포팅 예정 (원본 product_braised.php)" />
      </main>
    </>
  );
}
