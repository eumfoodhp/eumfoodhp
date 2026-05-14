import type { ReactNode } from 'react';

type Props = {
  parentLabel: string;
  currentLabel: string;
  title: string;
  desc: string;
  tabBar: ReactNode;
};

/** Shared sub-page hero: breadcrumb + title + desc + tab bar. */
export default function SubVisual({ parentLabel, currentLabel, title, desc, tabBar }: Props) {
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
        <div
          className="sub_visual_img"
          style={{ backgroundImage: "url('/images/sub/tempo.png')" }}
        >
          <div className="sub_tab_container">
            <div className="sub_tab_inner">{tabBar}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
