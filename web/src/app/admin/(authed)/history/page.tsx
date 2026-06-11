import { createServerSupabase } from '@/lib/supabase-server';
import HistoryManager from './HistoryManager';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export default async function HistoryListPage() {
  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('history_entries')
    .select('id, year, month, title, description')
    .order('year', { ascending: false })
    .order('month', { ascending: false, nullsFirst: false })
    .order('sort_order', { ascending: true });

  const initial = (list ?? []) as {
    id: number;
    year: number;
    month: number | null;
    title: string;
    description: string | null;
  }[];

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">연혁</h2>
      </div>

      <HistoryManager initial={initial} />
    </>
  );
}
