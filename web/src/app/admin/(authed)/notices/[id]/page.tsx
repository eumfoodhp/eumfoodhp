import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import { updateNotice, deleteNotice } from '../actions';
import AdminDeleteButton from '../../AdminDeleteButton';

export const dynamic = 'force-dynamic';

export default async function EditNoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: notice } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();

  if (!notice) notFound();

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">공지사항 — 수정</h2>
        <Link href="/admin/notices" className="admin_btn secondary">← 목록</Link>
      </div>

      <form action={updateNotice} className="admin_form admin_card">
        <input type="hidden" name="id" value={notice.id} />

        <div className="admin_field">
          <label htmlFor="title">제목 *</label>
          <input id="title" type="text" name="title" required defaultValue={notice.title} />
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="category">분류</label>
            <input
              id="category"
              type="text"
              name="category"
              defaultValue={notice.category ?? ''}
              placeholder="(선택)"
            />
          </div>
          <div className="admin_field" style={{ flex: 0, minWidth: 140 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 24 }}>
              <input type="checkbox" name="is_pinned" defaultChecked={notice.is_pinned} /> 상단 고정
            </label>
          </div>
        </div>

        <div className="admin_field">
          <label htmlFor="content">내용 *</label>
          <textarea id="content" name="content" required defaultValue={notice.content} />
        </div>

        <div className="admin_form_actions">
          <button type="submit" className="admin_btn">수정 저장</button>
          <AdminDeleteButton action={deleteNotice} message="이 공지사항을 삭제할까요? 되돌릴 수 없습니다." />
          <Link href="/admin/notices" className="admin_btn secondary">취소</Link>
        </div>
      </form>
    </>
  );
}
