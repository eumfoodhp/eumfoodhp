import Link from 'next/link';
import { createNotice } from '../actions';

export default function NewNoticePage() {
  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">공지사항 — 새 글</h2>
        <Link href="/admin/notices" className="admin_btn secondary">← 목록</Link>
      </div>

      <form action={createNotice} className="admin_form admin_card">
        <div className="admin_field">
          <label htmlFor="title">제목 *</label>
          <input id="title" type="text" name="title" required />
        </div>

        <div className="admin_field">
          <label htmlFor="title_zh">제목 (中文)</label>
          <input id="title_zh" type="text" name="title_zh" placeholder="중문 제목 — 비우면 중문 페이지에 한글 표시" />
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="category">분류</label>
            <input id="category" type="text" name="category" placeholder="(선택) 일반, 채용, 안내 등" />
          </div>
          <div className="admin_field" style={{ flex: 0, minWidth: 140, justifyContent: 'flex-end' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 24 }}>
              <input type="checkbox" name="is_pinned" /> 상단 고정
            </label>
          </div>
        </div>

        <div className="admin_field">
          <label htmlFor="content">내용 *</label>
          <textarea id="content" name="content" required />
        </div>

        <div className="admin_field">
          <label htmlFor="content_zh">내용 (中文)</label>
          <textarea id="content_zh" name="content_zh" placeholder="중문 내용 — 비우면 중문 페이지에 한글 표시" />
        </div>

        <div className="admin_form_actions">
          <button type="submit" className="admin_btn">저장</button>
          <Link href="/admin/notices" className="admin_btn secondary">취소</Link>
        </div>
      </form>
    </>
  );
}
