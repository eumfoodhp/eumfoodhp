'use client';

/**
 * 연혁 일괄 추가 폼 — 연도 1개 선택 + 제목 줄을 여러 개 추가해 한 번에 저장.
 * 각 줄: 월(선택) / 제목(필수) / 설명(선택). 위에서부터의 순서가 정렬순서가 됨.
 * 제출 시 createHistoryBatch 가 같은 연도로 여러 항목을 생성.
 */
import { useState } from 'react';
import Link from 'next/link';
import { createHistoryBatch } from './actions';

export default function HistoryBatchForm({ initialYear }: { initialYear?: number }) {
  const [rows, setRows] = useState<number[]>([0]);
  const [next, setNext] = useState(1);

  const addRow = () => {
    setRows((r) => [...r, next]);
    setNext((n) => n + 1);
  };
  const removeRow = (id: number) => {
    setRows((r) => (r.length > 1 ? r.filter((x) => x !== id) : r));
  };

  return (
    <form action={createHistoryBatch} className="admin_form admin_card">
      <div className="admin_field" style={{ maxWidth: 220 }}>
        <label htmlFor="year">연도 *</label>
        <input
          id="year"
          type="number"
          name="year"
          required
          min="1900"
          max="2099"
          defaultValue={initialYear ?? new Date().getFullYear()}
        />
      </div>

      <div className="admin_field">
        <label>항목 — 제목을 한 줄씩 추가 (위에서부터 순서대로 저장됨)</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((id) => (
            <div key={id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                name="month"
                min="1"
                max="12"
                placeholder="월"
                aria-label="월(선택)"
                style={{ width: 72, flexShrink: 0 }}
              />
              <input
                type="text"
                name="title"
                placeholder="제목 (예: 신공장 준공)"
                aria-label="제목"
                style={{ flex: 2, minWidth: 0 }}
              />
              <input
                type="text"
                name="description"
                placeholder="설명 (선택)"
                aria-label="설명(선택)"
                style={{ flex: 2, minWidth: 0 }}
              />
              <button
                type="button"
                className="admin_btn secondary"
                onClick={() => removeRow(id)}
                aria-label="이 줄 삭제"
                title="이 줄 삭제"
                style={{ flexShrink: 0, padding: '8px 12px' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="admin_btn secondary" onClick={addRow} style={{ marginTop: 10 }}>
          + 줄 추가
        </button>
      </div>

      <div className="admin_form_actions">
        <button type="submit" className="admin_btn">저장</button>
        <Link href="/admin/history" className="admin_btn secondary">취소</Link>
      </div>
    </form>
  );
}
