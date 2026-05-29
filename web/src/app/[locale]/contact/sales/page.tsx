import { setRequestLocale } from 'next-intl/server';
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

  return (
    <main id="sub_contents" className="contact_sales_page">
      <div className="sub_inner sales_inner">
        {sp.submitted === '1' ? (
          <div className="public_notice success" role="status">
            <strong>문의가 정상적으로 접수되었습니다.</strong>
            <br />
            담당자가 확인 후 입력하신 이메일로 회신드리겠습니다. 감사합니다.
          </div>
        ) : (
          <>
            {/* 페이지 헤딩 */}
            <header className="sales_head">
              <p className="sales_eyebrow">Contact us</p>
              <h2 className="sales_title">영업문의</h2>
              <div className="sales_contact_info">
                <div className="sales_contact_row">
                  <span className="sales_contact_label">대표전화</span>
                  <p>품질: 031-334-6810 &nbsp; 영업: 070-4334-5206 &nbsp; 관리: 070-4334-5205</p>
                  <p>구매: 070-4334-5207 &nbsp; 연구개발: 070-7733-5887</p>
                </div>
                <div className="sales_contact_row">
                  <span className="sales_contact_label">주소</span>
                  <p>주소 경기도 용인시 처인구 이동읍 화산로 191</p>
                </div>
              </div>
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
                  <h3 className="sales_step_title">정보를 입력해주시면 빠른 시일내에 해결해드립니다</h3>
                </div>
                <div className="pf_row">
                  <div className="pf_field">
                    <label htmlFor="company">회사 *</label>
                    <input id="company" name="company" type="text" required placeholder="회사명을 입력해주세요" />
                  </div>
                  <div className="pf_field">
                    <label htmlFor="position">직무 *</label>
                    <input id="position" name="position" type="text" required placeholder="직무를 입력해주세요" />
                  </div>
                </div>
                <div className="pf_row">
                  <div className="pf_field">
                    <label htmlFor="writer_name">이름 *</label>
                    <input id="writer_name" name="writer_name" type="text" required maxLength={50} placeholder="이름을 입력해주세요" />
                  </div>
                  <div className="pf_field">
                    <label htmlFor="email">이메일 *</label>
                    <input id="email" name="email" type="email" required placeholder="이메일을 입력해주세요" />
                  </div>
                </div>
                <div className="pf_row">
                  <div className="pf_field">
                    <label htmlFor="phone">연락처 *</label>
                    <input id="phone" name="phone" type="tel" required placeholder="연락처를 입력해주세요" />
                  </div>
                  <div className="pf_field">
                    <label htmlFor="country">국가 *</label>
                    <input id="country" name="country" type="text" required placeholder="국가를 입력해주세요" />
                  </div>
                </div>
              </section>

              {/* ===== STEP 02 ===== */}
              <section className="sales_step">
                <div className="sales_step_head">
                  <span className="sales_step_no">STEP 02</span>
                  <h3 className="sales_step_title">정보를 입력해주시면 빠른 시일내에 해결해드립니다</h3>
                </div>

                <div className="pf_field">
                  <label className="pf_label_with_required">고민 컬렉 분야 *</label>
                  <div className="sales_radio_row">
                    <label className="sales_radio">
                      <input type="radio" name="category" value="product" required defaultChecked />
                      <span>제품/브랜드 관련 분의</span>
                    </label>
                    <label className="sales_radio">
                      <input type="radio" name="category" value="partnership" />
                      <span>제품/영업 분의</span>
                    </label>
                    <label className="sales_radio">
                      <input type="radio" name="category" value="general" />
                      <span>제품 일반분의</span>
                    </label>
                    <label className="sales_radio">
                      <input type="radio" name="category" value="sponsor" />
                      <span>기업 일반 분의</span>
                    </label>
                  </div>
                </div>

                <div className="pf_field">
                  <label htmlFor="content">문의하고 싶은 내용에 대해 자세히 적어주세요. *</label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={8}
                    maxLength={5000}
                    placeholder="문의내용을 입력해주세요"
                  />
                </div>

                <div className="pf_field">
                  <label htmlFor="attachment">첨부파일 *</label>
                  <div className="sales_file_row">
                    <input
                      id="attachment_label"
                      name="attachment_label"
                      type="text"
                      readOnly
                      placeholder="파일명을 입력해주세요"
                      className="sales_file_display"
                    />
                    <label htmlFor="attachment" className="sales_file_btn">파일선택</label>
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
                  <h3 className="sales_step_title">약관동의에 마무리하여 빠르게 문의를 해주세요</h3>
                </div>

                <details className="sales_terms" open>
                  <summary className="sales_terms_summary">
                    <span className="sales_terms_check_icon" aria-hidden="true">✓</span>
                    <span className="sales_terms_title">개인정보 수집 및 이용 동의</span>
                    <span className="sales_terms_required">[필수]</span>
                    <span className="sales_terms_arrow" aria-hidden="true">⌃</span>
                  </summary>
                  <div className="sales_terms_body">
                    <p>
                      ㈜이음푸드시스템은 개인정보 보호법 및 정보통신망 이용 촉진 및 정보 보호 등에 관한 법률(이하 &lsquo;정보통신망법&rsquo;), &lsquo;개인정보 보호법&rsquo;, 채용 등 등 관련 법에 따라 귀하로부터 개인정보를 아래와 같이 수집 및 처리합니다.
                    </p>
                    <p>
                      <strong>1. 개인정보 수집·이용에 대한 동의</strong>
                      <br />
                      ㈜이음푸드시스템 채용에 연관되는 개인정보 수집현황·수집 항목을 투명하고 안전하게 보호·관리하며, 이에 개인정보 수집·이용에 대한 동의를 구합니다.
                    </p>
                  </div>
                </details>

                <label className="pf_checkbox sales_terms_agree">
                  <input type="checkbox" name="privacy_agreed" required />
                  <span>위 내용에 동의합니다. *</span>
                </label>
              </section>

              <div className="pf_actions sales_actions">
                <button type="submit" className="pf_submit sales_submit">제출하기</button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
