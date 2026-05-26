'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

const LABELS: Record<(typeof routing.locales)[number], string> = {
  ko: 'KO',
  en: 'EN',
  zh: 'ZH',
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale() as keyof typeof LABELS;

  return (
    <div className="lang_wrap">
      <button
        type="button"
        className="lang_toggle_btn"
        aria-label={`Language: ${LABELS[currentLocale] ?? currentLocale}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      </button>
      <ul className="lang_list">
        {routing.locales.map((locale) => (
          <li key={locale}>
            <Link href={pathname} locale={locale}>
              {LABELS[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
