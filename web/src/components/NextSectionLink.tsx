'use client';

import { useTranslations } from 'next-intl';

/**
 * 옵션 C: 섹션 끝에 "PREV ↑" + "NEXT ↓" 버튼.
 * 스토리북 스타일 — 자연스럽게 이전·다음 섹션으로 흐름 유도.
 * isLast=true 면 (마지막 섹션) 통째 렌더 안 함.
 */

type Props = {
  nextId?: string;
  nextLabel?: string;
  /** 이전 섹션 id — 있으면 PREV 버튼 노출 */
  prevId?: string;
  /** 마지막 섹션 여부 — true 면 컴포넌트 자체 렌더 X */
  isLast?: boolean;
};

const HEADER_OFFSET = 180;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
  if (window.history.replaceState) {
    window.history.replaceState(null, '', `#${id}`);
  }
}

export default function NextSectionLink({ nextId, nextLabel, prevId, isLast }: Props) {
  const t = useTranslations();
  // 마지막 섹션엔 PREV/NEXT 모두 통째 비노출 (사용자 요청).
  if (isLast) return null;

  const handlePrev = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (prevId) scrollToSection(prevId);
  };

  const handleNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (nextId) scrollToSection(nextId);
  };

  return (
    <div className="next_section">
      {prevId && (
        <a
          href={`#${prevId}`}
          onClick={handlePrev}
          className="next_section_link next_section_link--prev"
          aria-label={t('aria_prev_section')}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="next_section_icon next_section_icon--up"
            aria-hidden="true"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          <span className="next_section_eyebrow">PREV</span>
        </a>
      )}

      <div className="next_section_divider" aria-hidden="true">
        <span></span>
      </div>

      {nextId && (
        <a
          href={`#${nextId}`}
          onClick={handleNext}
          className="next_section_link"
          aria-label={`${t('aria_next_section')}${nextLabel ? ` — ${nextLabel}` : ''}`}
        >
          <span className="next_section_eyebrow">NEXT</span>
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
        </a>
      )}
    </div>
  );
}
