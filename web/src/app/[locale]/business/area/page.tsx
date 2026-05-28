import { getTranslations, setRequestLocale } from 'next-intl/server';
import { aboutTabs } from '@/lib/sub-tabs';
import { nl2br } from '@/lib/nl2br';
import '@/styles/sub.css';
import '@/styles/business_area.css';

const STATS = [1, 2, 3, 4] as const;
const AREAS = [1, 2, 3, 4] as const;

export default async function BusinessAreaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>

      <main id="sub_contents" className="business_area_page">
        <section className="biz_overview_section">
          <div className="sub_inner biz_ov_inner">
            <div className="ov_left">
              <span className="ov_cate">{t('biz_ov_cate')}</span>
              <h3 className="ov_title">
                <span className="ov_line ov_line--bold">{t('biz_ov_line1')}</span>
                <span className="ov_line ov_line--light">{t('biz_ov_line2')}</span>
                <span className="ov_line ov_line--light">{t('biz_ov_line3')}</span>
              </h3>
            </div>

            <div className="ov_right">
              <div className="stat_grid">
                {STATS.map((n) => (
                  <div key={n} className="stat_item">
                    <div className="stat_label">
                      <img src={`/images/sub/bus-icon${n}.png`} alt="icon" />
                      <span>{t(`biz_stat_label${n}`)}</span>
                    </div>
                    <div className="stat_value">
                      <strong>{t(`biz_stat_value${n}`)}</strong>
                      <span>{t(`biz_stat_unit${n}`)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="biz_area_detail_section">
          <div className="sub_inner biz_area_container">
            <div className="biz_area_header">
              <span className="area_cate">{t('biz_area_cate')}</span>
              <h2 className="area_title">{t('biz_area_title')}</h2>
            </div>

            <div className="biz_area_list">
              {AREAS.map((n) => (
                <div key={n} className={`area_item${n % 2 === 0 ? ' reverse' : ''}`}>
                  <div
                    className="area_img"
                    style={{ backgroundImage: `url('/images/sub/bus-img${n}.png')` }}
                  ></div>
                  <div className="area_text_wrap">
                    <div className="area_text_head">
                      <div className="area_label_row">
                        <span className="num">{t(`biz_item_num${n}`)}</span>
                        <span className="sub_ttl">{t(`biz_item_sub${n}`)}</span>
                      </div>
                      <h3 className="main_ttl">{t(`biz_item_ttl${n}`)}</h3>
                    </div>
                    <p className="desc">{nl2br(t(`biz_item_desc${n}`))}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
