'use client';

import { useEffect, useState } from 'react';

/**
 * 옵션 B: 진행 막대 + 현재 섹션 표시 + 단축 점프 토글.
 * 페이지 상단(헤더 아래)에 sticky.
 *  - 얇은 주황 progress bar (스크롤 진행도, 0~100%)
 *  - 아래 행: "현재: {섹션명}  ▼"  → 클릭 시 전체 섹션 드롭다운
 *  - 항목 클릭 → smooth 스크롤 + URL hash 갱신
 */

type Section = {
  id: string;
  label: string;
};

type Props = {
  sections: Section[];
  category?: string;
};

export default function ProgressNav({ sections, category }: Props) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const [open, setOpen] = useState(false);

  // 스크롤 진행도 (페이지 전체 기준)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const top = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const pct = height > 0 ? Math.max(0, Math.min(100, (top / height) * 100)) : 0;
        setProgress(pct);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 현재 섹션 감지 (IntersectionObserver)
  useEffect(() => {
    if (window.location.hash) {
      const h = window.location.hash.replace('#', '');
      if (sections.some((s) => s.id === h)) setActiveId(h);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('.progress_nav');
      if (!el) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  const jumpTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 180;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
    setOpen(false);
  };

  const currentLabel = sections.find((s) => s.id === activeId)?.label ?? sections[0]?.label ?? '';

  return (
    <div className="progress_nav" role="navigation" aria-label="page progress navigation">
      {/* Progress bar */}
      <div className="progress_bar_track" aria-hidden="true">
        <div
          className="progress_bar_fill"
          style={{ width: `${progress.toFixed(2)}%` }}
        />
      </div>

      {/* Label row */}
      <div className="progress_label_row">
        {category && <span className="progress_category">{category}</span>}
        <button
          type="button"
          className="progress_label_btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="progress_label_text">{currentLabel}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`chev${open ? ' open' : ''}`}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <span className="progress_percent" aria-hidden="true">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="progress_menu" role="listbox">
          {sections.map((s, idx) => (
            <li key={s.id} role="option" aria-selected={s.id === activeId}>
              <a
                href={`#${s.id}`}
                onClick={jumpTo(s.id)}
                className={`progress_menu_link${s.id === activeId ? ' is_active' : ''}`}
              >
                <span className="progress_menu_index">{String(idx + 1).padStart(2, '0')}</span>
                <span className="progress_menu_label">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
