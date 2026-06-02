import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase-server';
import AdminNav from './AdminNav';

// admin 페이지는 항상 dynamic (cookies 기반 인증)
export const dynamic = 'force-dynamic';

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
          <div className="admin_brand_top">
            <img src="/images/common/newlogo.png" alt="㈜이음푸드시스템" className="admin_brand_logo" />
            <span className="admin_brand_badge">ADMIN</span>
          </div>
          <p className="admin_user">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <span>{user.email}</span>
          </p>
        </div>
        <AdminNav />
        <form action="/admin/logout" method="post" className="admin_logout_form">
          <button type="submit" className="admin_logout_btn">로그아웃</button>
        </form>
      </aside>
      <main className="admin_main">{children}</main>
    </div>
  );
}
