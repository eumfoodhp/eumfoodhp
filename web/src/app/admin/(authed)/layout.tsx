import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/supabase-server';

/**
 * 인증 필요한 admin 페이지 레이아웃 — 미인증 시 로그인 페이지로 리다이렉트.
 * 사이드바 + 메인 영역 구성.
 */
export default async function AdminAuthedLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentAdmin();
  if (!user) {
    redirect('/admin/login');
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
