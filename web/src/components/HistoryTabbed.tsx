'use client';

import { useState } from 'react';

type Period = { id: string; label: string; start: number; end: number };

type Props = {
  periods: Period[];
  byYear: Record<string, string[]>;
  sortedYears: string[];
};

/**
 * 회사연혁 — 좌측 세로 시기 탭 + 우측 연도 카드 그리드.
 * 가로 스크롤 없이 한 화면에 끝나도록 구성.
 */
export default function HistoryTabbed({ periods, byYear, sortedYears }: Props) {
  const [activeId, setActiveId] = useState(periods[0]?.id ?? '');

  const activePeriod = periods.find((p) => p.id === activeId) ?? periods[0];
  const yearsInPeriod = sortedYears.filter((y) => {
    const n = Number(y);
    return n >= activePeriod.start && n <= activePeriod.end;
  });

  return (
    <section className="history_tabbed">
      <div className="history_tabbed_inner">
        {/* 좌측 세로 탭 */}
        <nav className="history_tabbed_tabs" role="tablist" aria-orientation="vertical">
          {periods.map((p) => {
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`history_tab_btn${isActive ? ' is_active' : ''}`}
                onClick={() => setActiveId(p.id)}
              >
                <span className="history_tab_label">{p.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 우측 연도 카드 그리드 */}
        <div className="history_tabbed_panel" role="tabpanel">
          {yearsInPeriod.length === 0 ? (
            <p className="history_tabbed_empty">기록 없음</p>
          ) : (
            <div className="history_year_grid">
              {yearsInPeriod.map((year) => (
                <article key={year} className="history_year_card">
                  <h4 className="history_year_label">{year}</h4>
                  <ul className="history_year_list">
                    {byYear[year].map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
