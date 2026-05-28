import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import { updateDownload, deleteDownload } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditDownloadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: item } = await supabase
    .from('downloads')
    .select('*')
    .eq('id', id)
    .single();

  if (!item) notFound();

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">자료 — 수정</h2>
        <Link href="/admin/downloads" className="admin_btn secondary">← 목록</Link>
      </div>

      <form action={updateDownload} className="admin_form admin_card">
        <input type="hidden" name="id" value={item.id} />

        <div className="admin_field">
          <label htmlFor="title">제목 *</label>
          <input id="title" type="text" name="title" required defaultValue={item.title} />
        </div>

        <div className="admin_field">
          <label htmlFor="description">설명</label>
          <textarea id="description" name="description" rows={3} defaultValue={item.description ?? ''} />
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="category">분류</label>
            <input id="category" type="text" name="category" defaultValue={item.category ?? ''} />
          </div>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="file_type">파일 형식</label>
            <input id="file_type" type="text" name="file_type" defaultValue={item.file_type ?? ''} />
          </div>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="file_size">파일 크기 (bytes)</label>
            <input id="file_size" type="number" name="file_size" min="0" defaultValue={item.file_size ?? ''} />
          </div>
        </div>

        <div className="admin_field">
          <label htmlFor="file_url">파일 URL *</label>
          <input id="file_url" type="text" name="file_url" required defaultValue={item.file_url} />
        </div>

        <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 8px' }}>
          다운로드 횟수: {item.download_count} | 등록일: {new Date(item.created_at).toLocaleDateString('ko-KR')}
        </p>

        <div className="admin_form_actions">
          <button type="submit" className="admin_btn">수정 저장</button>
          <Link href="/admin/downloads" className="admin_btn secondary">취소</Link>
        </div>
      </form>

      <form
        action={deleteDownload}
        className="admin_card"
        style={{ marginTop: 24, borderLeft: '4px solid #EF4444' }}
      >
        <input type="hidden" name="id" value={item.id} />
        <p style={{ margin: '0 0 12px', color: '#6B7280' }}>이 자료를 영구 삭제합니다.</p>
        <button type="submit" className="admin_btn danger">이 자료 삭제</button>
      </form>
    </>
  );
}
