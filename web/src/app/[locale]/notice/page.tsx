import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { newsroomTabs } from '@/lib/sub-tabs';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/sub.css';
import '@/styles/public-forms.css';

export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('notices')
    .select('id, title, category, is_pinned, view_count, created_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <main id="sub_contents" className="notice_page">
      <div className="sub_inner">
        <div className="public_list_head">
          <span className="public_list_count">총 {list?.length ?? 0}건</span>
        </div>

        {!list || list.length === 0 ? (
          <div className="public_empty">등록된 공지사항이 없습니다.</div>
        ) : (
          <table className="public_table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>번호</th>
                <th style={{ width: 110 }}>분류</th>
                <th>제목</th>
                <th style={{ width: 80 }}>조회</th>
                <th style={{ width: 140 }}>등록일</th>
              </tr>
            </thead>
            <tbody>
              {list.map((n, idx) => (
                <tr key={n.id}>
                  <td>
                    {n.is_pinned ? (
                      <span className="status_chip status_chip--wait" title="상단 고정">공지</span>
                    ) : (
                      list.length - idx
                    )}
                  </td>
                  <td>{n.category ?? '-'}</td>
                  <td className="public_table_title">
                    <Link
                      href={`/notice/${n.id}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {n.title}
                    </Link>
                  </td>
                  <td>{n.view_count}</td>
                  <td>{new Date(n.created_at).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
