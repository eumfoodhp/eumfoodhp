import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { supportTabs } from '@/lib/sub-tabs';
import { submitSales } from './actions';
import '@/styles/sub.css';
import '@/styles/public-forms.css';

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
      <SubVisual
        parentLabel={t('menu_support')}
        currentLabel={t('sub_inquiry_sales')}
        title={t('sub_inquiry_sales')}
        desc=""
        tabBar={<SubTabBar tabs={supportTabs(t)} activeKey="sales" />}
      />

      <div className="sub_inner">
        {sp.submitted === '1' ? (
          <div className="public_notice success" role="status" style={{ marginBottom: 0 }}>
            <strong>문의가 정상적으로 접수되었습니다.</strong>
            <br />
            담당자가 확인 후 입력하신 이메일로 회신드리겠습니다. 감사합니다.
          </div>
        ) : (
          <form action={submitSales} className="public_form">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              aria-hidden="true"
            />

            <h3 className="pf_section_title">기업 정보</h3>
            <div className="pf_row">
              <div className="pf_field">
                <label htmlFor="company">회사명 *</label>
                <input id="company" name="company" type="text" required />
              </div>
              <div className="pf_field">
                <label htmlFor="country">국가</label>
                <input id="country" name="country" type="text" placeholder="대한민국" />
              </div>
            </div>

            <h3 className="pf_section_title">담당자 정보</h3>
            <div className="pf_row">
              <div className="pf_field">
                <label htmlFor="writer_name">이름 *</label>
                <input id="writer_name" name="writer_name" type="text" required maxLength={50} />
              </div>
              <div className="pf_field">
                <label htmlFor="position">직책</label>
                <input id="position" name="position" type="text" />
              </div>
            </div>

            <div className="pf_row">
              <div className="pf_field">
                <label htmlFor="email">이메일 *</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="pf_field">
                <label htmlFor="phone">연락처</label>
                <input id="phone" name="phone" type="tel" placeholder="010-0000-0000" />
              </div>
            </div>

            <h3 className="pf_section_title">문의 분류</h3>
            <div className="pf_field">
              <label htmlFor="category">분류 *</label>
              <select id="category" name="category" required defaultValue="">
                <option value="" disabled>분류를 선택해주세요</option>
                <option value="product">제품 / 브랜드 문의</option>
                <option value="partnership">제휴 / 사업 협력</option>
                <option value="sponsor">협찬 / 후원</option>
                <option value="general">기타 기업 문의</option>
              </select>
            </div>

            <div className="pf_field">
              <label htmlFor="content">문의 내용 *</label>
              <textarea id="content" name="content" required rows={10} maxLength={5000} />
            </div>

            <div className="pf_privacy">
              <p style={{ margin: '0 0 8px', fontWeight: 600 }}>개인정보 수집·이용 안내</p>
              <p style={{ margin: 0, color: '#6B7280', fontSize: 13, lineHeight: 1.6 }}>
                회신을 위해 이름·이메일·연락처를 수집하며, 문의 처리 완료 후 1년간 보관합니다.
                수집된 정보는 문의 응대 외 용도로 사용되지 않습니다.
              </p>
              <label className="pf_checkbox" style={{ marginTop: 12 }}>
                <input type="checkbox" name="privacy_agreed" required /> 위 내용에 동의합니다. *
              </label>
            </div>

            <div className="pf_actions">
              <button type="submit" className="pf_submit">영업문의 등록</button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
