import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

/**
 * 영업문의는 /contact 원페이지의 #sales 섹션으로 통합됨.
 * 기존 /contact/sales 직접 진입은 원페이지로 리다이렉트 (locale 유지).
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  redirect(`${prefix}/contact#sales`);
}
