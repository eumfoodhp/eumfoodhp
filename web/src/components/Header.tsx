import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default async function Header() {
  const t = await getTranslations();

  return (
    <header id="header">
      <div className="header_inner">
        <h1 className="logo">
          <Link href="/">
            <img src="/images/common/logo.png" alt="㈜이음푸드시스템 로고" />
          </Link>
        </h1>

        <div className="gnb_wrap">
          <nav className="gnb" aria-label="PC navigation">
            <div className="gnb_grid">
              <Link href="/about/greeting" className="gnb_main_link"><span>{t('menu_about')}</span></Link>
              <Link href="/business/area" className="gnb_main_link"><span>{t('menu_business')}</span></Link>
              <Link href="/products/pickles" className="gnb_main_link"><span>{t('menu_product')}</span></Link>
              <Link href="/notice" className="gnb_main_link"><span>{t('menu_news')}</span></Link>
              <Link href="/contact" className="gnb_main_link"><span>{t('menu_support')}</span></Link>
            </div>
          </nav>

          <div className="mega_panel">
            <div className="mega_menu_backdrop" aria-hidden="true"></div>
            <div className="mega_panel_inner">
              <div className="mega_col mega_c1">
                <ul className="mega_sub_list">
                  <li><Link href="/about/greeting">{t('sub_greeting')}</Link></li>
                  <li><Link href="/about/history">{t('sub_history')}</Link></li>
                  <li><Link href="/about/cert">{t('sub_cert')}</Link></li>
                  <li><Link href="/about/organization">{t('sub_org')}</Link></li>
                  <li><Link href="/about/location">{t('sub_location')}</Link></li>
                </ul>
              </div>
              <div className="mega_col mega_c2">
                <ul className="mega_sub_list">
                  <li><Link href="/business/area">{t('sub_biz_area')}</Link></li>
                  <li><Link href="/business/facility">{t('sub_facility')}</Link></li>
                  <li><Link href="/business/process">{t('sub_biz_process')}</Link></li>
                </ul>
              </div>
              <div className="mega_col mega_c3">
                <ul className="mega_sub_list">
                  <li><Link href="/products/pickles">{t('sub_prod_pickles')}</Link></li>
                  <li><Link href="/products/braised">{t('sub_prod_braised')}</Link></li>
                  <li><Link href="/products/namul">{t('sub_prod_namul')}</Link></li>
                  <li><Link href="/products/salted">{t('sub_prod_salted')}</Link></li>
                  <li><Link href="/products/sauce">{t('sub_prod_sauce')}</Link></li>
                  <li><Link href="/products/tea">{t('sub_prod_tea')}</Link></li>
                </ul>
              </div>
              <div className="mega_col mega_c4">
                <ul className="mega_sub_list">
                  <li><Link href="/notice">{t('sub_notice')}</Link></li>
                  <li><Link href="/press">{t('sub_news_press')}</Link></li>
                  <li><Link href="/download">{t('sub_board')}</Link></li>
                </ul>
              </div>
              <div className="mega_col mega_c5">
                <ul className="mega_sub_list">
                  <li><Link href="/contact">{t('sub_inquiry_1to1')}</Link></li>
                  <li><Link href="/contact/sales">{t('sub_inquiry_sales')}</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="util_area">
          <Link href="/contact" className="btn_inquiry" aria-label={t('menu_inquiry')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </Link>
          <LanguageSwitcher />
          <button type="button" className="mo_menu_btn" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
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
                  { href: '/about/greeting', label: t('sub_greeting') },
                  { href: '/about/history', label: t('sub_history') },
                  { href: '/about/cert', label: t('sub_cert') },
                  { href: '/about/organization', label: t('sub_org') },
                  { href: '/about/location', label: t('sub_location') },
                ]}
              />
              <MobileMenuGroup
                title={t('menu_business')}
                items={[
                  { href: '/business/area', label: t('sub_biz_area') },
                  { href: '/business/facility', label: t('sub_facility') },
                  { href: '/business/process', label: t('sub_biz_process') },
                ]}
              />
              <MobileMenuGroup
                title={t('menu_product')}
                items={[
                  { href: '/products/pickles', label: t('sub_prod_pickles') },
                  { href: '/products/braised', label: t('sub_prod_braised') },
                  { href: '/products/namul', label: t('sub_prod_namul') },
                  { href: '/products/salted', label: t('sub_prod_salted') },
                  { href: '/products/sauce', label: t('sub_prod_sauce') },
                  { href: '/products/tea', label: t('sub_prod_tea') },
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
                title={t('menu_support')}
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
