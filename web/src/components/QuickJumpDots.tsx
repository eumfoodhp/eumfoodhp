'use client';

import { useEffect, useState } from 'react';

/**
 * 우측 floating sticky 바로가기 인디케이터.
 * 작은 dot N개 (섹션 수만큼). hover 시 라벨 툴팁, 클릭 시 jump.
 * IntersectionObserver 로 현재 섹션 자동 감지 → 활성 dot 표시.
 */

type Section = { id: string; label: string };

type Props = {
  sections: Section[];
};

export default function QuickJumpDots({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

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
  };

  return (
    <nav className="quick_jump_dots" aria-label="quick jump">
      {sections.map((s, idx) => {
        const isActive = activeId === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={jumpTo(s.id)}
            className={`qjd_link${isActive ? ' is_active' : ''}`}
            aria-label={s.label}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className="qjd_tooltip">
              <span className="qjd_tooltip_num">{String(idx + 1).padStart(2, '0')}</span>
              <span className="qjd_tooltip_label">{s.label}</span>
            </span>
            <span className="qjd_dot" aria-hidden="true"></span>
          </a>
        );
      })}
    </nav>
  );
}
