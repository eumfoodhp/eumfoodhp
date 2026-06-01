import { getTranslations, setRequestLocale } from 'next-intl/server';
import { submitSales } from './actions';
import '@/styles/sub.css';
import '@/styles/public-forms.css';
import '@/styles/inquiry-sales-forms.css';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ submitted?: string }>;
}) {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main id="sub_contents" className="contact_sales_page">
      <div className="sub_inner sales_inner">
        {sp.submitted === '1' ? (
          <div className="public_notice success" role="status">
            <strong>{t('sales_submitted_title')}</strong>
            <br />
            {t('sales_submitted_desc')}
          </div>
        ) : (
          <>
            {/* 페이지 헤딩 */}
            <header className="sales_head">
              <p className="sales_eyebrow">{t('sales_label')}</p>
              <h2 className="sales_title">{t('sales_page_title')}</h2>
              {/* 대표전화 / 주소 정보 제거 (사용자 요청) */}
            </header>

            <form action={submitSales} className="public_form sales_form" encType="multipart/form-data">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                aria-hidden="true"
              />

              {/* ===== STEP 01 ===== */}
              <section className="sales_step">
                <div className="sales_step_head">
                  <span className="sales_step_no">STEP 01</span>
                  <h3 className="sales_step_title">{t('sales_step1_title')}</h3>
                </div>
                <div className="pf_row">
                  <div className="pf_field">
                    <label htmlFor="company">{t('sales_form_company')} *</label>
                    <input id="company" name="company" type="text" required placeholder={t('sales_form_company_ph')} />
                  </div>
                  <div className="pf_field">
                    <label htmlFor="position">{t('sales_form_position')} *</label>
                    <input id="position" name="position" type="text" required placeholder={t('sales_form_position_ph')} />
                  </div>
                </div>
                <div className="pf_row">
                  <div className="pf_field">
                    <label htmlFor="writer_name">{t('sales_form_name')} *</label>
                    <input id="writer_name" name="writer_name" type="text" required maxLength={50} placeholder={t('sales_form_name_ph')} />
                  </div>
                  <div className="pf_field">
                    <label htmlFor="email">{t('sales_form_email')} *</label>
                    <input id="email" name="email" type="email" required placeholder={t('sales_form_email_ph')} />
                  </div>
                </div>
                <div className="pf_row">
                  <div className="pf_field">
                    <label htmlFor="phone">{t('sales_form_phone')} *</label>
                    <input id="phone" name="phone" type="tel" required placeholder={t('sales_form_phone_ph')} />
                  </div>
                  <div className="pf_field">
                    <label htmlFor="country">{t('sales_form_country')} *</label>
                    <input id="country" name="country" type="text" required placeholder={t('sales_form_country_ph')} />
                  </div>
                </div>
              </section>

              {/* ===== STEP 02 ===== */}
              <section className="sales_step">
                <div className="sales_step_head">
                  <span className="sales_step_no">STEP 02</span>
                  <h3 className="sales_step_title">{t('sales_step2_title')}</h3>
                </div>

                <div className="pf_field">
                  <label className="pf_label_with_required">{t('sales_form_category')} *</label>
                  <div className="sales_radio_row">
                    <label className="sales_radio">
                      <input type="radio" name="category" value="product" required defaultChecked />
                      <span>{t('sales_cat_product_brand')}</span>
                    </label>
                    <label className="sales_radio">
                      <input type="radio" name="category" value="partnership" />
                      <span>{t('sales_cat_partnership')}</span>
                    </label>
                    <label className="sales_radio">
                      <input type="radio" name="category" value="general" />
                      <span>{t('sales_cat_product_sponsorship')}</span>
                    </label>
                    <label className="sales_radio">
                      <input type="radio" name="category" value="sponsor" />
                      <span>{t('sales_cat_corporate_general')}</span>
                    </label>
                  </div>
                </div>

                <div className="pf_field">
                  <label htmlFor="content">{t('sales_form_content')} *</label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={8}
                    maxLength={5000}
                    placeholder={t('sales_form_content_ph')}
                  />
                </div>

                <div className="pf_field">
                  <label htmlFor="attachment">{t('sales_form_attach')} *</label>
                  <div className="sales_file_row">
                    <input
                      id="attachment_label"
                      name="attachment_label"
                      type="text"
                      readOnly
                      placeholder={t('sales_form_attach_ph')}
                      className="sales_file_display"
                    />
                    <label htmlFor="attachment" className="sales_file_btn">{t('sales_form_file_btn')}</label>
                    <input
                      id="attachment"
                      name="attachment"
                      type="file"
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </section>

              {/* ===== STEP 03 ===== */}
              <section className="sales_step">
                <div className="sales_step_head">
                  <span className="sales_step_no">STEP 03</span>
                  <h3 className="sales_step_title">{t('sales_step3_title')}</h3>
                </div>

                <details className="sales_terms" open>
                  <summary className="sales_terms_summary">
                    <span className="sales_terms_check_icon" aria-hidden="true">✓</span>
                    <span className="sales_terms_title">{t('sales_privacy_agree')}</span>
                    <span className="sales_terms_required">{t('sales_privacy_required')}</span>
                    <span className="sales_terms_arrow" aria-hidden="true">⌃</span>
                  </summary>
                  <div className="sales_terms_body">
                    <p>{t('sales_privacy_p1')}</p>
                    <p>{t('sales_privacy_p2')}</p>
                    <p>{t('sales_privacy_p3')}</p>
                  </div>
                </details>

                <label className="pf_checkbox sales_terms_agree">
                  <input type="checkbox" name="privacy_agreed" required />
                  <span>{t('sales_privacy_agree')} *</span>
                </label>
              </section>

              <div className="pf_actions sales_actions">
                <button type="submit" className="pf_submit sales_submit">{t('sales_submit')}</button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
