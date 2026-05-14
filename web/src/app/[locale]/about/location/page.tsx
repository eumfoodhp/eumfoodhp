import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { aboutTabs } from '@/lib/sub-tabs';

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const mapHl = locale === 'zh' ? 'zh-CN' : locale;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    t('loc_factory_addr')
  )}&hl=${encodeURIComponent(mapHl)}&z=16&output=embed`;

  return (
    <>
      <link rel="stylesheet" href="/css/sub.css" />
      <link rel="stylesheet" href="/css/about_location.css" />

      <main id="sub_contents" className="location_page">
        <SubVisual
          parentLabel={t('menu_about')}
          currentLabel={t('loc_title')}
          title={t('loc_title')}
          desc={t('loc_sub_banner_desc')}
          tabBar={<SubTabBar tabs={aboutTabs(t)} activeKey="location" />}
        />

        <section className="location_content_section">
          <div className="sub_inner location_inner">
            <div className="location_row">
              <div className="map_area" id="map_yongin">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('loc_map_factory_alt')}
                />
              </div>
              <div className="info_area">
                <div className="loc_heading">
                  <span className="loc_cate">{t('loc_way_to_come')}</span>
                  <h3 className="loc_name">{t('loc_factory_title')}</h3>
                </div>

                <ul className="loc_detail_list">
                  <li className="loc_detail_row">
                    <span className="label">{t('loc_factory_addr_label')}</span>
                    <span className="loc_pipe" aria-hidden="true"></span>
                    <p className="content">{t('loc_factory_addr')}</p>
                  </li>
                  <li className="loc_detail_row loc_detail_row--tel">
                    <span className="label">{t('loc_factory_tel_label')}</span>
                    <span className="loc_pipe" aria-hidden="true"></span>
                    <div className="loc_tel_wrap">
                      <span className="loc_tel_item">{t('loc_tel_quality')}</span>
                      <span className="loc_tel_item">{t('loc_tel_sales')}</span>
                      <span className="loc_tel_item">{t('loc_tel_purchase')}</span>
                      <span className="loc_tel_item">{t('loc_tel_rd')}</span>
                      <span className="loc_tel_item">{t('loc_tel_mgmt')}</span>
                    </div>
                  </li>
                  <li className="loc_detail_row">
                    <span className="label">{t('loc_factory_fax_label')}</span>
                    <span className="loc_pipe" aria-hidden="true"></span>
                    <p className="content">{t('loc_factory_fax')}</p>
                  </li>
                </ul>

                <div className="qr_section">
                  <div className="qr_label_row">
                    <span className="qr_label">{t('loc_qr_label')}</span>
                    <span className="loc_pipe" aria-hidden="true"></span>
                  </div>
                  <div className="qr_group">
                    <div className="qr_item qr_item--mapimg">
                      <img
                        className="qr_img"
                        src="/images/sub/kakao1.jpg"
                        alt={t('loc_qr_kakao')}
                        loading="lazy"
                        decoding="async"
                      />
                      <span>{t('loc_qr_kakao')}</span>
                    </div>
                    <div className="qr_item qr_item--mapimg">
                      <img
                        className="qr_img"
                        src="/images/sub/naver1.jpg"
                        alt={t('loc_qr_naver')}
                        loading="lazy"
                        decoding="async"
                      />
                      <span>{t('loc_qr_naver')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
