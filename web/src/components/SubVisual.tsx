import type { ReactNode } from 'react';

type Props = {
  parentLabel: string;
  currentLabel: string;
  title: string;
  desc: string;
  tabBar?: ReactNode;
  /**
   * Per-page hero variant class — e.g. "business_hero_visual",
   * "product_pickles_hero_visual". CSS in /styles/<page>.css sets
   * background-image on that class. If omitted, falls back to
   * /images/sub/tempo.png (used by about/process pages).
   */
  heroClass?: string;
};

/** Shared sub-page hero: breadcrumb + title + desc + (optional) tab bar. */
export default function SubVisual({
  parentLabel,
  currentLabel,
  title,
  desc,
  tabBar,
  heroClass,
}: Props) {
  const heroClassName = heroClass
    ? `sub_visual_img ${heroClass}`
    : 'sub_visual_img';
  const heroStyle = heroClass
    ? undefined
    : { backgroundImage: "url('/images/sub/tempo.png')" };

  return (
    <section className="sub_visual_section">
      <div className="sub_inner">
        <div className="sub_top_bar">
          <div className="sub_top_left">
            <nav className="breadcrumb">
              <img src="/images/sub/home.png" alt="home" className="home_icon" />
              <i className="dot"></i>
              <span className="depth1">{parentLabel}</span>
              <i className="dot"></i>
              <span className="depth2 current">{currentLabel}</span>
            </nav>
            <p className="sub_page_desc">{desc}</p>
            {/* SR-only로 타이틀 유지 (검색·접근성) */}
            <h2 className="sub_page_title sr_only">{title}</h2>
          </div>
          {tabBar && (
            <div className="sub_tab_container sub_tab_container--top">
              <div className="sub_tab_inner">{tabBar}</div>
            </div>
          )}
        </div>
        <div className={heroClassName} style={heroStyle} />
      </div>
    </section>
  );
}
