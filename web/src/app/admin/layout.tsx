import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/supabase-server';
import './admin.css';

/**
 * Admin 전용 레이아웃. /admin/login만 인증 우회.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-invoke-path') || h.get('next-url') || '';
  const isLogin = pathname.includes('/admin/login');

  const user = await getCurrentAdmin();

  if (!user && !isLogin) {
    redirect('/admin/login');
  }
  if (user && isLogin) {
    redirect('/admin');
  }

  if (isLogin || !user) {
    return <div className="admin_login_root">{children}</div>;
  }

  return (
    <div className="admin_root">
      <aside className="admin_sidebar">
        <div className="admin_brand">
          <h1>EumFood Admin</h1>
          <p className="admin_user">{user.email}</p>
        </div>
        <nav className="admin_nav">
          <Link href="/admin" className="admin_nav_item">대시보드</Link>
          <Link href="/admin/notices" className="admin_nav_item">공지사항</Link>
          <Link href="/admin/press" className="admin_nav_item">보도자료</Link>
          <Link href="/admin/downloads" className="admin_nav_item">다운로드</Link>
          <Link href="/admin/contacts" className="admin_nav_item">1:1 문의</Link>
          <Link href="/admin/sales" className="admin_nav_item">영업 문의</Link>
          <Link href="/admin/history" className="admin_nav_item">회사 연혁</Link>
        </nav>
        <form action="/admin/logout" method="post" className="admin_logout_form">
          <button type="submit" className="admin_logout_btn">로그아웃</button>
        </form>
      </aside>
      <main className="admin_main">{children}</main>
    </div>
  );
}
