'use client';

/**
 * 모바일 전용 메인 메뉴 sticky 바 (서브1).
 * 헤더 1단 (로고+유틸) 아래에 sticky 로 따라옴.
 * 데스크탑 (≥1025) 에서는 hide (헤더 안의 GnbNav 가 그 역할).
 */

import { usePathname, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { matchCategory } from './SubHeader';

export default function MobileMainNav() {
  const pathname = usePathname();
  const t = useTranslations();
  const cat = matchCategory(pathname);
  const activeKey = cat?.key ?? null;

  const links = [
    { href: '/about', key: 'about', label: t('menu_about') },
    { href: '/business', key: 'business', label: t('menu_business') },
    { href: '/products', key: 'product', label: t('menu_product') },
    { href: '/notice', key: 'news', label: t('menu_news') },
    { href: '/contact', key: 'inquiry', label: t('menu_inquiry') },
  ];

  return (
    <nav className="mobile_main_nav" aria-label="mobile main navigation">
      <ul className="mobile_main_nav_list">
        {links.map((l) => (
          <li key={l.key}>
            <Link
              href={l.href}
              className={`mobile_main_nav_link${activeKey === l.key ? ' is_active' : ''}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
