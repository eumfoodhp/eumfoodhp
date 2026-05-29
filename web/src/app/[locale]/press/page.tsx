/**
 * /press 라우트 — 소식 onepage 의 보도자료 섹션으로 redirect.
 * 통합된 /notice (onepage) 으로 보내되, 보도자료 anchor 로 스크롤.
 */
import { redirect } from '@/i18n/navigation';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect({ href: '/notice#press', locale });
}
