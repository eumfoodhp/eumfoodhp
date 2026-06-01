'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { useEffect, useRef, useState } from 'react';

const LABELS: Record<string, string> = {
  ko: 'KO',
  zh: 'ZH',
  en: 'EN',
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 / ESC 로 닫기 — 이전엔 vanilla JS 가 active 클래스 토글했으나,
  // Next.js client-side navigation 후 이벤트 리스너가 분리되어 다음 클릭이 안 먹음.
  // React state 로 토글하면 navigation 후에도 안정적으로 작동.
  useEffect(() => {
    if (!open) return;
    const onClickOut = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOut);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOut);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="lang_wrap" ref={wrapRef}>
      <span
        role="button"
        tabIndex={0}
        className="lang_toggle_btn"
        aria-label={`Language: ${LABELS[currentLocale] ?? currentLocale}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      </span>
      <ul className={`lang_list${open ? ' active' : ''}`}>
        {routing.locales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              onClick={() => setOpen(false)}
              className={locale === currentLocale ? 'current' : undefined}
            >
              {LABELS[locale] ?? locale.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
