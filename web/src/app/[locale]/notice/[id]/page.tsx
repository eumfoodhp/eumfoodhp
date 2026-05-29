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

  const supabase = await createServerSupabase();
  const { data: notice } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();

  if (!notice) notFound();

  const dateStr = new Date(notice.created_at).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '');

  return (
    <main id="sub_contents" className="notice_view_page">
      <div className="sub_inner">
        <header className="board_page_head">
          <span className="eyebrow">NOTICE</span>
          <h1>공지사항</h1>
        </header>

        <article className="board_view">
          <header className="board_view_head">
            <h2 className="board_view_title">{notice.title}</h2>
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
              <b>{notice.view_count}</b>
            </div>
          </header>

          <div className="board_view_body">
            {(notice.content ?? '').split('\n').map((line: string, i: number) => (
              <p key={i}>{line || ' '}</p>
            ))}
          </div>

          <div className="board_view_foot">
            <Link href="/notice" className="board_view_back">목록으로</Link>
          </div>
        </article>
      </div>
    </main>
  );
}
