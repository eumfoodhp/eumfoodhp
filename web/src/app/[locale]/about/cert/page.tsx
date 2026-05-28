import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { businessTabs } from '@/lib/sub-tabs';
import '@/styles/sub.css';
import '@/styles/about_cert.css';

const CERTS = [
  { key: 'cert_name_1', img: '/images/sub/cert/cert-01-pickles.png' },
  { key: 'cert_name_2', img: '/images/sub/cert/cert-02-braise.png' },
  { key: 'cert_name_3', img: '/images/sub/cert/cert-03-salted.png' },
  { key: 'cert_name_4', img: '/images/sub/cert/cert-04-jeotgal.png' },
  { key: 'cert_name_5', img: '/images/sub/cert/cert-05-sauce.png' },
  { key: 'cert_name_6', img: '/images/sub/cert/cert-06-mix.png' },
  { key: 'cert_name_7', img: '/images/sub/cert/cert-07-tea.png' },
  { key: 'cert_name_8', img: '/images/sub/cert/cert-08-tax.png' },
  { key: 'cert_name_9', img: '/images/sub/cert/cert-09-master.png' },
];

export default async function CertPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>

      <main id="sub_contents" className="cert_page">
        <SubVisual
          parentLabel={t('menu_business')}
          currentLabel={t('sub_tab_cert')}
          title={t('cert_title')}
          desc={t('sub_banner_cert_desc')}
          tabBar={<SubTabBar tabs={businessTabs(t)} activeKey="cert" />}
        />

        <section className="cert_content_section">
          <div className="sub_inner">
            <div className="cert_container">
              <div className="cert_top">
                <div className="top_left">
                  <span className="category_label">{t('cert_cate_label')}</span>
                  <h3 className="cert_main_title">
                    <span className="cert_main_title_l1">{t('cert_main_tit_1')}</span>
                    <br />
                    <span className="cert_main_title_l2">{t('cert_main_tit_2')}</span>
                  </h3>
                  <div className="haccp_icon_wrap">
                    <img
                      src="/images/sub/cert/cert-haccp-mark.png"
                      alt="HACCP MAFRA 인증 마크"
                      className="haccp_icon"
                      width="107"
                      height="107"
                    />
                  </div>
                </div>

                <div className="top_right">
                  <div className="cert_top_group">
                    <h4 className="sub_bold_title">{t('cert_sub_tit')}</h4>
                    <p className="cert_desc">{t('cert_desc')}</p>
                  </div>

                  <div className="haccp_benefit">
                    <h5 className="benefit_title">{t('cert_benefit_tit')}</h5>
                    <ul>
                      <li>{t('cert_benefit_1')}</li>
                      <li>{t('cert_benefit_2')}</li>
                      <li>{t('cert_benefit_3')}</li>
                      <li>{t('cert_benefit_4')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="cert_bottom">
                <div className="cert_grid">
                  {CERTS.map((item) => (
                    <div key={item.key} className="cert_card">
                      <div className="cert_img_box">
                        <div className="cert_img_inner">
                          <img src={item.img} alt={t(item.key)} />
                        </div>
                      </div>
                      <div className="cert_info">
                        <p className="cert_name">{t(item.key)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
