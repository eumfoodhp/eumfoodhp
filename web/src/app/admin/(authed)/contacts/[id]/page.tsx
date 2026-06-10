import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import { answerContact, reopenContact, deleteContact } from '../actions';
import AdminDeleteButton from '../../AdminDeleteButton';

export const dynamic = 'force-dynamic';

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: c } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (!c) notFound();

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">1:1 문의 상세</h2>
        <Link href="/admin/contacts" className="admin_btn secondary">←</Link>
      </div>

      {/* 문의 본문 */}
      <div className="admin_card">
        <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{c.subject}</h3>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>
          {c.writer_name} ({c.email ?? '이메일 없음'}) · {c.phone ?? '연락처 없음'} ·{' '}
          {new Date(c.created_at).toLocaleString('ko-KR')}
          {c.is_private && <span style={{ marginLeft: 8 }}>🔒 비공개</span>}
        </p>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#222' }}>{c.content}</div>
      </div>

      {/* 답변 영역 */}
      <form action={answerContact} className="admin_form admin_card" style={{ marginTop: 24 }}>
        <input type="hidden" name="id" value={c.id} />
        <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>
          관리자 답변{' '}
          {c.status === 'answered' && c.answered_at && (
            <span style={{ fontSize: 12, color: '#10B981', fontWeight: 500 }}>
              (답변일: {new Date(c.answered_at).toLocaleString('ko-KR')})
            </span>
          )}
        </h3>
        <div className="admin_field">
          <textarea
            name="answer"
            required
            defaultValue={c.answer ?? ''}
            rows={8}
            placeholder="답변 내용을 입력해주세요."
          />
        </div>
        <div className="admin_form_actions">
          <button type="submit" className="admin_btn">
            {c.status === 'answered' ? '답변 수정' : '답변 등록'}
          </button>
          {c.status === 'answered' && (
            <button type="submit" formAction={reopenContact} formNoValidate className="admin_btn secondary">
              대기 상태로 변경
            </button>
          )}
          <AdminDeleteButton action={deleteContact} message="이 문의를 삭제할까요? 되돌릴 수 없습니다." />
        </div>
      </form>
    </>
  );
}
