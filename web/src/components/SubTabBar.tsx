import { Link } from '@/i18n/navigation';

type TabItem = { href: string; label: string; key: string };

/**
 * Sub-section tab bar. Pass `tabs` (label + href) and the `activeKey` matching
 * the current page. Used by about/business/products/process sub-page layouts.
 */
export default function SubTabBar({
  tabs,
  activeKey,
}: {
  tabs: TabItem[];
  activeKey: string;
}) {
  return (
    <>
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          scroll={false}
          className={`sub_tab_item ${tab.key === activeKey ? 'active' : ''}`}
        >
          {tab.label}
        </Link>
      ))}
    </>
  );
}
