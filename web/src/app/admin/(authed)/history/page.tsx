import { createServerSupabase } from '@/lib/supabase-server';
import HistoryManager from './HistoryManager';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export default async function HistoryListPage() {
  const supabase = await createServerSupabase();
  // select('*') — title_zh 컬럼이 아직 없어도(=db/zh_content.sql 미실행) 에러 없이 로드
  const { data: list } = await supabase
    .from('history_entries')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false, nullsFirst: false })
    .order('sort_order', { ascending: true });

  const initial = (list ?? []).map((e: Record<string, unknown>) => ({
    id: e.id as number,
    year: e.year as number,
    month: (e.month ?? null) as number | null,
    title: e.title as string,
    description: (e.description ?? null) as string | null,
    title_zh: (e.title_zh ?? null) as string | null,
  }));

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">연혁</h2>
      </div>

      <HistoryManager initial={initial} />
    </>
  );
}
