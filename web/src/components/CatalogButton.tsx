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
 * - zh: 易音食品系统_26_企业简介.pdf (중문판)
 * - 그 외(ko/en): 이음푸드시스템_26년_회사소개서.pdf (한국어판) — 파일 별도 제공 예정
 * 파일명은 원본 그대로 사용 → 사용자 저장 시 의미있는 이름으로 보존됨.
 */
export default function CatalogButton({ className, ariaLabel, children }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const pdfHref =
    locale === 'zh'
      ? '/data/' + encodeURIComponent('易音食品系统_26_企业简介.pdf')
      : '/data/' + encodeURIComponent('이음푸드시스템_26년_회사소개서.pdf');

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
