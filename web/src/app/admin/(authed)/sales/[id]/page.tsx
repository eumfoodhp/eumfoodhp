import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import { updateSalesStatus, deleteSales } from '../actions';
import AdminDeleteButton from '../../AdminDeleteButton';

export const dynamic = 'force-dynamic';

type Attachment = { name: string; url: string; size?: number };

export default async function SalesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: s } = await supabase
    .from('sales_inquiries')
    .select('*')
    .eq('id', id)
    .single();

  if (!s) notFound();

  const attachments: Attachment[] = Array.isArray(s.attachments) ? s.attachments : [];

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">영업 문의 상세</h2>
        <Link href="/admin/sales" className="admin_btn secondary">←</Link>
      </div>

      <div className="admin_card">
        <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>{s.company}</h3>
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 8, fontSize: 14 }}>
          <dt style={{ color: '#6B7280' }}>담당자</dt>
          <dd style={{ margin: 0 }}>{s.writer_name}{s.position ? ` (${s.position})` : ''}</dd>
          <dt style={{ color: '#6B7280' }}>이메일</dt>
          <dd style={{ margin: 0 }}>{s.email}</dd>
          <dt style={{ color: '#6B7280' }}>연락처</dt>
          <dd style={{ margin: 0 }}>{s.phone ?? '-'}</dd>
          <dt style={{ color: '#6B7280' }}>국가</dt>
          <dd style={{ margin: 0 }}>{s.country ?? '-'}</dd>
          <dt style={{ color: '#6B7280' }}>분류</dt>
          <dd style={{ margin: 0 }}>{s.category ?? '-'}</dd>
          <dt style={{ color: '#6B7280' }}>접수일</dt>
          <dd style={{ margin: 0 }}>{new Date(s.created_at).toLocaleString('ko-KR')}</dd>
        </dl>

        <div style={{ borderTop: '1px solid #E5E7EB', margin: '16px 0' }} />

        <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#6B7280' }}>문의 내용</h4>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#222' }}>{s.content}</div>

        {attachments.length > 0 && (
          <>
            <div style={{ borderTop: '1px solid #E5E7EB', margin: '16px 0' }} />
            <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#6B7280' }}>첨부파일</h4>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {attachments.map((a, i) => (
                <li key={i}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>
                    {a.name}
                  </a>
                  {a.size && <span style={{ color: '#9CA3AF', marginLeft: 6 }}>({Math.round(a.size / 1024)} KB)</span>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* 상태 변경 */}
      <form action={updateSalesStatus} className="admin_form admin_card" style={{ marginTop: 24 }}>
        <input type="hidden" name="id" value={s.id} />
        <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>처리 상태</h3>
        <div className="admin_field">
          <select name="status" defaultValue={s.status}>
            <option value="pending">대기</option>
            <option value="contacted">연락중</option>
            <option value="closed">완료</option>
          </select>
        </div>
        <div className="admin_form_actions">
          <button type="submit" className="admin_btn">상태 저장</button>
          <AdminDeleteButton action={deleteSales} message="이 영업 문의를 삭제할까요? 되돌릴 수 없습니다." />
        </div>
      </form>
    </>
  );
}
