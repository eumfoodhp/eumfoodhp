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
        <div className="breadcrumb_wrap">
          <nav className="breadcrumb">
            <img src="/images/sub/home.png" alt="home" className="home_icon" />
            <i className="dot"></i>
            <span className="depth1">{parentLabel}</span>
            <i className="dot"></i>
            <span className="depth2 current">{currentLabel}</span>
          </nav>
          <div className="sub_title_group">
            <h2 className="sub_page_title">{title}</h2>
            <p className="sub_page_desc">{desc}</p>
          </div>
        </div>
        <div className={heroClassName} style={heroStyle}>
          {tabBar && (
            <div className="sub_tab_container sub_tab_container--below">
              <div className="sub_tab_inner">{tabBar}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
