'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/admin', label: '대시보드', icon: <DashIcon /> },
  { href: '/admin/notices', label: '공지사항', icon: <NoticeIcon /> },
  { href: '/admin/press', label: '보도자료', icon: <PressIcon /> },
  { href: '/admin/history', label: '연혁', icon: <HistoryIcon /> },
  { href: '/admin/contacts', label: '1:1 문의', icon: <ChatIcon /> },
  { href: '/admin/sales', label: '영업 문의', icon: <MailIcon /> },
];

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <nav className="admin_nav">
      {ITEMS.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={`admin_nav_item${isActive(it.href) ? ' active' : ''}`}
        >
          <span className="admin_nav_icon">{it.icon}</span>
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

/* --- 네비 아이콘 (stroke currentColor → 활성/호버 색 상속) --- */
function DashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}
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
