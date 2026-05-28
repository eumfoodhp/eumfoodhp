import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { newsroomTabs } from '@/lib/sub-tabs';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/sub.css';
import '@/styles/public-forms.css';

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

  return (
    <main id="sub_contents" className="download_view_page">
      <div className="sub_inner">
        <article className="public_view">
          <header className="public_view_head">
            <div className="public_view_meta">
              {d.category && <span className="public_view_cat">{d.category}</span>}
              <span className="public_view_date">
                {new Date(d.created_at).toLocaleDateString('ko-KR')}
              </span>
              <span className="public_view_views">다운로드 {d.download_count}회</span>
            </div>
            <h2 className="public_view_title">{d.title}</h2>
          </header>

          {d.description && (
            <div className="public_view_body">
              {d.description.split('\n').map((line: string, i: number) => (
                <p key={i}>{line || ' '}</p>
              ))}
            </div>
          )}

          <div className="dl_detail_box">
            <dl>
              <dt>형식</dt>
              <dd>{d.file_type ? d.file_type.toUpperCase() : '-'}</dd>
              <dt>크기</dt>
              <dd>{formatSize(d.file_size)}</dd>
            </dl>
            <a href={d.file_url} download className="dl_btn dl_btn--lg" aria-label={`${d.title} 다운로드`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>다운로드</span>
            </a>
          </div>

          <div className="public_view_foot">
            <Link href="/download" className="pf_cancel">← 목록으로</Link>
          </div>
        </article>
      </div>
    </main>
  );
}
