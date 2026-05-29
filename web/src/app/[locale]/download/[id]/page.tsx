import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/sub.css';
import '@/styles/board_pages.css';

export const revalidate = 0;

function formatSize(bytes: number | null): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const supabase = await createServerSupabase();
  const { data: d } = await supabase
    .from('downloads')
    .select('*')
    .eq('id', id)
    .single();

  if (!d) notFound();

  const dateStr = new Date(d.created_at).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '');

  return (
    <main id="sub_contents" className="download_view_page">
      <div className="sub_inner">
        <header className="board_page_head">
          <span className="eyebrow">DOWNLOAD</span>
          <h1>자료실</h1>
        </header>

        <article className="board_view">
          <header className="board_view_head">
            <h2 className="board_view_title">{d.title}</h2>
            <div className="board_view_meta">
              <span>작성자</span>
              <i className="dot" aria-hidden />
              <b>이음푸드시스템</b>
              <i className="dot" aria-hidden />
              <span>게시일</span>
              <i className="dot" aria-hidden />
              <b>{dateStr}</b>
              <i className="dot" aria-hidden />
              <span>다운로드</span>
              <i className="dot" aria-hidden />
              <b>{d.download_count}</b>
            </div>
          </header>

          {d.description && (
            <div className="board_view_body">
              {d.description.split('\n').map((line: string, i: number) => (
                <p key={i}>{line || ' '}</p>
              ))}
            </div>
          )}

          <div className="board_dl_detail">
            <dl>
              <dt>형식</dt>
              <dd>{d.file_type ? d.file_type.toUpperCase() : '-'}</dd>
              <dt>크기</dt>
              <dd>{formatSize(d.file_size)}</dd>
            </dl>
            <a href={d.file_url} download className="board_dl_btn" aria-label={`${d.title} 다운로드`}>
              <DownloadIcon />
              <span>다운로드</span>
            </a>
          </div>

          <div className="board_view_foot">
            <Link href="/download" className="board_view_back">목록으로</Link>
          </div>
        </article>
      </div>
    </main>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
