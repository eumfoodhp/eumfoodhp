'use client';

/**
 * 메가메뉴 (완전 신규 — 기존 gnb/mega CSS 꼬임과 분리).
 * - 클라이언트 컴포넌트 + useState 호버 (data-open) → :has() / CSS 캐스케이드 의존 없음
 * - 독립 클래스명(mm_*) → 기존 .mega_panel/.gnb_* CSS 와 충돌 불가
 * - 패널: 풀폭, 배경 투명, 글씨만 (사용자 요청)
 */
import { useEffect, useRef, useState } from 'react';
import { usePathname, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

type Item = { href: string; key: string };
type Col = { href: string; labelKey: string; match: string; items: Item[] };

const COLS: Col[] = [
  {
    href: '/about', labelKey: 'menu_about', match: '/about',
    items: [
      { href: '/about#greeting', key: 'sub_greeting' },
      { href: '/about#history', key: 'sub_history' },
      { href: '/about#area', key: 'sub_biz_area' },
      { href: '/about#organization', key: 'sub_org' },
      { href: '/about#location', key: 'sub_location' },
    ],
  },
  {
    href: '/business', labelKey: 'menu_business', match: '/business',
    items: [
      { href: '/business#facility', key: 'sub_facility' },
      { href: '/business#process', key: 'sub_biz_process' },
      { href: '/business#cert', key: 'sub_cert' },
    ],
  },
  {
    href: '/products', labelKey: 'menu_product', match: '/products',
    items: [
      { href: '/products#pickles', key: 'sub_prod_pickles' },
      { href: '/products#braised', key: 'sub_prod_braised' },
      { href: '/products#namul', key: 'sub_prod_namul' },
      { href: '/products#salted', key: 'sub_prod_salted' },
      { href: '/products#sauce', key: 'sub_prod_sauce' },
      { href: '/products#tea', key: 'sub_prod_tea' },
    ],
  },
  {
    href: '/notice', labelKey: 'menu_news', match: '/notice',
    items: [
      { href: '/notice#notice', key: 'sub_notice' },
      { href: '/notice#press', key: 'sub_news_press' },
    ],
  },
  {
    href: '/contact', labelKey: 'menu_inquiry', match: '/contact',
    items: [
      { href: '/contact', key: 'sub_inquiry_1to1' },
      { href: '/contact#sales', key: 'sub_inquiry_sales' },
    ],
  },
];

export default function MegaMenu() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 메가 카드(::after)를 헤더 바(#header)에 정확히 포개기 — JS로 실측해 CSS 변수로 전달 (근사치 X)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sync = () => {
      const header = document.getElementById('header');
      if (!header) return;
      const h = header.getBoundingClientRect();
      const r = root.getBoundingClientRect();
      root.style.setProperty('--mm-card-l', `${h.left - r.left}px`);
      root.style.setProperty('--mm-card-w', `${h.width}px`);
      root.style.setProperty('--mm-card-tr', 'none');
      root.style.setProperty('--mm-card-mw', 'none');
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  return (
    <div className="mm_root" ref={rootRef} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <nav className="mm_top" aria-label="PC navigation">
        {COLS.map((c) => {
          const active = pathname.startsWith(c.match);
          return (
            <Link key={c.match} href={c.href} className={`mm_top_link${active ? ' is_active' : ''}`} onClick={() => setOpen(false)}>
              {t(c.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="mm_panel" data-open={open ? 'true' : 'false'}>
        <div className="mm_inner">
          {COLS.map((c) => (
            <div key={c.match} className="mm_col">
              <ul className="mm_list">
                {c.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} onClick={() => setOpen(false)}>{t(it.key)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
