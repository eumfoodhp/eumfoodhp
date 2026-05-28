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
   * background-image on that class. Only rendered when showHero=true.
   */
  heroClass?: string;
  /**
   * 배너 이미지(hero) 노출 여부. 기본 false — 배너는 시설현황 같은
   * 일부 페이지에서만 명시적으로 활성화. 다른 페이지는 브레드크럼+탭만.
   */
  showHero?: boolean;
};

/** Shared sub-page hero: breadcrumb + title + desc + (optional) tab bar. */
export default function SubVisual({
  parentLabel,
  currentLabel,
  title,
  desc,
  tabBar,
  heroClass,
  showHero = false,
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
              {currentLabel && currentLabel !== parentLabel && (
                <>
                  <i className="dot"></i>
                  <span className="depth2 current">{currentLabel}</span>
                </>
              )}
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
        {showHero && <div className={heroClassName} style={heroStyle} />}
      </div>
    </section>
  );
}
