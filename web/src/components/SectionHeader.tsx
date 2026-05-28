'use client';

/**
 * 한 페이지 안 여러 섹션 사이 네비게이션 헤더 (헤더 pill 스타일).
 *
 * 레이아웃 (사용자 sketch 기준):
 *   [현재 BIG | 다른 1 | 다른 2 | 다른 3 | 다른 4]
 *   - N등분 균등 그리드 (sections.length 만큼).
 *   - 첫 칸: 현재 섹션 (크고 진한 톤).
 *   - 나머지 칸: 그 외 섹션들, 원래 순서대로 배치.
 *   - 헤더와 동일한 흰 pill + 그림자 + 라운드 코너.
 *   - 항목 클릭 시 #anchor 스무스 스크롤.
 */

type Section = {
  key: string;
  label: string;
};

type Props = {
  sections: Section[];
  currentKey: string;
};

export default function SectionHeader({ sections, currentKey }: Props) {
  const current = sections.find((s) => s.key === currentKey);
  const others = sections.filter((s) => s.key !== currentKey);
  if (!current) return null;

  const handleClick = (key: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(key);
    if (el) {
      const headerOffset = 120; // 고정 헤더 + 여백
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="section_header">
      <div className="section_header_inner">
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
  );
}
