'use client';

/**
 * 연혁 원페이지 인라인 관리.
 * - 기본은 읽기(텍스트) 표시, 수정(✎) 아이콘을 누르면 그 줄이 입력칸으로 전환 (사용자 요청)
 * - 편집 중 칸 밖 클릭(blur) 시 자동 저장 (신규 생성/기존 수정), ✓ 로 편집 완료
 * - '+ 항목'(빈 줄, 바로 편집), '+ 연도 추가'(팝업으로 연도 입력), ✕ 즉시 삭제
 * - 월/중국어는 제외 (기존 데이터는 보존)
 */
import { useRef, useState } from 'react';
import { saveHistoryEntry, deleteHistoryEntry } from './actions';

type Init = { id: number; year: number; month: number | null; title: string; description: string | null };

type Row = {
  key: string;
  id: number | null;
  year: number;
  month: string;
  title: string;
  description: string;
  status: 'idle' | 'saving' | 'saved' | 'error';
  dirty: boolean;
  editing: boolean;
};

let keySeq = 0;
const newKey = () => `r${(keySeq += 1)}`;

function toRow(e: Init): Row {
  return {
    key: newKey(),
    id: e.id,
    year: e.year,
    month: e.month != null ? String(e.month) : '',
    title: e.title,
    description: e.description ?? '',
    status: 'idle',
    dirty: false,
    editing: false,
  };
}

export default function HistoryManager({ initial }: { initial: Init[] }) {
  const [rows, setRows] = useState<Row[]>(() => initial.map(toRow));
  const rowsRef = useRef<Row[]>(rows);
  rowsRef.current = rows;

  const update = (key: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const saveRow = async (key: string) => {
    const row = rowsRef.current.find((r) => r.key === key);
    if (!row || !row.title.trim() || !row.dirty || row.status === 'saving') return;
    update(key, { status: 'saving' });
    try {
      const res = await saveHistoryEntry({
        id: row.id,
        year: row.year,
        month: row.month === '' ? null : Number(row.month),
        title: row.title,
        description: row.description,
      });
      update(key, { id: res.id, status: 'saved', dirty: false });
    } catch {
      update(key, { status: 'error' });
    }
  };

  // ✓ 완료 — 저장 후 읽기 모드로. 제목 빈 새 줄은 그냥 제거.
  const finishEdit = (key: string) => {
    const row = rowsRef.current.find((r) => r.key === key);
    if (!row) return;
    if (!row.title.trim()) {
      if (!row.id) setRows((rs) => rs.filter((r) => r.key !== key));
      return; // 기존 줄인데 제목 비면 편집 유지 (제목 필수)
    }
    void saveRow(key);
    update(key, { editing: false });
  };

  const removeRow = async (key: string) => {
    const row = rowsRef.current.find((r) => r.key === key);
    if (!row) return;
    if (row.id) {
      if (!confirm('이 항목을 삭제할까요?')) return;
      try {
        await deleteHistoryEntry(row.id);
      } catch {
        update(key, { status: 'error' });
        return;
      }
    }
    setRows((rs) => rs.filter((r) => r.key !== key));
  };

  const addItem = (year: number) =>
    setRows((rs) => [
      ...rs,
      { key: newKey(), id: null, year, month: '', title: '', description: '', status: 'idle', dirty: false, editing: true },
    ]);

  // 연도 추가 — 버튼 클릭 시 팝업으로 연도 입력받기 (사용자 요청)
  const addYearPrompt = () => {
    const input = window.prompt('추가할 연도를 입력하세요 (예: 2027)');
    if (input == null) return;
    const y = Number(input.trim());
    if (!y || y < 1900 || y > 2099) {
      alert('1900~2099 사이의 연도를 입력해 주세요.');
      return;
    }
    addItem(y);
  };

  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a);

  return (
    <div className="hist_mgr">
      <div className="hist_mgr_addyear">
        <button type="button" className="admin_btn" onClick={addYearPrompt}>
          + 연도 추가
        </button>
      </div>

      {years.length === 0 ? (
        <div className="admin_card">아직 연혁이 없습니다. 위에서 연도를 추가해 시작하세요.</div>
      ) : (
        years.map((year) => {
          const groupRows = rows.filter((r) => r.year === year);
          return (
            <div key={year} className="hist_year_group admin_card">
              <div className="hist_year_head">
                <h3 className="hist_year">
                  {year}
                  <span className="hist_year_count">{groupRows.length}건</span>
                </h3>
                <button
                  type="button"
                  className="admin_btn secondary"
                  onClick={() => addItem(year)}
                  title="항목 추가"
                  aria-label="항목 추가"
                  style={{ padding: '8px 12px' }}
                >
                  +
                </button>
              </div>

              <div className="hist_mgr_rows">
                {groupRows.map((row) =>
                  row.editing ? (
                    <div key={row.key} className="hist_mgr_row">
                      <input
                        type="text"
                        placeholder="제목 (예: 신공장 준공)"
                        aria-label="제목"
                        value={row.title}
                        autoFocus
                        onChange={(e) => update(row.key, { title: e.target.value, dirty: true, status: 'idle' })}
                        onBlur={() => saveRow(row.key)}
                        style={{ flex: 1, minWidth: 0 }}
                      />
                      <span className="hist_mgr_status">
                        {row.status === 'saving' ? '…' : row.status === 'saved' ? '✓' : row.status === 'error' ? '⚠' : ''}
                      </span>
                      <button
                        type="button"
                        className="admin_btn"
                        onClick={() => finishEdit(row.key)}
                        title="완료"
                        aria-label="편집 완료"
                        style={{ flexShrink: 0, padding: '8px 12px' }}
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="admin_btn danger"
                        onClick={() => removeRow(row.key)}
                        title="삭제"
                        aria-label="이 항목 삭제"
                        style={{ flexShrink: 0, padding: '8px 12px' }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div key={row.key} className="hist_mgr_row hist_mgr_row--view">
                      <span className="hist_mgr_text">{row.title}</span>
                      <button
                        type="button"
                        className="admin_btn secondary"
                        onClick={() => update(row.key, { editing: true })}
                        title="수정"
                        aria-label="수정"
                        style={{ flexShrink: 0, padding: '8px 11px' }}
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="admin_btn danger"
                        onClick={() => removeRow(row.key)}
                        title="삭제"
                        aria-label="이 항목 삭제"
                        style={{ flexShrink: 0, padding: '8px 12px' }}
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })
      )}

      <p className="hist_mgr_hint">수정(✎)을 눌러 편집하고, 칸 밖을 클릭하면 자동 저장돼요. ✓로 편집 완료.</p>
    </div>
  );
}
