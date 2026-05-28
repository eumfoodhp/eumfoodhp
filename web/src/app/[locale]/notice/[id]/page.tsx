import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { newsroomTabs } from '@/lib/sub-tabs';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/sub.css';
import '@/styles/public-forms.css';

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const supabase = await createServerSupabase();
  const { data: notice } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();

  if (!notice) notFound();

  return (
    <main id="sub_contents" className="notice_view_page">
      <SubVisual
        parentLabel={t('menu_news')}
        currentLabel={t('sub_notice')}
        title={t('sub_notice')}
        desc=""
        tabBar={<SubTabBar tabs={newsroomTabs(t)} activeKey="notice" />}
      />

      <div className="sub_inner">
        <article className="public_view">
          <header className="public_view_head">
            <div className="public_view_meta">
              {notice.is_pinned && <span className="status_chip status_chip--wait">공지</span>}
              {notice.category && <span className="public_view_cat">{notice.category}</span>}
              <span className="public_view_date">
                {new Date(notice.created_at).toLocaleDateString('ko-KR')}
              </span>
              <span className="public_view_views">조회 {notice.view_count}</span>
            </div>
            <h2 className="public_view_title">{notice.title}</h2>
          </header>

          <div className="public_view_body">
            {notice.content.split('\n').map((line: string, i: number) => (
              <p key={i}>{line || ' '}</p>
            ))}
          </div>

          <div className="public_view_foot">
            <Link href="/notice" className="pf_cancel">← 목록으로</Link>
          </div>
        </article>
      </div>
    </main>
  );
}
