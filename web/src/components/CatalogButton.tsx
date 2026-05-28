'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

/**
 * 카탈로그 다운로드 트리거 — 클릭 시 확인 팝업 후 PDF 다운로드.
 * 파일 경로: /data/eumfoodsystem.pdf
 */
export default function CatalogButton({ className, ariaLabel, children }: Props) {
  const t = useTranslations();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const msg = (() => {
      try {
        return t('catalog_confirm');
      } catch {
        return '카탈로그를 다운로드 받으시겠습니까?';
      }
    })();
    if (!window.confirm(msg)) {
      e.preventDefault();
    }
  };

  return (
    <a
      href="/data/eumfoodsystem.pdf"
      download
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel ?? t('quick_catalog')}
      style={{ backgroundColor: '#ffffff' }}
    >
      {children}
    </a>
  );
}
