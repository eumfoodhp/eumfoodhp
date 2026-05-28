import Link from 'next/link';
import { createHistory } from '../actions';

export default function NewHistoryPage() {
  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">연혁 — 새 항목</h2>
        <Link href="/admin/history" className="admin_btn secondary">← 목록</Link>
      </div>

      <form action={createHistory} className="admin_form admin_card">
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="year">연도 *</label>
            <input id="year" type="number" name="year" required min="1900" max="2099" defaultValue={new Date().getFullYear()} />
          </div>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="month">월 (비우면 연도만)</label>
            <input id="month" type="number" name="month" min="1" max="12" placeholder="1-12" />
          </div>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="sort_order">정렬 순서</label>
            <input id="sort_order" type="number" name="sort_order" defaultValue="0" />
          </div>
        </div>

        <div className="admin_field">
          <label htmlFor="title">제목 *</label>
          <input id="title" type="text" name="title" required placeholder="예: 신공장 준공, ISO 9001 인증" />
        </div>

        <div className="admin_field">
          <label htmlFor="description">설명</label>
          <textarea id="description" name="description" rows={3} />
        </div>

        <div className="admin_form_actions">
          <button type="submit" className="admin_btn">저장</button>
          <Link href="/admin/history" className="admin_btn secondary">취소</Link>
        </div>
      </form>
    </>
  );
}
