import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  pending: { text: '대기', color: '#EF4444' },
  contacted: { text: '연락중', color: '#F26337' },
  closed: { text: '완료', color: '#10B981' },
};

export default async function SalesListPage() {
  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('sales_inquiries')
    .select('id, company, writer_name, email, category, country, status, created_at')
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">영업 문의</h2>
        <span style={{ fontSize: 13, color: '#6B7280' }}>
          {list?.filter((s) => s.status === 'pending').length ?? 0} 건 대기
        </span>
      </div>

      {!list || list.length === 0 ? (
        <div className="admin_card">접수된 영업 문의가 없습니다.</div>
      ) : (
        <table className="admin_table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>상태</th>
              <th>회사</th>
              <th style={{ width: 120 }}>담당자</th>
              <th style={{ width: 200 }}>이메일</th>
              <th style={{ width: 110 }}>분류</th>
              <th style={{ width: 100 }}>국가</th>
              <th style={{ width: 140 }}>접수일</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => {
              const st = STATUS_LABEL[s.status] ?? STATUS_LABEL.pending;
              return (
                <tr key={s.id}>
                  <td>
                    <span style={{ color: st.color, fontWeight: 600 }}>{st.text}</span>
                  </td>
                  <td>
                    <Link href={`/admin/sales/${s.id}`} style={{ color: '#111827', fontWeight: 500, textDecoration: 'none' }}>
                      {s.company}
                    </Link>
                  </td>
                  <td>{s.writer_name}</td>
                  <td>{s.email}</td>
                  <td>{s.category ?? '-'}</td>
                  <td>{s.country ?? '-'}</td>
                  <td>{new Date(s.created_at).toLocaleString('ko-KR')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
