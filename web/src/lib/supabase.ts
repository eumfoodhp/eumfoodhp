/**
 * Supabase 클라이언트 헬퍼.
 * - browserClient(): 브라우저용 (anon key). 공개 SELECT + 인증 사용자 CRUD.
 * - serverClient(): 서버 컴포넌트/API route용. anon key (RLS 적용).
 * - serviceRoleClient(): 관리자 작업용 (service_role key). RLS 우회. SERVER ONLY.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** 브라우저 / 서버 공통 — anon key 사용. RLS 정책 적용됨. */
export function getSupabase() {
  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error('Supabase env(NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) missing');
  }
  return createClient(SUPABASE_URL, ANON_KEY);
}

/** 서버 전용 — service_role key 사용. RLS 우회. */
export function getSupabaseServiceRole() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY missing (server-only env)');
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ============================================================
// 타입 정의 (스키마와 일치)
// ============================================================
export type Notice = {
  id: number;
  title: string;
  content: string;
  title_zh: string | null;
  content_zh: string | null;
  category: string | null;
  is_pinned: boolean;
  view_count: number;
  attachments: Array<{ name: string; url: string; size: number }> | null;
  created_at: string;
  updated_at: string;
  legacy_id: string | null;
  legacy_date: string | null;
};

export type PressRelease = {
  id: number;
  title: string;
  content: string;
  title_zh: string | null;
  content_zh: string | null;
  source: string | null;
  link_url: string | null;
  thumbnail: string | null;
  is_pinned: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  legacy_id: string | null;
  legacy_date: string | null;
};

export type Download = {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  download_count: number;
  created_at: string;
  updated_at: string;
  legacy_id: string | null;
};

export type Contact = {
  id: number;
  writer_name: string;
  email: string | null;
  phone: string | null;
  subject: string;
  content: string;
  is_private: boolean;
  password: string | null;
  answer: string | null;
  answered_at: string | null;
  status: 'pending' | 'answered';
  created_at: string;
  updated_at: string;
  legacy_id: string | null;
};

export type SalesInquiry = {
  id: number;
  company: string;
  position: string | null;
  writer_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  category: string | null;
  content: string;
  attachments: Array<{ name: string; url: string }> | null;
  privacy_agreed: boolean;
  status: 'pending' | 'contacted' | 'closed';
  created_at: string;
  updated_at: string;
  legacy_id: string | null;
};

export type HistoryEntry = {
  id: number;
  year: number;
  month: number | null;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};
