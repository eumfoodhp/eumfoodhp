'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/admin', label: '대시보드' },
  { href: '/admin/notices', label: '공지사항' },
  { href: '/admin/press', label: '보도자료' },
  { href: '/admin/contacts', label: '1:1 문의' },
  { href: '/admin/sales', label: '영업 문의' },
  { href: '/admin/history', label: '회사 연혁' },
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
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
