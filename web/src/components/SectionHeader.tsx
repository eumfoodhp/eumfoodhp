'use client';

/**
 * 한 페이지 안 여러 섹션 사이 네비게이션 헤더.
 * 사용자 sketch 패턴:
 *   [이전 항목들 작게] [현재 항목 BIG] [다음 항목들 작게]
 *
 * 각 섹션 상단에 배치 → 스크롤하면서 페이지 어디쯤인지 시각화.
 * 항목 클릭 시 #anchor 로 스무스 스크롤.
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
  const currentIdx = sections.findIndex((s) => s.key === currentKey);
  const prev = sections.slice(0, currentIdx);
  const current = sections[currentIdx];
  const next = sections.slice(currentIdx + 1);

  const handleClick = (key: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(key);
    if (el) {
      const headerOffset = 100; // 고정 헤더 높이 보정
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (!current) return null;

  return (
    <div className="section_header">
      <div className="section_header_inner">
        {/* 이전 항목들 (왼쪽, 작게) */}
        <ul className="section_nav section_nav--prev">
          {prev.map((s) => (
            <li key={s.key}>
              <a href={`#${s.key}`} onClick={handleClick(s.key)}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        {/* 현재 항목 (가운데, 크게) */}
        <h2 className="section_header_title">{current.label}</h2>

        {/* 다음 항목들 (오른쪽, 작게) */}
        <ul className="section_nav section_nav--next">
          {next.map((s) => (
            <li key={s.key}>
              <a href={`#${s.key}`} onClick={handleClick(s.key)}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
