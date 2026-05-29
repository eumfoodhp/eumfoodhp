/**
 * 회사연혁 — 가운데 세로선 타임라인. 카드가 좌우 번갈아 (지그재그)
 * 위에서 아래로 흐름. 모바일에서는 좌측 정렬 단열로.
 */

type Props = {
  byYear: Record<string, string[]>;
  sortedYears: string[];
};

export default function HistoryTimeline({ byYear, sortedYears }: Props) {
  return (
    <section className="history_timeline">
      <div className="history_timeline_inner">
        <ol className="history_timeline_list">
          {sortedYears.map((year, idx) => {
            const side = idx % 2 === 0 ? 'is_right' : 'is_left';
            return (
              <li key={year} className={`history_tl_item ${side}`}>
                <span className="history_tl_dot" aria-hidden="true"></span>
                <span className="history_tl_connector" aria-hidden="true"></span>
                <article className="history_tl_card">
                  <h4 className="history_tl_year">{year}</h4>
                  <ul className="history_tl_events">
                    {byYear[year].map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
