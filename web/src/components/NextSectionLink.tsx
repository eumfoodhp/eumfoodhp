'use client';

/**
 * 옵션 C: 섹션 끝에 "다음 → [다음 섹션명]" 버튼.
 * 스토리북 스타일 — 자연스럽게 다음 섹션으로 흐름 유도.
 * 마지막 섹션이면 "맨 위로" 버튼으로 대체.
 */

type Props = {
  nextId?: string;
  nextLabel?: string;
  /** 마지막 섹션 여부 — true 면 '맨 위로' 버튼 */
  isLast?: boolean;
};

export default function NextSectionLink({ nextId, nextLabel, isLast }: Props) {
  // 마지막 섹션엔 구분선/맨위로 버튼 노출 안 함 (사용자 요청).
  if (isLast) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isLast) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      return;
    }
    if (!nextId) return;
    const el = document.getElementById(nextId);
    if (el) {
      const headerOffset = 180;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${nextId}`);
      }
    }
  };

  return (
    <div className="next_section">
      <div className="next_section_divider" aria-hidden="true">
        <span></span>
      </div>
      <a
        href={isLast ? '#top' : `#${nextId ?? ''}`}
        onClick={handleClick}
        className="next_section_link"
      >
        {isLast ? (
          <>
            <span className="next_section_label">맨 위로</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="next_section_icon next_section_icon--up"
              aria-hidden="true"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </>
        ) : (
          <>
            <span className="next_section_eyebrow">NEXT</span>
            {/* 다음 섹션 제목은 아래 .story_section_title 과 중복이라 제거 */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="next_section_icon"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </>
        )}
      </a>
    </div>
  );
}
