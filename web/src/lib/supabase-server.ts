/**
 * Server-side Supabase 헬퍼.
 * - createServerSupabase(): 서버 컴포넌트/route handler에서 쿠키 기반 세션 읽기/쓰기
 * - 로그인 상태 추적 가능 (admin 인증 체크용)
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서는 set이 무시될 수 있음. 미들웨어/route handler에서만 동작.
          }
        },
      },
    },
  );
}

/** 현재 로그인된 admin 사용자. 없으면 null. */
export async function getCurrentAdmin() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
