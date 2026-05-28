'use client';

import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

/**
 * 헤더 아래 고정 서브헤더.
 * 현재 URL 경로에 따라 자동으로 해당 GNB 카테고리의 하위 메뉴 표시.
 *
 * - / (홈) → 표시 안 함
 * - /about/* (또는 /business/area, /about/cert 같이 소개로 묶인 거) → 소개 sub
 * - /business/* (시설/공정) + /about/cert → 제조 sub
 * - /products/* → 제품 sub
 * - /notice, /press, /download → 소식 sub
 * - /contact* → 문의 sub
 *
 * 헤더와 함께 sticky → 스크롤해도 따라옴.
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

function matchCategory(pathname: string): Category | null {
  if (pathname === '/' || pathname === '') return null;
  // 우선순위: 명시적 경로 매칭
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

export default function SubHeader() {
  const pathname = usePathname();
  const t = useTranslations();
  const category = matchCategory(pathname);

  if (!category) return null;

  return (
    <div className="sub_header" role="navigation" aria-label="sub navigation">
      <div className="sub_header_inner">
        <div className="sub_header_title">{t(category.labelKey)}</div>
        <ul className="sub_header_items">
          {category.items.map((item) => {
            // anchor 같은 경로는 startsWith 비교 시 anchor 제거 후 비교
            const itemPath = item.href.split('#')[0];
            const isActive = pathname === item.href || pathname === itemPath;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sub_header_link${isActive ? ' is_active' : ''}`}
                >
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
