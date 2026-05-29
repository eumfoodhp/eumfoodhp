/**
 * Tab definitions for sub-section pages. Each function takes a `t` translator
 * and returns the tab list, ready to pass to <SubTabBar />.
 */

type Translator = (key: string) => string;

export function aboutTabs(t: Translator) {
  return [
    { key: 'greeting', href: '/about#greeting', label: t('sub_tab_greeting') },
    { key: 'history', href: '/about#history', label: t('sub_tab_history') },
    // 주요 사업 (구 사업영역) — '소개' 그룹으로 이동
    { key: 'area', href: '/about#area', label: t('sub_biz_area') },
    { key: 'org', href: '/about#organization', label: t('sub_tab_org') },
    { key: 'location', href: '/about#location', label: t('sub_tab_direction') },
  ];
}

export function businessTabs(t: Translator) {
  return [
    { key: 'facility', href: '/business#facility', label: t('sub_facility') },
    { key: 'process', href: '/business#process', label: t('sub_biz_process') },
    // 인증·특허 — '제조' 그룹으로 이동
    { key: 'cert', href: '/business#cert', label: t('sub_cert') },
  ];
}

export function productsTabs(t: Translator) {
  return [
    { key: 'pickles', href: '/products#pickles', label: t('sub_prod_pickles') },
    { key: 'braised', href: '/products#braised', label: t('sub_prod_braised') },
    { key: 'namul', href: '/products#namul', label: t('sub_prod_namul') },
    { key: 'salted', href: '/products#salted', label: t('sub_prod_salted') },
    { key: 'sauce', href: '/products#sauce', label: t('sub_prod_sauce') },
    { key: 'tea', href: '/products#tea', label: t('sub_prod_tea') },
  ];
}

export function newsroomTabs(t: Translator) {
  return [
    { key: 'notice', href: '/notice#notice', label: t('sub_notice') },
    { key: 'press', href: '/notice#press', label: t('sub_news_press') },
    // download 라우트 자체 삭제됨
  ];
}

export function supportTabs(t: Translator) {
  return [
    { key: 'contact', href: '/contact', label: t('sub_inquiry_1to1') },
    { key: 'sales', href: '/contact/sales', label: t('sub_inquiry_sales') },
  ];
}
