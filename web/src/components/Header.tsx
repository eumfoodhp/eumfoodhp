import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import CatalogButton from './CatalogButton';
import GnbNav from './GnbNav';

export default async function Header() {
  const t = await getTranslations();

  return (
    <header id="header">
      <div className="header_inner">
        <h1 className="logo">
          <Link href="/">
            <img src="/images/common/newlogo.png" alt="㈜이음푸드시스템 로고" />
          </Link>
        </h1>

        <div className="gnb_wrap">
          <nav className="gnb" aria-label="PC navigation">
            {/* GnbNav (Client) — usePathname 으로 active 카테고리 주황 포인트 */}
            <GnbNav />
          </nav>
          {/* 메가 드롭다운 제거 — 헤더 아래 sticky SubHeader 가 대체 */}
        </div>

        <div className="util_area">
          {/* 쇼핑몰 → 카탈로그 → 메뉴(햄버거) → 언어 순서로 원위치.
              햄버거/언어는 <button> 대신 <span role="button"> 사용 — Android Chrome Force Dark가
              form-control(<button>)만 강제 보정하기 때문에 비폼 요소로 우회. */}
          <a
            href="https://smartstore.naver.com/eumfood"
            target="_blank"
            rel="noopener noreferrer"
            className="btn_mall"
            aria-label={t('quick_mall')}
            style={{
              backgroundColor: '#ffffff',
              background: '#ffffff',
              WebkitAppearance: 'none',
              appearance: 'none',
              forcedColorAdjust: 'none',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 10V6a4 4 0 1 0-8 0v4" />
              <path d="M3.5 7h17l-1.4 13.2a2 2 0 0 1-2 1.8H6.9a2 2 0 0 1-2-1.8L3.5 7z" />
            </svg>
          </a>

          <CatalogButton className="btn_catalog btn_catalog_white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </CatalogButton>

          {/* 메뉴(햄버거) — <span role="button">로 비폼 요소화. Force Dark 회피. */}
          <span
            role="button"
            tabIndex={0}
            className="mo_menu_btn"
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </span>

          <LanguageSwitcher />
        </div>

        <div id="mo_nav" className="full_menu_overlay">
          <div className="menu_container">
            <div className="mo_nav_top">
              <button type="button" className="mo_close_btn">&times;</button>
            </div>

            <div className="menu_wrapper">
              <MobileMenuGroup
                title={t('menu_about')}
                items={[
                  { href: '/about#greeting', label: t('sub_greeting') },
                  { href: '/about#history', label: t('sub_history') },
                  { href: '/about#area', label: t('sub_biz_area') },
                  { href: '/about#organization', label: t('sub_org') },
                  { href: '/about#location', label: t('sub_location') },
                ]}
              />
              <MobileMenuGroup
                title={t('menu_business')}
                items={[
                  { href: '/business#facility', label: t('sub_facility') },
                  { href: '/business#process', label: t('sub_biz_process') },
                  { href: '/business#cert', label: t('sub_cert') },
                ]}
              />
              <MobileMenuGroup
                title={t('menu_product')}
                items={[
                  { href: '/products#pickles', label: t('sub_prod_pickles') },
                  { href: '/products#braised', label: t('sub_prod_braised') },
                  { href: '/products#namul', label: t('sub_prod_namul') },
                  { href: '/products#salted', label: t('sub_prod_salted') },
                  { href: '/products#sauce', label: t('sub_prod_sauce') },
                  { href: '/products#tea', label: t('sub_prod_tea') },
                ]}
              />
              <MobileMenuGroup
                title={t('menu_news')}
                items={[
                  { href: '/notice', label: t('sub_notice') },
                  { href: '/press', label: t('sub_news_press') },
                  { href: '/download', label: t('sub_board') },
                ]}
              />
              <MobileMenuGroup
                title={t('menu_inquiry')}
                items={[
                  { href: '/contact', label: t('sub_inquiry_1to1') },
                  { href: '/contact/sales', label: t('sub_inquiry_sales') },
                ]}
              />

            </div>
          </div>
        </div>
        <div className="mo_overlay"></div>
      </div>
    </header>
  );
}

function MobileMenuGroup({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div className="menu_group">
      <button type="button" className="menu_dep1 mo_menu_title" aria-expanded="false">
        <h3>{title}</h3>
        <span className="mo_plus" aria-hidden="true">+</span>
      </button>
      <ul className="menu_dep2 mo_sub_menu">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
