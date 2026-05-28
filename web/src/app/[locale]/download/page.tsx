import { getTranslations, setRequestLocale } from 'next-intl/server';
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

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('downloads')
    .select('id, title, description, category, file_url, file_size, file_type, download_count, created_at')
    .order('created_at', { ascending: false });

  return (
    <main id="sub_contents" className="download_page">
      <div className="sub_inner">
        <div className="public_list_head">
          <span className="public_list_count">총 {list?.length ?? 0}건</span>
        </div>

        {!list || list.length === 0 ? (
          <div className="public_empty">등록된 자료가 없습니다.</div>
        ) : (
          <ul className="download_list">
            {list.map((d) => (
              <li key={d.id} className="download_item">
                <div className="dl_main">
                  {d.category && <span className="dl_cat">{d.category}</span>}
                  <h3 className="dl_title">{d.title}</h3>
                  {d.description && <p className="dl_desc">{d.description}</p>}
                  <div className="dl_meta">
                    {d.file_type && <span>{d.file_type.toUpperCase()}</span>}
                    {d.file_size != null && <span>{formatSize(d.file_size)}</span>}
                    <span>다운로드 {d.download_count}회</span>
                    <span>등록일 {new Date(d.created_at).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <a
                  href={d.file_url}
                  download
                  className="dl_btn"
                  aria-label={`${d.title} 다운로드`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>다운로드</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
