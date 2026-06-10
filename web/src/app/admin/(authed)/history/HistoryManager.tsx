'use client';

/**
 * 연혁 원페이지 인라인 관리 (사용자 요청: 추가/수정/삭제를 한 페이지에서, 줄마다 바로 저장).
 * - 각 줄: 월(선택) / 제목(필수) / 설명(선택)
 * - 줄에서 포커스가 빠지면(blur) 제목이 있을 때 자동 저장 (신규는 생성, 기존은 수정)
 * - '+ 항목' = 그 연도에 빈 줄 추가, '+ 연도' = 새 연도 그룹
 * - ✕ = 즉시 삭제 (저장 전 빈 줄은 그냥 제거)
 * - 중국어는 제외 (공개 중문 페이지는 한글 fallback, 기존 중문 데이터는 보존)
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
  };
}

export default function HistoryManager({ initial }: { initial: Init[] }) {
  const [rows, setRows] = useState<Row[]>(() => initial.map(toRow));
  const [newYear, setNewYear] = useState('');
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
      { key: newKey(), id: null, year, month: '', title: '', description: '', status: 'idle', dirty: false },
    ]);

  const addYear = () => {
    const y = Number(newYear);
    if (!y || y < 1900 || y > 2099) return;
    setNewYear('');
    addItem(y);
  };

  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a);

  return (
    <div className="hist_mgr">
      <div className="hist_mgr_addyear">
        <input
          type="number"
          min="1900"
          max="2099"
          placeholder="연도 (예: 2027)"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addYear();
            }
          }}
          style={{ width: 170 }}
        />
        <button type="button" className="admin_btn" onClick={addYear}>
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
                <button type="button" className="admin_btn secondary" onClick={() => addItem(year)}>
                  + 항목
                </button>
              </div>

              <div className="hist_mgr_rows">
                {groupRows.map((row) => (
                  <div key={row.key} className="hist_mgr_row">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      placeholder="월"
                      aria-label="월(선택)"
                      value={row.month}
                      onChange={(e) => update(row.key, { month: e.target.value, dirty: true, status: 'idle' })}
                      onBlur={() => saveRow(row.key)}
                      style={{ width: 64, flexShrink: 0 }}
                    />
                    <input
                      type="text"
                      placeholder="제목 (예: 신공장 준공)"
                      aria-label="제목"
                      value={row.title}
                      onChange={(e) => update(row.key, { title: e.target.value, dirty: true, status: 'idle' })}
                      onBlur={() => saveRow(row.key)}
                      style={{ flex: 2, minWidth: 0 }}
                    />
                    <input
                      type="text"
                      placeholder="설명 (선택)"
                      aria-label="설명(선택)"
                      value={row.description}
                      onChange={(e) => update(row.key, { description: e.target.value, dirty: true, status: 'idle' })}
                      onBlur={() => saveRow(row.key)}
                      style={{ flex: 1, minWidth: 0 }}
                    />
                    <span
                      className="hist_mgr_status"
                      title={
                        row.status === 'saving'
                          ? '저장 중'
                          : row.status === 'saved'
                            ? '저장됨'
                            : row.status === 'error'
                              ? '저장 실패'
                              : ''
                      }
                    >
                      {row.status === 'saving' ? '…' : row.status === 'saved' ? '✓' : row.status === 'error' ? '⚠' : ''}
                    </span>
                    <button
                      type="button"
                      className="admin_btn danger"
                      onClick={() => removeRow(row.key)}
                      aria-label="이 항목 삭제"
                      title="삭제"
                      style={{ flexShrink: 0, padding: '8px 12px' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      <p className="hist_mgr_hint">제목을 입력하고 칸 밖을 클릭하면 자동 저장됩니다. (✓ 저장됨)</p>
    </div>
  );
}
