import Link from 'next/link';
import { createPress } from '../actions';

export default function NewPressPage() {
  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">보도자료 — 새 글</h2>
        <Link href="/admin/press" className="admin_btn secondary">← 목록</Link>
      </div>

      <form action={createPress} className="admin_form admin_card">
        <div className="admin_field">
          <label htmlFor="title">제목 *</label>
          <input id="title" type="text" name="title" required />
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="source">매체</label>
            <input id="source" type="text" name="source" placeholder="(선택) 매일경제, 식품저널 등" />
          </div>
          <div className="admin_field" style={{ flex: 2 }}>
            <label htmlFor="link_url">원본 기사 URL</label>
            <input id="link_url" type="url" name="link_url" placeholder="https://..." />
          </div>
        </div>

        <div className="admin_field">
          <label htmlFor="thumbnail">썸네일 이미지 URL</label>
          <input id="thumbnail" type="url" name="thumbnail" placeholder="https://..." />
        </div>

        <div className="admin_field">
          <label htmlFor="content">내용 *</label>
          <textarea id="content" name="content" required />
        </div>

        <div className="admin_form_actions">
          <button type="submit" className="admin_btn">저장</button>
          <Link href="/admin/press" className="admin_btn secondary">취소</Link>
        </div>
      </form>
    </>
  );
}
