'use client';

import { useState, useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

/**
 * 헤더 아래 sticky 서브헤더. 두 박스로 구성:
 *   [Box 1: 1/3] 현재 선택된 서브메뉴 이름만
 *   [Box 2: 2/3] 전체 서브메뉴 가로 나열 (메인 GNB 처럼 균등 분배)
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
  if (hash) {
    const hashKey = hash.replace('#', '');
    const byHash = category.items.find((i) => i.href.endsWith('#' + hashKey));
    if (byHash) return byHash;
  }
  const byPath = category.items.find((i) => {
    const itemPath = i.href.split('#')[0];
    return pathname === itemPath;
  });
  if (byPath) return byPath;
  const byPrefix = category.items.find((i) => {
    const itemPath = i.href.split('#')[0];
    return pathname.startsWith(itemPath) && itemPath !== '/';
  });
  if (byPrefix) return byPrefix;
  return category.items[0];
}

export default function SubHeader() {
  const pathname = usePathname();
  const t = useTranslations();
  const [hash, setHash] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setHash(window.location.hash);
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // 자동 숨김/노출: 스크롤하거나 헤더 근처 hover 시 펼침,
  // 활동 멈추면 2초 뒤 자동 닫힘.
  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let isMouseOverSub = false;

    const show = () => {
      setVisible(true);
      if (hideTimer) clearTimeout(hideTimer);
      // 마우스가 sub_header 위에 있으면 안 닫음
      hideTimer = setTimeout(() => {
        if (!isMouseOverSub) setVisible(false);
      }, 2000);
    };

    const onScroll = () => show();

    const onMove = (e: MouseEvent) => {
      // 상단 120px 안에서 마우스 움직이면 펼침
      if (e.clientY < 140) show();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });

    // sub_header 자체 hover 트래킹
    const node = document.querySelector('.sub_header');
    const onEnter = () => {
      isMouseOverSub = true;
      setVisible(true);
      if (hideTimer) clearTimeout(hideTimer);
    };
    const onLeave = () => {
      isMouseOverSub = false;
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setVisible(false), 800);
    };
    node?.addEventListener('mouseenter', onEnter);
    node?.addEventListener('mouseleave', onLeave);

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      node?.removeEventListener('mouseenter', onEnter);
      node?.removeEventListener('mouseleave', onLeave);
    };
  }, [pathname]);

  const category = matchCategory(pathname);
  if (!category) return null;

  const currentItem = matchCurrentItem(category, pathname, hash);

  return (
    <nav
      className={`sub_header${visible ? ' is_visible' : ''}`}
      role="navigation"
      aria-label="sub navigation"
    >
      <ul className="sub_header_nav_list">
        {category.items.map((item) => {
          const isActive = currentItem.href === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`sub_header_nav_link${isActive ? ' is_active' : ''}`}
              >
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
