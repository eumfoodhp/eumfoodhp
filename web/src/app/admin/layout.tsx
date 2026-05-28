import type { ReactNode } from 'react';
import './admin.css';

/**
 * Admin 루트 레이아웃 — 자식 그룹별로 별도 layout이 인증/사이드바 처리.
 * - /admin/login: 자체 login layout (인증 없음)
 * - /admin/(authed)/*: 인증 layout (사이드바 포함)
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
