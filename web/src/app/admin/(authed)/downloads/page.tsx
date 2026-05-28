import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { deleteDownload } from './actions';

export const dynamic = 'force-dynamic';

function formatSize(bytes: number | null): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default async function DownloadsListPage() {
  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('downloads')
    .select('id, title, category, file_size, file_type, download_count, created_at')
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">다운로드 자료실</h2>
        <Link href="/admin/downloads/new" className="admin_btn">+ 자료 등록</Link>
      </div>

      {!list || list.length === 0 ? (
        <div className="admin_card">등록된 자료가 없습니다.</div>
      ) : (
        <table className="admin_table">
          <thead>
            <tr>
              <th>제목</th>
              <th style={{ width: 120 }}>분류</th>
              <th style={{ width: 90 }}>형식</th>
              <th style={{ width: 110 }}>크기</th>
              <th style={{ width: 90 }}>다운로드</th>
              <th style={{ width: 120 }}>등록일</th>
              <th style={{ width: 180 }}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => (
              <tr key={d.id}>
                <td>
                  <Link href={`/admin/downloads/${d.id}`} style={{ color: '#111827', fontWeight: 500, textDecoration: 'none' }}>
                    {d.title}
                  </Link>
                </td>
                <td>{d.category ?? '-'}</td>
                <td>{d.file_type ?? '-'}</td>
                <td>{formatSize(d.file_size)}</td>
                <td>{d.download_count}</td>
                <td>{new Date(d.created_at).toLocaleDateString('ko-KR')}</td>
                <td className="col_actions">
                  <Link href={`/admin/downloads/${d.id}`} className="admin_btn secondary">수정</Link>
                  <form action={deleteDownload}>
                    <input type="hidden" name="id" value={d.id} />
                    <button type="submit" className="admin_btn danger">삭제</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
