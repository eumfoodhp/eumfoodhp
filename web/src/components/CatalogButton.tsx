'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

/**
 * 회사 소개서 다운로드 트리거 — 클릭 시 확인 팝업 후 PDF 다운로드.
 * - zh: /data/eumfoodsystem-zh.pdf (중문판)
 * - 그 외(ko/en): /data/eumfoodsystem.pdf (한국어판)
 */
export default function CatalogButton({ className, ariaLabel, children }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const pdfHref = locale === 'zh' ? '/data/eumfoodsystem-zh.pdf' : '/data/eumfoodsystem.pdf';

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
      href={pdfHref}
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
