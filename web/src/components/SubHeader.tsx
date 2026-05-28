'use client';

import { useState, useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

/**
 * 헤더 아래 sticky 서브헤더. 두 박스로 구성:
 *   [box 1] 현재 카테고리 + 현재 선택된 서브메뉴 이름 (읽기 전용 표시)
 *   [box 2] 전체 서브메뉴 토글 (클릭 시 드롭다운, 항목 선택 → 이동)
 *
 * 카테고리 매칭은 URL 경로(usePathname) + hash(window.location.hash) 로.
 */

type Item = { href: string; key: string };

type Category = {
  key: 'about' | 'business' | 'product' | 'news' | 'inquiry';
  labelKey: string;
  items: Item[];
};

const CATEGORIES: Category[] = [
  {
    key: 'about',
    labelKey: 'menu_about',
    items: [
      { href: '/about#greeting', key: 'sub_greeting' },
      { href: '/about#history', key: 'sub_history' },
      { href: '/about#area', key: 'sub_biz_area' },
      { href: '/about#organization', key: 'sub_org' },
      { href: '/about#location', key: 'sub_location' },
    ],
  },
  {
    key: 'business',
    labelKey: 'menu_business',
    items: [
      { href: '/business#facility', key: 'sub_facility' },
      { href: '/business#process', key: 'sub_biz_process' },
      { href: '/business#cert', key: 'sub_cert' },
    ],
  },
  {
    key: 'product',
    labelKey: 'menu_product',
    items: [
      { href: '/products/pickles', key: 'sub_prod_pickles' },
      { href: '/products/braised', key: 'sub_prod_braised' },
      { href: '/products/namul', key: 'sub_prod_namul' },
      { href: '/products/salted', key: 'sub_prod_salted' },
      { href: '/products/sauce', key: 'sub_prod_sauce' },
      { href: '/products/tea', key: 'sub_prod_tea' },
    ],
  },
  {
    key: 'news',
    labelKey: 'menu_news',
    items: [
      { href: '/notice', key: 'sub_notice' },
      { href: '/press', key: 'sub_news_press' },
      { href: '/download', key: 'sub_board' },
    ],
  },
  {
    key: 'inquiry',
    labelKey: 'menu_inquiry',
    items: [
      { href: '/contact', key: 'sub_inquiry_1to1' },
      { href: '/contact/sales', key: 'sub_inquiry_sales' },
    ],
  },
];

export function matchCategory(pathname: string): Category | null {
  if (pathname === '/' || pathname === '') return null;
  if (pathname.startsWith('/about/cert')) return CATEGORIES.find((c) => c.key === 'business')!;
  if (pathname.startsWith('/about')) return CATEGORIES.find((c) => c.key === 'about')!;
  if (pathname.startsWith('/business/area')) return CATEGORIES.find((c) => c.key === 'about')!;
  if (pathname.startsWith('/business')) return CATEGORIES.find((c) => c.key === 'business')!;
  if (pathname.startsWith('/products')) return CATEGORIES.find((c) => c.key === 'product')!;
  if (
    pathname.startsWith('/notice') ||
    pathname.startsWith('/press') ||
    pathname.startsWith('/download')
  )
    return CATEGORIES.find((c) => c.key === 'news')!;
  if (pathname.startsWith('/contact')) return CATEGORIES.find((c) => c.key === 'inquiry')!;
  return null;
}

function matchCurrentItem(category: Category, pathname: string, hash: string): Item {
  // 1) hash 매칭 (/about#history 같은 경우)
  if (hash) {
    const hashKey = hash.replace('#', '');
    const byHash = category.items.find((i) => i.href.endsWith('#' + hashKey));
    if (byHash) return byHash;
  }
  // 2) pathname 정확 매칭 (/products/pickles 같은 경우)
  const byPath = category.items.find((i) => {
    const itemPath = i.href.split('#')[0];
    return pathname === itemPath;
  });
  if (byPath) return byPath;
  // 3) pathname 부분 매칭 (디테일 페이지 /press/123 → '보도자료')
  const byPrefix = category.items.find((i) => {
    const itemPath = i.href.split('#')[0];
    return pathname.startsWith(itemPath) && itemPath !== '/';
  });
  if (byPrefix) return byPrefix;
  // 4) 기본값: 첫 항목
  return category.items[0];
}

export default function SubHeader() {
  const pathname = usePathname();
  const t = useTranslations();
  const [hash, setHash] = useState('');
  const [open, setOpen] = useState(false);

  // hash 추적
  useEffect(() => {
    setHash(window.location.hash);
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // pathname 변경 시 토글 닫기
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 바깥 클릭 시 토글 닫기
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('.sub_header_box--toggle');
      if (!el) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  const category = matchCategory(pathname);
  if (!category) return null;

  const currentItem = matchCurrentItem(category, pathname, hash);

  return (
    <div className="sub_header" role="navigation" aria-label="sub navigation">
      <div className="sub_header_inner">
        {/* Box 1: 현재 카테고리 + 현재 선택 항목 */}
        <div className="sub_header_box sub_header_box--current">
          <span className="sub_header_cate">{t(category.labelKey)}</span>
          <span className="sub_header_pipe" aria-hidden="true"></span>
          <span className="sub_header_label">{t(currentItem.key)}</span>
        </div>

        {/* Box 2: 전체 메뉴 토글 */}
        <div className="sub_header_box sub_header_box--toggle">
          <button
            type="button"
            className="sub_header_toggle_btn"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            <span>{t(currentItem.key)}</span>
            <svg
              className={`chev${open ? ' open' : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          {open && (
            <ul className="sub_header_dropdown" role="listbox">
              {category.items.map((item) => {
                const itemHash = item.href.split('#')[1] ?? '';
                const isActive = currentItem.href === item.href;
                return (
                  <li key={item.href} role="option" aria-selected={isActive}>
                    <Link
                      href={item.href}
                      className={`sub_header_dropdown_link${isActive ? ' is_active' : ''}`}
                      onClick={() => {
                        setOpen(false);
                        if (itemHash) setHash('#' + itemHash);
                      }}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
