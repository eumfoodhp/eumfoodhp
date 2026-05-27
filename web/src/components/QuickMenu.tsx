'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

// QuickMenu = 문의 + 스크롤업만. 쇼핑몰/카탈로그/언어는 헤더 우측으로 옮김.
export default function QuickMenu() {
  const t = useTranslations();

  return (
    <div className="quick_menu">
      <Link href="/contact" className="quick_item quick_contact" aria-label={t('quick_contact')}>
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
