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
 * - zh: 易音食品系统_企业简介_2026.pdf (중문판)
 * - 그 외(ko/en): 이음푸드시스템_회사소개서_2026.pdf (한국어판)
 * 파일명 원본 그대로 → 사용자가 받으면 의미있는 이름으로 저장됨.
 */
export default function CatalogButton({ className, ariaLabel, children }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const pdfHref =
    locale === 'zh'
      ? '/data/' + encodeURIComponent('易音食品系统_企业简介_2026.pdf')
      : '/data/' + encodeURIComponent('이음푸드시스템_회사소개서_2026.pdf');

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
