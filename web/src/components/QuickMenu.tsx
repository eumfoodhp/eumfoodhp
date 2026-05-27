'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

// 자사몰/문의/언어/카탈로그를 우측 하단 floating으로 모음 (헤더 우측은 GNB+햄버거만 남김)
export default function QuickMenu() {
  const t = useTranslations();

  return (
    <div className="quick_menu">
      <a
        href="https://smartstore.naver.com/eumfood"
        target="_blank"
        rel="noopener noreferrer"
        className="quick_item quick_mall"
        aria-label={t('quick_mall')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 10V6a4 4 0 1 0-8 0v4" />
          <path d="M3.5 7h17l-1.4 13.2a2 2 0 0 1-2 1.8H6.9a2 2 0 0 1-2-1.8L3.5 7z" />
        </svg>
      </a>

      <a
        href="/data/catalogue.pdf"
        download
        className="quick_item quick_catalog"
        aria-label={t('quick_catalog')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </a>

      <Link href="/contact" className="quick_item quick_contact" aria-label={t('quick_contact')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </Link>

      <div className="quick_item quick_lang">
        <LanguageSwitcher />
      </div>

      <button
        type="button"
        className="quick_item btn_top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t('quick_top')}
      >
        <img src="/images/common/top.png" alt="" />
      </button>
    </div>
  );
}
