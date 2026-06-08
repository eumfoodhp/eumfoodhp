import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import { updatePress, deletePress } from '../actions';
import AdminDeleteButton from '../../AdminDeleteButton';

export const dynamic = 'force-dynamic';

export default async function EditPressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: press } = await supabase
    .from('press_releases')
    .select('*')
    .eq('id', id)
    .single();

  if (!press) notFound();

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">보도자료 — 수정</h2>
        <Link href="/admin/press" className="admin_btn secondary">← 목록</Link>
      </div>

      <form action={updatePress} className="admin_form admin_card">
        <input type="hidden" name="id" value={press.id} />

        <div className="admin_field">
          <label htmlFor="title">제목 *</label>
          <input id="title" type="text" name="title" required defaultValue={press.title} />
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="source">매체</label>
            <input id="source" type="text" name="source" defaultValue={press.source ?? ''} />
          </div>
          <div className="admin_field" style={{ flex: 2 }}>
            <label htmlFor="link_url">원본 기사 URL</label>
            <input id="link_url" type="url" name="link_url" defaultValue={press.link_url ?? ''} />
          </div>
        </div>

        <div className="admin_field">
          <label htmlFor="thumbnail">
            썸네일 이미지 URL{' '}
            <span style={{ fontWeight: 400, color: '#888', fontSize: 13 }}>
              — 기사 주소를 넣고 저장하면 대표이미지 자동 추출 / 비우면 위 원본 기사 URL 에서 자동
            </span>
          </label>
          <input id="thumbnail" type="url" name="thumbnail" defaultValue={press.thumbnail ?? ''} placeholder="이미지 주소 또는 기사 주소 (자동 추출)" />
        </div>

        <div className="admin_field">
          <label htmlFor="content">내용 *</label>
          <textarea id="content" name="content" required defaultValue={press.content} />
        </div>

        <div className="admin_form_actions">
          <button type="submit" className="admin_btn">수정 저장</button>
          <AdminDeleteButton action={deletePress} message="이 보도자료를 삭제할까요? 되돌릴 수 없습니다." />
          <Link href="/admin/press" className="admin_btn secondary">취소</Link>
        </div>
      </form>
    </>
  );
}
