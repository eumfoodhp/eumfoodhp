import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { deleteNotice, toggleNoticePin } from './actions';
import NoticePinToggle from './NoticePinToggle';

export const dynamic = 'force-dynamic';

export default async function NoticesListPage() {
  const supabase = await createServerSupabase();
  const { data: notices } = await supabase
    .from('notices')
    .select('id, title, category, is_pinned, view_count, created_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">공지사항</h2>
        <Link href="/admin/notices/new" className="admin_btn">추가</Link>
      </div>

      {!notices || notices.length === 0 ? (
        <div className="admin_card">등록된 공지사항이 없습니다.</div>
      ) : (
        <table className="admin_table">
          <thead>
            <tr>
              <th style={{ width: 56, textAlign: 'center' }}>고정</th>
              <th>제목</th>
              <th style={{ width: 120 }}>분류</th>
              <th style={{ width: 80 }}>조회</th>
              <th style={{ width: 120 }}>등록일</th>
              <th style={{ width: 180 }}></th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n) => (
              <tr key={n.id}>
                <td style={{ textAlign: 'center' }}>
                  <NoticePinToggle id={n.id} pinned={!!n.is_pinned} action={toggleNoticePin} />
                </td>
                <td>
                  <Link href={`/admin/notices/${n.id}`} style={{ color: '#111827', fontWeight: 500, textDecoration: 'none' }}>
                    {n.is_pinned ? <span title="상단 고정" style={{ marginRight: 6 }}>📌</span> : null}
                    {n.title}
                  </Link>
                </td>
                <td>{n.category ?? '-'}</td>
                <td>{n.view_count}</td>
                <td>{new Date(n.created_at).toLocaleDateString('ko-KR')}</td>
                <td className="col_actions">
                  <Link href={`/admin/notices/${n.id}`} className="admin_btn secondary">수정</Link>
                  <form action={deleteNotice}>
                    <input type="hidden" name="id" value={n.id} />
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
