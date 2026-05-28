'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * 제품 페이지의 "상품 소개서" 다운로드 트리거 — 클릭 시 확인 팝업.
 * 파일 경로: /data/이음푸드시스템_26년_제품소개서.pdf
 * (다운로드 시 사용자에게도 동일 한글 파일명으로 저장됨)
 */
export default function BrochureLink({ className, children }: Props) {
  const t = useTranslations();
  const pdfHref = '/data/' + encodeURIComponent('이음푸드시스템_26년_제품소개서.pdf');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const msg = (() => {
      try {
        return t('brochure_confirm');
      } catch {
        return '상품 소개서를 다운로드 받으시겠습니까?';
      }
    })();
    if (!window.confirm(msg)) {
      e.preventDefault();
    }
  };

  return (
    <a
      href={pdfHref}
      download
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
