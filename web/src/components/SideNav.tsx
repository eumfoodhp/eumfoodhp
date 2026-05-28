'use client';

import { useEffect, useState } from 'react';

/**
 * 원페이지(/about, /business) 좌측 sticky 사이드 네비.
 * IntersectionObserver 로 현재 뷰포트 안의 섹션 자동 감지 → 활성 표시.
 * 클릭 시 부드럽게 anchor 스크롤.
 */

type Section = {
  id: string;
  label: string;
};

type Props = {
  sections: Section[];
  category?: string;  // optional: 카테고리명 (소개 / 제조) 위쪽 라벨로
};

export default function SideNav({ sections, category }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    // 초기: URL hash 가 있으면 그걸 우선
    if (window.location.hash) {
      const h = window.location.hash.replace('#', '');
      if (sections.some((s) => s.id === h)) setActiveId(h);
    }

    // IntersectionObserver — 뷰포트 중앙에 가장 가까운 섹션 감지
    const observer = new IntersectionObserver(
      (entries) => {
        // 화면에 가장 많이 들어와있는 섹션 선택
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-30% 0px -50% 0px',  // 상단 30% / 하단 50% 무시 → 가운데 영역만
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 180;  // 헤더 + sticky 여유
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      // URL hash 갱신 (history push 안 하면 새로고침 시 사라짐 — 부드러운 push)
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  return (
    <aside className="sidenav" aria-label="section navigation">
      {category && <div className="sidenav_category">{category}</div>}
      <ul className="sidenav_list">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={handleClick(s.id)}
              className={`sidenav_link${activeId === s.id ? ' is_active' : ''}`}
            >
              <span className="sidenav_marker" aria-hidden="true"></span>
              <span className="sidenav_label">{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
