'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';

type HeroItem = {
  id: number | string;
  title: string;
  thumbnail: string | null;
  created_at: string;
};

const AUTO_MS = 5000;

export default function PressHeroSlider({ items }: { items: HeroItem[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = items.length;

  useEffect(() => {
    if (total <= 1 || paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), AUTO_MS);
    return () => clearInterval(t);
  }, [total, paused]);

  if (total === 0) return null;
  const cur = items[idx];
  const dateStr = new Date(cur.created_at)
    .toLocaleDateString('ko-KR')
    .replace(/\. /g, '.')
    .replace(/\.$/, '');

  function go(delta: number) {
    setIdx((i) => (i + delta + total) % total);
  }

  return (
    <section
      className="board_hero"
      aria-label="대표 보도자료"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link href={`/press/${cur.id}` as never} className="board_hero_thumb">
        {cur.thumbnail ? (
          <img src={cur.thumbnail} alt="" loading="eager" />
        ) : (
          <div className="board_hero_thumb_placeholder">
            <ImagePlaceholderIcon />
          </div>
        )}
      </Link>
      <div className="board_hero_body">
        <span className="board_hero_tag">NEWS</span>
        <h2 className="board_hero_title">
          <Link href={`/press/${cur.id}` as never} style={{ color: 'inherit', textDecoration: 'none' }}>
            {cur.title}
          </Link>
        </h2>
        <span className="board_hero_date">{dateStr}</span>
      </div>
      <div className="board_hero_pager">
        <span className="board_hero_indicator">
          <b>{idx + 1}</b> / {total}
        </span>
        <button
          type="button"
          className="board_hero_nav board_hero_nav--prev"
          aria-label="이전"
          onClick={() => go(-1)}
          disabled={total <= 1}
        >‹</button>
        <button
          type="button"
          className="board_hero_nav board_hero_nav--next"
          aria-label="다음"
          onClick={() => go(1)}
          disabled={total <= 1}
        >›</button>
      </div>
    </section>
  );
}

function ImagePlaceholderIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
