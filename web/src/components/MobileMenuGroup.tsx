'use client';

import { Link } from '@/i18n/navigation';

/**
 * 햄버거 메뉴의 카테고리 + 서브메뉴 한 그룹.
 * 서브 링크 클릭 시 페이지 이동 후 햄버거 메뉴 자동 닫기.
 *
 * vanilla JS (common.js) 가 #mo_nav.active / .mo_overlay.active 클래스로
 * 토글하던 것을 React 에서 직접 제거 — Link 의 navigation 과 동시에 처리.
 */
export default function MobileMenuGroup({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  const closeMenu = () => {
    document.getElementById('mo_nav')?.classList.remove('active');
    document.querySelector('.mo_overlay')?.classList.remove('active');
    document.body.classList.remove('menu_open');
    document.documentElement.classList.remove('menu_open');
  };

  return (
    <div className="menu_group">
      <div className="menu_dep1">
        <h3>{title}</h3>
      </div>
      <ul className="menu_dep2 mo_sub_menu">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href as never} onClick={closeMenu}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
