'use client';

import { usePathname, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { matchCategory } from './SubHeader';

/**
 * 메인 GNB — 현재 카테고리에 주황 포인트(언더라인 + 컬러).
 * usePathname 기반 active 클래스 추가.
 */
export default function GnbNav() {
  const pathname = usePathname();
  const t = useTranslations();
  const cat = matchCategory(pathname);
  const activeKey = cat?.key ?? null;

  const links = [
    { href: '/about', key: 'about', label: t('menu_about') },
    { href: '/business', key: 'business', label: t('menu_business') },
    { href: '/products/pickles', key: 'product', label: t('menu_product') },
    { href: '/notice', key: 'news', label: t('menu_news') },
    { href: '/contact', key: 'inquiry', label: t('menu_inquiry') },
  ];

  return (
    <div className="gnb_grid">
      {links.map((l) => (
        <Link
          key={l.key}
          href={l.href}
          className={`gnb_main_link${activeKey === l.key ? ' is_active' : ''}`}
        >
          <span>{l.label}</span>
        </Link>
      ))}
    </div>
  );
}
