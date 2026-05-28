import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { deleteHistory } from './actions';

export const dynamic = 'force-dynamic';

export default async function HistoryListPage() {
  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('history_entries')
    .select('id, year, month, title, description, sort_order')
    .order('year', { ascending: false })
    .order('month', { ascending: false, nullsFirst: false })
    .order('sort_order', { ascending: true });

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">회사 연혁</h2>
        <Link href="/admin/history/new" className="admin_btn">+ 연혁 추가</Link>
      </div>

      {!list || list.length === 0 ? (
        <div className="admin_card">등록된 연혁이 없습니다.</div>
      ) : (
        <table className="admin_table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>연도</th>
              <th style={{ width: 60 }}>월</th>
              <th>제목</th>
              <th>설명</th>
              <th style={{ width: 70 }}>정렬</th>
              <th style={{ width: 180 }}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((h) => (
              <tr key={h.id}>
                <td style={{ fontWeight: 600 }}>{h.year}</td>
                <td>{h.month ? `${h.month}월` : '-'}</td>
                <td>
                  <Link href={`/admin/history/${h.id}`} style={{ color: '#111827', fontWeight: 500, textDecoration: 'none' }}>
                    {h.title}
                  </Link>
                </td>
                <td style={{ color: '#6B7280', fontSize: 13 }}>
                  {h.description ? (h.description.length > 50 ? h.description.slice(0, 50) + '…' : h.description) : '-'}
                </td>
                <td>{h.sort_order}</td>
                <td className="col_actions">
                  <Link href={`/admin/history/${h.id}`} className="admin_btn secondary">수정</Link>
                  <form action={deleteHistory}>
                    <input type="hidden" name="id" value={h.id} />
                    <button type="submit" className="admin_btn danger">삭제</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
