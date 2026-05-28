import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { newsroomTabs } from '@/lib/sub-tabs';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/sub.css';
import '@/styles/public-forms.css';

export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const supabase = await createServerSupabase();
  const { data: list } = await supabase
    .from('press_releases')
    .select('id, title, source, thumbnail, view_count, created_at')
    .order('created_at', { ascending: false })
    .limit(60);

  return (
    <main id="sub_contents" className="press_page">
      <SubVisual
        parentLabel={t('menu_news')}
        currentLabel={t('sub_news_press')}
        title={t('sub_news_press')}
        desc=""
        tabBar={<SubTabBar tabs={newsroomTabs(t)} activeKey="press" />}
      />

      <div className="sub_inner">
        <div className="public_list_head">
          <span className="public_list_count">총 {list?.length ?? 0}건</span>
        </div>

        {!list || list.length === 0 ? (
          <div className="public_empty">등록된 보도자료가 없습니다.</div>
        ) : (
          <ul className="press_grid">
            {list.map((p) => (
              <li key={p.id} className="press_card">
                <Link href={`/press/${p.id}`} className="press_card_link">
                  <div className="press_card_thumb">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt="" loading="lazy" />
                    ) : (
                      <div className="press_card_thumb_placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="16" rx="2" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                          <line x1="9" y1="14" x2="15" y2="14" />
                          <line x1="9" y1="17" x2="13" y2="17" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="press_card_body">
                    <div className="press_card_meta">
                      {p.source && <span className="press_card_source">{p.source}</span>}
                      <span className="press_card_date">
                        {new Date(p.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <h3 className="press_card_title">{p.title}</h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
