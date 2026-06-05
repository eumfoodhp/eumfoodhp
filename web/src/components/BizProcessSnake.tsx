'use client';

/**
 * 제조공정 — 반응형 스네이크(보스트로페돈) 흐름.
 * 화면폭으로 열수(4/3/2/1)를 계산해 스텝을 줄 단위로 묶고,
 * 짝수 줄(0-base 홀수 index)은 역순 + 우측정렬로 렌더 → 연속 번호가 줄을 넘어도 인접.
 * 화살표(클립패스)는 CSS 가 그림:
 *   - 줄 안: 다음 노드로 (홀수 줄 →, 짝수 줄 ←)
 *   - 줄 끝(다음 줄 있음): 아래로 ↓
 *   - 전체 마지막 노드: 없음
 */
import { useState, useEffect } from 'react';

export type SnakeStep = { n: number; iconSrc: string; label: string; en: string };

function colsForWidth(w: number) {
  if (w >= 1241) return 4;
  if (w >= 736) return 3;
  if (w >= 481) return 2;
  return 1;
}

export default function BizProcessSnake({ steps }: { steps: SnakeStep[] }) {
  // 서버/최초 렌더는 4열로 고정(하이드레이션 일치), mount 후 실제 폭 반영
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const update = () => setCols(colsForWidth(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 줄 단위로 묶기
  const rows: SnakeStep[][] = [];
  for (let i = 0; i < steps.length; i += cols) rows.push(steps.slice(i, i + cols));

  return (
    <div className="biz_pf_snake">
      {rows.map((row, r) => {
        const reverse = r % 2 === 1;
        const hasNext = r < rows.length - 1;
        const flowLastN = row[row.length - 1].n; // 줄의 흐름상 마지막(번호 큰 것)
        // 짝수 줄: 우측정렬 위해 빈 셀 prepend + 역순
        const cells: (SnakeStep | null)[] = reverse
          ? [...Array(Math.max(0, cols - row.length)).fill(null), ...[...row].reverse()]
          : row;
        return (
          <div
            key={r}
            className={`biz_pf_snake_row${reverse ? ' is-rev' : ''}`}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {cells.map((s, idx) => {
              if (!s) return <div key={`e${idx}`} className="biz_pf_step is-empty" aria-hidden="true" />;
              const isFlowLast = s.n === flowLastN;
              const cls =
                'biz_pf_step' + (isFlowLast ? (hasNext ? ' has-down' : '') : ' has-arrow');
              return (
                <div key={s.n} className={cls}>
                  <div className="biz_pf_node">
                    <span className="biz_pf_step_num">{s.n}</span>
                    <div className="biz_pf_step_circle">
                      <div className="biz_pf_step_icon">
                        <img src={s.iconSrc} alt={s.label} loading="lazy" />
                      </div>
                    </div>
                  </div>
                  <p className="biz_pf_step_label">{s.label}</p>
                  <p className="biz_pf_step_label_en">{s.en}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
