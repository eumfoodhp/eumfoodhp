'use client';

/**
 * 한 페이지 안 여러 섹션 사이 네비게이션 헤더.
 *
 * 레이아웃 (사용자 sketch 기준):
 *   [🏠 · {parentLabel}] [현재 BIG | 다른 1 | 다른 2 | 다른 3 | 다른 4]
 *                       └────────── pill (헤더와 동일 폭의 우측 정렬) ──────────┘
 *
 * 한 줄에 breadcrumb (왼쪽) + 섹션 네비 pill (오른쪽).
 * 항목 클릭 시 #anchor 스무스 스크롤.
 */

type Section = {
  key: string;
  label: string;
};

type Props = {
  sections: Section[];
  currentKey: string;
  parentLabel: string;  // 예: '소개' / '제조'
};

export default function SectionHeader({ sections, currentKey, parentLabel }: Props) {
  const current = sections.find((s) => s.key === currentKey);
  const others = sections.filter((s) => s.key !== currentKey);
  if (!current) return null;

  const handleClick = (key: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(key);
    if (el) {
      const headerOffset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="section_header">
      <div className="section_header_inner">
        {/* 왼쪽: 브레드크럼 */}
        <nav className="section_breadcrumb" aria-label="breadcrumb">
          <img src="/images/sub/home.png" alt="home" className="home_icon" />
          <i className="dot"></i>
          <span className="depth1">{parentLabel}</span>
        </nav>

        {/* 오른쪽: 5등분 균등 pill */}
        <div className="section_header_pill">
          <div className="section_header_title">{current.label}</div>
          {others.map((s) => (
            <a
              key={s.key}
              href={`#${s.key}`}
              onClick={handleClick(s.key)}
              className="section_header_link"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
