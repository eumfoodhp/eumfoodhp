import Link from 'next/link';
import { createDownload } from '../actions';

export default function NewDownloadPage() {
  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">자료 등록</h2>
        <Link href="/admin/downloads" className="admin_btn secondary">← 목록</Link>
      </div>

      <form action={createDownload} className="admin_form admin_card">
        <div className="admin_field">
          <label htmlFor="title">제목 *</label>
          <input id="title" type="text" name="title" required />
        </div>

        <div className="admin_field">
          <label htmlFor="description">설명</label>
          <textarea id="description" name="description" rows={3} />
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="category">분류</label>
            <input id="category" type="text" name="category" placeholder="회사소개서, 카탈로그, 로고 등" />
          </div>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="file_type">파일 형식</label>
            <input id="file_type" type="text" name="file_type" placeholder="pdf, zip, jpg" />
          </div>
          <div className="admin_field" style={{ flex: 1 }}>
            <label htmlFor="file_size">파일 크기 (bytes)</label>
            <input id="file_size" type="number" name="file_size" min="0" />
          </div>
        </div>

        <div className="admin_field">
          <label htmlFor="file_url">파일 URL *</label>
          <input id="file_url" type="text" name="file_url" required placeholder="/data/example.pdf 또는 https://..." />
        </div>

        <div className="admin_form_actions">
          <button type="submit" className="admin_btn">저장</button>
          <Link href="/admin/downloads" className="admin_btn secondary">취소</Link>
        </div>
      </form>
    </>
  );
}
