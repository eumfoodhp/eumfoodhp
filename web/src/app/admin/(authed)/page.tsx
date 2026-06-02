import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabase();

  const [notices, press, history, contacts, sales] = await Promise.all([
    supabase.from('notices').select('*', { count: 'exact', head: true }),
    supabase.from('press_releases').select('*', { count: 'exact', head: true }),
    supabase.from('history_entries').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('sales_inquiries').select('*', { count: 'exact', head: true }),
  ]);

  const content = [
    { label: '공지사항', count: notices.count ?? 0, href: '/admin/notices', icon: <NoticeIcon /> },
    { label: '보도자료', count: press.count ?? 0, href: '/admin/press', icon: <PressIcon /> },
    { label: '회사 연혁', count: history.count ?? 0, href: '/admin/history', icon: <HistoryIcon /> },
  ];
  const inquiry = [
    { label: '1:1 문의', count: contacts.count ?? 0, href: '/admin/contacts', icon: <ChatIcon /> },
    { label: '영업 문의', count: sales.count ?? 0, href: '/admin/sales', icon: <MailIcon /> },
  ];

  return (
    <>
      <div className="admin_page_header">
        <div>
          <h2 className="admin_page_title">대시보드</h2>
          <p className="admin_page_desc">㈜이음푸드시스템 콘텐츠·문의 관리</p>
        </div>
      </div>

      <p className="admin_section_label">콘텐츠</p>
      <div className="admin_dash_grid">
        {content.map((s) => (
          <Link key={s.href} href={s.href} className="admin_stat">
            <span className="admin_stat_icon">{s.icon}</span>
            <div className="admin_stat_body">
              <span className="admin_stat_label">{s.label}</span>
              <span className="admin_stat_count">{s.count}<em>건</em></span>
            </div>
          </Link>
        ))}
      </div>

      <p className="admin_section_label">문의</p>
      <div className="admin_dash_grid">
        {inquiry.map((s) => (
          <Link key={s.href} href={s.href} className="admin_stat admin_stat--inquiry">
            <span className="admin_stat_icon">{s.icon}</span>
            <div className="admin_stat_body">
              <span className="admin_stat_label">{s.label}</span>
              <span className="admin_stat_count">{s.count}<em>건</em></span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

/* --- 아이콘 (stroke currentColor) --- */
function NoticeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 0 1-5.8-1.6" />
    </svg>
  );
}
function PressIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 22V4a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v16a2 2 0 0 0 2-2v-9h-3" /><path d="M4 22a2 2 0 0 1-2-2v-9h2" /><line x1="8" y1="7" x2="15" y2="7" /><line x1="8" y1="11" x2="15" y2="11" /><line x1="8" y1="15" x2="12" y2="15" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><path d="M12 7v5l4 2" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
    </svg>
  );
}
