import { getTranslations, setRequestLocale } from 'next-intl/server';
import StubBody from '@/components/StubBody';
import { productsTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <main id="sub_contents" className="product_page">
        <StubBody note="밀키트 제품 페이지 (원본 product_mealkit.php는 placeholder였음)" />
      </main>
    </>
  );
}
