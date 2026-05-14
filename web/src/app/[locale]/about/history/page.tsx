import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { aboutTabs } from '@/lib/sub-tabs';

type HistoryDataItem = { year: string; list: Array<{ month: string; content: string }> };
type HistoryListItem = { year: string; contents: string[] };

const PERIODS = [
  { id: 'p1', label: 'NOW ~ 2022', start: 2022, end: 9999 },
  { id: 'p2', label: '2021 ~ 2017', start: 2017, end: 2021 },
  { id: 'p3', label: '2016 ~ 2012', start: 2012, end: 2016 },
  { id: 'p4', label: '2011 ~ 2009', start: 2009, end: 2011 },
];

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Combine the two lang sources into a `{ year: string[] }` map.
  const data = (t.raw('history_data') ?? []) as HistoryDataItem[];
  const list = (t.raw('history_list') ?? []) as HistoryListItem[];
  const byYear: Record<string, string[]> = {};
  for (const item of data) {
    byYear[item.year] = (byYear[item.year] ?? []).concat(item.list.map((x) => x.content));
  }
  for (const item of list) {
    byYear[item.year] = (byYear[item.year] ?? []).concat(item.contents);
  }

  const sortedYears = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <link rel="stylesheet" href="/css/sub.css" />

      <main id="sub_contents" className="history_page">
        <SubVisual
          parentLabel={t('menu_about')}
          currentLabel={t('sub_tab_history')}
          title={t('history_title')}
          desc={t('sub_banner_history_desc')}
          tabBar={<SubTabBar tabs={aboutTabs(t)} activeKey="history" />}
        />

        <section className="new_history_section">
          <div className="sub_inner">
            <div className="new_history_container">
              <div className="history_side">
                <div className="history_sticky_tabs">
                  {PERIODS.map((p) => (
                    <a key={p.id} href={`#${p.id}`} className="period_tab">
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="history_main">
                {PERIODS.map((p) => (
                  <div key={p.id} id={p.id} className="period_group">
                    <h3 className="period_title">{p.label}</h3>
                    <div className="period_content">
                      {sortedYears
                        .filter((y) => Number(y) >= p.start && Number(y) <= p.end)
                        .map((year) => (
                          <div key={year} className="year_item">
                            <h4 className="year_tit">{year}</h4>
                            <ul className="year_details">
                              {byYear[year].map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Script id="history-scroll-spy" strategy="afterInteractive">
        {`
(function () {
  const tabs = Array.from(document.querySelectorAll('.history_sticky_tabs .period_tab'));
  const sections = Array.from(document.querySelectorAll('.period_group'));
  if (!tabs.length || !sections.length) return;

  const getHeaderOffset = () => (window.innerWidth <= 735 ? 88 : 140);
  const setActiveTab = (id) => {
    tabs.forEach((tab) => {
      const targetId = (tab.getAttribute('href') || '').replace('#', '');
      tab.classList.toggle('active', targetId === id);
    });
  };
  const findCurrentSectionId = () => {
    const offset = getHeaderOffset();
    let currentId = sections[0].id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top - offset <= 0) currentId = section.id;
      else break;
    }
    return currentId;
  };

  let ticking = false, clickLockUntil = 0;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (Date.now() < clickLockUntil) { ticking = false; return; }
      setActiveTab(findCurrentSectionId());
      ticking = false;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      const href = tab.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = getHeaderOffset();
      const y = window.pageYOffset + target.getBoundingClientRect().top - offset;
      clickLockUntil = Date.now() + 700;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveTab(target.id);
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
        `}
      </Script>
    </>
  );
}
