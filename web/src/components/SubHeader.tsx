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
      { href: '/products#pickles', key: 'sub_prod_pickles' },
      { href: '/products#braised', key: 'sub_prod_braised' },
      { href: '/products#namul', key: 'sub_prod_namul' },
      { href: '/products#salted', key: 'sub_prod_salted' },
      { href: '/products#sauce', key: 'sub_prod_sauce' },
      { href: '/products#tea', key: 'sub_prod_tea' },
    ],
  },
  {
    key: 'news',
    labelKey: 'menu_news',
    items: [
      { href: '/notice#notice', key: 'sub_notice' },
      { href: '/notice#press', key: 'sub_news_press' },
      // download 라우트 자체 삭제됨
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
  if (pathname.startsWith('/about')) return CATEGORIES.find((c) => c.key === 'about')!;
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

function matchCurrentItem(
  category: Category,
  pathname: string,
  hash: string,
  activeId: string
): Item {
  // 1. 스크롤스파이로 잡힌 섹션 id 가 있으면 최우선
  if (activeId) {
    const byScroll = category.items.find((i) => i.href.endsWith('#' + activeId));
    if (byScroll) return byScroll;
  }
  // 2. 명시적 URL hash
  if (hash) {
    const hashKey = hash.replace('#', '');
    const byHash = category.items.find((i) => i.href.endsWith('#' + hashKey));
    if (byHash) return byHash;
  }
  // 3. 정확한 path 매치
  const byPath = category.items.find((i) => {
    const itemPath = i.href.split('#')[0];
    return pathname === itemPath;
  });
  if (byPath) return byPath;
  // 4. prefix 매치
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
  const [activeId, setActiveId] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [mobileTop, setMobileTop] = useState(188);

  // 모바일 감지 + 헤더 실제 높이 측정 → SubHeader top 값 동기화
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => {
      setIsMobile(mq.matches);
      // 헤더 실제 높이로 SubHeader top 동기화 (헤더 padding 바뀌어도 자동)
      if (mq.matches) {
        const h = document.getElementById('header');
        if (h) setMobileTop(h.getBoundingClientRect().height);
      }
    };
    update();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update);
      window.addEventListener('resize', update);
      return () => {
        mq.removeEventListener('change', update);
        window.removeEventListener('resize', update);
      };
    } else {
      mq.addListener(update);
      return () => mq.removeListener(update);
    }
  }, []);

  useEffect(() => {
    setHash(window.location.hash);
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // 스크롤스파이 — 원페이지(/about, /business, /products)에서
  // 현재 화면 가장 위쪽에 보이는 섹션 id 를 active 로 잡는다.
  useEffect(() => {
    const category = matchCategory(pathname);
    if (!category) return;
    const ids = category.items
      .map((i) => i.href.split('#')[1])
      .filter((v): v is string => Boolean(v));
    if (ids.length === 0) {
      setActiveId('');
      return;
    }
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const pickActive = () => {
      // 헤더+서브헤더 아래쪽 ~30% viewport 라인 기준으로 가장 최근에
      // top 이 그 라인을 통과한 섹션을 active 로. 기존 160px 은 너무
      // 위쪽이라 새 섹션이 들어와도 한 박자 늦게 active 되던 문제.
      const probe = Math.max(220, window.innerHeight * 0.35);
      let current = sections[0].id;
      for (const sec of sections) {
        const top = sec.getBoundingClientRect().top;
        if (top <= probe) current = sec.id;
        else break;
      }
      setActiveId(current);
    };

    pickActive();
    window.addEventListener('scroll', pickActive, { passive: true });
    window.addEventListener('resize', pickActive);
    return () => {
      window.removeEventListener('scroll', pickActive);
      window.removeEventListener('resize', pickActive);
    };
  }, [pathname]);

  // 자동 숨김/노출: 페이지 안에서 마우스가 움직이거나 스크롤하면 펼침,
  // 4초간 아무 활동도 없으면 자동 닫힘. sub_header 위에 마우스 올라가 있는
  // 동안엔 닫지 않음. 토글 직후엔 자기 자신이 만든 layout/scroll 이벤트를
  // 무시해서 깜빡임 방지.
  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let isMouseOverSub = false;
    let suppressUntil = 0;          // 이 시점까지 scroll/mousemove 이벤트 무시
    let lastMouseX = -1;
    let lastMouseY = -1;
    const HIDE_DELAY = 4000;
    const SELF_EVENT_SUPPRESS_MS = 450; // CSS transition (300ms) + 여유
    const MOUSE_THRESHOLD = 5;          // 5px 미만 떨림은 무시

    const scheduleHide = () => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!isMouseOverSub) {
          suppressUntil = Date.now() + SELF_EVENT_SUPPRESS_MS;
          setVisible(false);
        }
      }, HIDE_DELAY);
    };

    const show = () => {
      setVisible((prev) => {
        if (!prev) suppressUntil = Date.now() + SELF_EVENT_SUPPRESS_MS;
        return true;
      });
      scheduleHide();
    };

    const onScroll = () => {
      if (Date.now() < suppressUntil) return;
      show();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (Date.now() < suppressUntil) return;
      // 미세 떨림 무시 (호버 상태에서도 마우스가 1~2px 흔들리는 경우)
      if (lastMouseX >= 0) {
        const dx = Math.abs(e.clientX - lastMouseX);
        const dy = Math.abs(e.clientY - lastMouseY);
        if (dx < MOUSE_THRESHOLD && dy < MOUSE_THRESHOLD) return;
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      show();
    };
    const onTouchOrKey = () => show();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchOrKey, { passive: true });
    window.addEventListener('keydown', onTouchOrKey);

    // sub_header 자체 hover 트래킹 — 위에 마우스 올려두면 안 닫힘
    const node = document.querySelector('.sub_header');
    const onEnter = () => {
      isMouseOverSub = true;
      setVisible(true);
      if (hideTimer) clearTimeout(hideTimer);
    };
    const onLeave = () => {
      isMouseOverSub = false;
      scheduleHide();
    };
    node?.addEventListener('mouseenter', onEnter);
    node?.addEventListener('mouseleave', onLeave);

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchOrKey);
      window.removeEventListener('keydown', onTouchOrKey);
      node?.removeEventListener('mouseenter', onEnter);
      node?.removeEventListener('mouseleave', onLeave);
    };
  }, [pathname]);

  const category = matchCategory(pathname);
  if (!category) return null;

  const currentItem = matchCurrentItem(category, pathname, hash, activeId);

  return (
    <nav
      className={`sub_header${visible || isMobile ? ' is_visible' : ''}`}
      role="navigation"
      aria-label="sub navigation"
      style={
        isMobile
          ? {
              /* 모바일은 mouse 이벤트가 없어서 PC visible 트리거가 동작 안 함.
                 inline 으로 펼친 상태 유지 + sticky + 실시간 헤더 높이 동기화. */
              position: 'sticky',
              top: mobileTop,
              maxHeight: 80,
              opacity: 1,
              transform: 'none',
              pointerEvents: 'auto',
            }
          : undefined
      }
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
