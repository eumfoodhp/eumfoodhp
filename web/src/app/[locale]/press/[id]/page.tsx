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
  const { data: press } = await supabase
    .from('press_releases')
    .select('*')
    .eq('id', id)
    .single();

  if (!press) notFound();

  return (
    <main id="sub_contents" className="press_view_page">
      <SubVisual
        parentLabel={t('menu_news')}
        currentLabel={t('sub_news_press')}
        title={t('sub_news_press')}
        desc=""
        tabBar={<SubTabBar tabs={newsroomTabs(t)} activeKey="press" />}
      />

      <div className="sub_inner">
        <article className="public_view">
          <header className="public_view_head">
            <div className="public_view_meta">
              {press.source && <span className="public_view_cat">{press.source}</span>}
              <span className="public_view_date">
                {new Date(press.created_at).toLocaleDateString('ko-KR')}
              </span>
              <span className="public_view_views">조회 {press.view_count}</span>
            </div>
            <h2 className="public_view_title">{press.title}</h2>
          </header>

          {press.thumbnail && (
            <div className="public_view_thumb">
              <img src={press.thumbnail} alt="" />
            </div>
          )}

          <div className="public_view_body">
            {press.content.split('\n').map((line: string, i: number) => (
              <p key={i}>{line || ' '}</p>
            ))}
          </div>

          {press.link_url && (
            <p className="public_view_link">
              <a href={press.link_url} target="_blank" rel="noopener noreferrer">
                원문 보기 →
              </a>
            </p>
          )}

          <div className="public_view_foot">
            <Link href="/press" className="pf_cancel">← 목록으로</Link>
          </div>
        </article>
      </div>
    </main>
  );
}
