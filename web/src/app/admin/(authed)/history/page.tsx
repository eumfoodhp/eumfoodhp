import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { deleteHistory } from './actions';

export const dynamic = 'force-dynamic';

type Entry = {
  id: number;
  year: number;
  month: number | null;
  title: string;
  description: string | null;
  sort_order: number;
};

export default async function HistoryListPage() {
  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('history_entries')
    .select('id, year, month, title, description, sort_order')
    .order('year', { ascending: false })
    .order('month', { ascending: false, nullsFirst: false })
    .order('sort_order', { ascending: true });

  // 연도별로 묶기 (내림차순)
  const byYear = new Map<number, Entry[]>();
  for (const h of (list ?? []) as Entry[]) {
    if (!byYear.has(h.year)) byYear.set(h.year, []);
    byYear.get(h.year)!.push(h);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">회사 연혁</h2>
        <Link href="/admin/history/new" className="admin_btn">+ 연혁 추가</Link>
      </div>

      {years.length === 0 ? (
        <div className="admin_card">등록된 연혁이 없습니다.</div>
      ) : (
        <div className="hist_groups">
          {years.map((y) => (
            <div key={y} className="hist_year_group admin_card">
              <div className="hist_year_head">
                <h3 className="hist_year">
                  {y}
                  <span className="hist_year_count">{byYear.get(y)!.length}건</span>
                </h3>
                <Link href={`/admin/history/new?year=${y}`} className="admin_btn secondary">
                  + 이 해에 추가
                </Link>
              </div>

              <ul className="hist_items">
                {byYear.get(y)!.map((h) => (
                  <li key={h.id} className="hist_item">
                    <span className="hist_item_title">
                      {h.month ? <span className="hist_item_month">{h.month}월</span> : null}
                      <Link href={`/admin/history/${h.id}`} className="hist_item_link">{h.title}</Link>
                      {h.description ? <span className="hist_item_desc">— {h.description}</span> : null}
                    </span>
                    <span className="hist_item_actions">
                      <Link href={`/admin/history/${h.id}`} className="admin_btn secondary">수정</Link>
                      <form action={deleteHistory}>
                        <input type="hidden" name="id" value={h.id} />
                        <button type="submit" className="admin_btn danger">삭제</button>
                      </form>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
