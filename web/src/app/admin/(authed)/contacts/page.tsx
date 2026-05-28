import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function ContactsListPage() {
  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('contacts')
    .select('id, writer_name, email, subject, status, is_private, created_at')
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">1:1 문의</h2>
        <span style={{ fontSize: 13, color: '#6B7280' }}>
          {list?.filter((c) => c.status === 'pending').length ?? 0} 건 미답변
        </span>
      </div>

      {!list || list.length === 0 ? (
        <div className="admin_card">접수된 문의가 없습니다.</div>
      ) : (
        <table className="admin_table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>상태</th>
              <th>제목</th>
              <th style={{ width: 120 }}>작성자</th>
              <th style={{ width: 180 }}>이메일</th>
              <th style={{ width: 60 }}>비공개</th>
              <th style={{ width: 140 }}>접수일</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>
                  {c.status === 'answered' ? (
                    <span style={{ color: '#10B981', fontWeight: 600 }}>답변완료</span>
                  ) : (
                    <span style={{ color: '#EF4444', fontWeight: 600 }}>대기</span>
                  )}
                </td>
                <td>
                  <Link href={`/admin/contacts/${c.id}`} style={{ color: '#111827', fontWeight: 500, textDecoration: 'none' }}>
                    {c.subject}
                  </Link>
                </td>
                <td>{c.writer_name}</td>
                <td>{c.email ?? '-'}</td>
                <td>{c.is_private ? '🔒' : ''}</td>
                <td>{new Date(c.created_at).toLocaleString('ko-KR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
