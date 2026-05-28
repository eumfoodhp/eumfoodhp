import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase-server';

/**
 * 로그인 페이지 layout. 이미 로그인된 사용자는 대시보드로 리다이렉트.
 */
export default async function AdminLoginLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentAdmin();
  if (user) {
    redirect('/admin');
  }
  return <div className="admin_login_root">{children}</div>;
}
