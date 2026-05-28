import { getTranslations, setRequestLocale } from 'next-intl/server';
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
        <StubBody note={`문의 #${id} — DB 마이그레이션 후 표시`} />
      </main>
    </>
  );
}
