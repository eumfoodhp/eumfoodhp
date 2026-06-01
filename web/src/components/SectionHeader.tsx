import type { ReactNode } from 'react';

/**
 * 섹션 헤더 — ● ─── 한국어 / 영어 ─── ●
 * 좌우 가로선 + 끝 점 마커는 .story_section_title 의 ::before/::after 가 그림.
 * h2 안에 한국어 + 주황 영어 부제 묶음.
 *
 * action 이 있으면 헤더 우측에 부가 액션 (예: 다운로드 버튼) 배치.
 */
type Props = {
  /** 한국어 (또는 현재 locale 의) 섹션명 */
  title: string;
  /** 주황 영어 부제 (장식용 — locale 무관 동일 표기) */
  en: string;
  /** 우측 부가 액션 (선택) */
  action?: ReactNode;
};

export default function SectionHeader({ title, en, action }: Props) {
  return (
    <header className={`story_section_head${action ? ' story_section_head--with_action' : ''}`}>
      <h2 className="story_section_title">
        <span className="story_section_title_inner">
          <span className="story_section_title_text">{title}</span>
          <em className="story_section_title_en">{en}</em>
        </span>
      </h2>
      {action}
    </header>
  );
}
