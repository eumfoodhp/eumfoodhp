import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/sub.css';
import '@/styles/board_pages.css';

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const zh = locale === 'zh';

  const supabase = await createServerSupabase();
  const { data: press } = await supabase
    .from('press_releases')
    .select('*')
    .eq('id', id)
    .single();

  if (!press) notFound();

  const dateStr = new Date(press.created_at).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '');

  return (
    <main id="sub_contents" className="press_view_page">
      <div className="sub_inner">
        <header className="board_page_head">
          <span className="eyebrow">PRESS RELEASE</span>
          <h1>{t('sub_news_press')}</h1>
        </header>

        <article className="board_view">
          <header className="board_view_head">
            <h2 className="board_view_title">{zh && press.title_zh ? press.title_zh : press.title}</h2>
            <div className="board_view_meta">
              <span>작성자</span>
              <i className="dot" aria-hidden />
              <b>이음푸드시스템</b>
              <i className="dot" aria-hidden />
              <span>게시일</span>
              <i className="dot" aria-hidden />
              <b>{dateStr}</b>
              <i className="dot" aria-hidden />
              <span>조회수</span>
              <i className="dot" aria-hidden />
              <b>{press.view_count}</b>
            </div>
          </header>

          {press.thumbnail && (
            <div className="board_view_thumb">
              <img src={press.thumbnail} alt="" />
            </div>
          )}

          <div className="board_view_body">
            {((zh && press.content_zh ? press.content_zh : press.content) ?? '').split('\n').map((line: string, i: number) => (
              <p key={i}>{line || ' '}</p>
            ))}
          </div>

          {press.link_url && (
            <p className="board_view_link">
              <a href={press.link_url} target="_blank" rel="noopener noreferrer">원문 보기 →</a>
            </p>
          )}

          <div className="board_view_foot">
            <Link href="/press" className="board_view_back">{t('contact_back_list')}</Link>
          </div>
        </article>
      </div>
    </main>
  );
}
