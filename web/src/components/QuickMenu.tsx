'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

// QuickMenu = 문의 + 스크롤업만. 쇼핑몰/카탈로그/언어는 헤더 우측으로 옮김.
export default function QuickMenu() {
  const t = useTranslations();

  return (
    <div className="quick_menu">
      <Link href="/contact" className="quick_item quick_contact" aria-label={t('quick_contact')}>
        <svg
          className="quick_contact_icon"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="#F39800"
          stroke="#F39800"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="quick_contact_label">{t('quick_contact')}</span>
      </Link>

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
