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
        <img src="/images/common/lang.png" alt="Language" />
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
