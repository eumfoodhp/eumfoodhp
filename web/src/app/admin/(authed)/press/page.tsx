import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { deletePress, togglePressPin } from './actions';
import PressPinToggle from './PressPinToggle';

export const dynamic = 'force-dynamic';

export default async function PressListPage() {
  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('press_releases')
    .select('id, title, source, is_pinned, view_count, created_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">보도자료</h2>
        <Link href="/admin/press/new" className="admin_btn">+ 새 글 작성</Link>
      </div>

      {!list || list.length === 0 ? (
        <div className="admin_card">등록된 보도자료가 없습니다.</div>
      ) : (
        <table className="admin_table">
          <thead>
            <tr>
              <th style={{ width: 56, textAlign: 'center' }}>고정</th>
              <th>제목</th>
              <th style={{ width: 140 }}>매체</th>
              <th style={{ width: 70 }}>조회</th>
              <th style={{ width: 120 }}>등록일</th>
              <th style={{ width: 160 }}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td style={{ textAlign: 'center' }}>
                  <PressPinToggle id={p.id} pinned={!!p.is_pinned} action={togglePressPin} />
                </td>
                <td>
                  <Link href={`/admin/press/${p.id}`} style={{ color: '#111827', fontWeight: 500, textDecoration: 'none' }}>
                    {p.is_pinned ? <span title="상단 고정" style={{ marginRight: 6 }}>📌</span> : null}
                    {p.title}
                  </Link>
                </td>
                <td>{p.source ?? '-'}</td>
                <td>{p.view_count}</td>
                <td>{new Date(p.created_at).toLocaleDateString('ko-KR')}</td>
                <td className="col_actions">
                  <Link href={`/admin/press/${p.id}`} className="admin_btn secondary">수정</Link>
                  <form action={deletePress}>
                    <input type="hidden" name="id" value={p.id} />
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
