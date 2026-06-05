import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import { updateHistory, deleteHistory } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: h } = await supabase
    .from('history_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (!h) notFound();

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">연혁 — 수정</h2>
        <Link href="/admin/history" className="admin_btn secondary">← 목록</Link>
      </div>

      <form action={updateHistory} className="admin_form admin_card">
        <input type="hidden" name="id" value={h.id} />

        <div style={{ display: 'flex', gap: 16 }}>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="year">연도 *</label>
            <input id="year" type="number" name="year" required min="1900" max="2099" defaultValue={h.year} />
          </div>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="month">월</label>
            <input id="month" type="number" name="month" min="1" max="12" defaultValue={h.month ?? ''} />
          </div>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="sort_order">정렬 순서</label>
            <input id="sort_order" type="number" name="sort_order" defaultValue={h.sort_order ?? 0} />
          </div>
        </div>

        <div className="admin_field">
          <label htmlFor="title">제목 *</label>
          <input id="title" type="text" name="title" required defaultValue={h.title} />
        </div>

        <div className="admin_field">
          <label htmlFor="description">설명</label>
          <textarea id="description" name="description" rows={3} defaultValue={h.description ?? ''} />
        </div>

        <div className="admin_form_actions">
          <button type="submit" className="admin_btn">수정 저장</button>
          <Link href="/admin/history" className="admin_btn secondary">취소</Link>
        </div>
      </form>

      <form
        action={deleteHistory}
        className="admin_card"
        style={{ marginTop: 24 }}
      >
        <input type="hidden" name="id" value={h.id} />
        <p style={{ margin: '0 0 12px', color: '#6B7280' }}>이 연혁 항목을 영구 삭제합니다.</p>
        <button type="submit" className="admin_btn danger">삭제</button>
      </form>
    </>
  );
}
