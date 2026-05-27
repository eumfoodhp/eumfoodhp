'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * 제품 페이지의 "상품 소개서" 다운로드 트리거 — 클릭 시 확인 팝업.
 * 파일 경로: /data/catalogue.pdf (헤더 카탈로그(eumfoodsystem.pdf)와 다른 파일)
 */
export default function BrochureLink({ className, children }: Props) {
  const t = useTranslations();

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
      href="/data/catalogue.pdf"
      download
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
