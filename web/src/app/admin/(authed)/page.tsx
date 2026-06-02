import { createServerSupabase } from '@/lib/supabase-server';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabase();

  // 각 테이블 카운트
  const [notices, press, contacts, sales, history] = await Promise.all([
    supabase.from('notices').select('*', { count: 'exact', head: true }),
    supabase.from('press_releases').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('sales_inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('history_entries').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { label: '공지사항', count: notices.count ?? 0, href: '/admin/notices' },
    { label: '보도자료', count: press.count ?? 0, href: '/admin/press' },
    { label: '1:1 문의', count: contacts.count ?? 0, href: '/admin/contacts' },
    { label: '영업 문의', count: sales.count ?? 0, href: '/admin/sales' },
    { label: '회사 연혁', count: history.count ?? 0, href: '/admin/history' },
  ];

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">대시보드</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {stats.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="admin_card"
            style={{
              textDecoration: 'none',
              color: '#111827',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4, color: '#F26337' }}>
              {s.count}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>총 항목 수</div>
          </a>
        ))}
      </div>
    </>
  );
}
