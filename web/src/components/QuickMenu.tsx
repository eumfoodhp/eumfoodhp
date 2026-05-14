'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function QuickMenu() {
  const t = useTranslations();

  return (
    <div className="quick_menu">
      <a
        href="https://smartstore.naver.com/Eumfood/"
        target="_blank"
        rel="noopener noreferrer"
        className="quick_item mall"
      >
        <div className="icon_box">
          <img src="/images/common/mall.png" alt={t('quick_mall')} />
        </div>
        <span>{t('quick_mall')}</span>
      </a>

      <Link href="/contact/write" className="quick_item contact">
        <div className="icon_box">
          <img src="/images/common/talk.png" alt={t('quick_contact')} />
        </div>
        <span>{t('quick_contact')}</span>
      </Link>

      <a href="/data/catalogue.pdf" download className="quick_item catalog">
        <div className="icon_box">
          <img src="/images/common/down.png" alt={t('quick_catalog')} />
        </div>
        <span>{t('quick_catalog')}</span>
      </a>

      <button
        type="button"
        className="quick_item btn_top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <img src="/images/common/top.png" alt={t('quick_top')} />
      </button>
    </div>
  );
}
