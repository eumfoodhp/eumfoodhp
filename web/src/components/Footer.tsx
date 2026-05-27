import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations();

  return (
    <footer id="footer">
      <div className="footer_inner">
        <div className="footer_top">
          <div className="f_logo">
            <img src="/images/common/ftlogo.png" alt="㈜이음푸드시스템" />
          </div>
          <div className="f_util">
            <div className="cert_mark">
              <img src="/images/common/haccp.png" alt="HACCP" />
            </div>
            {/* 관리자페이지 링크 제거 — Next.js에 admin 라우트 없음 (원본 PHP 사이트 잔재).
                필요시 별도 admin URL(예: 티제이웹 호스팅 관리자)로 연결해야 함. */}
          </div>
        </div>

        <div className="footer_bottom">
          <div className="f_info_group">
            <div className="f_box info_box">
              <h3>INFO</h3>
              <div className="f_row">
                <span>{t('ft_ceo')}</span>
                <i className="v_line"></i>
                <span>{t('ft_biz_no')}</span>
              </div>
              <div className="f_row">
                <span>{t('ft_corp_no')}</span>
              </div>
            </div>

            <div className="f_box tel_box">
              <h3>TEL</h3>
              <div className="tel_grid">
                <span>{t('ft_tel_quality')}</span>
                <i className="v_line tel_sep" aria-hidden="true"></i>
                <span>{t('ft_tel_sales')}</span>
                <span>{t('ft_tel_purchase')}</span>
                <i className="v_line tel_sep" aria-hidden="true"></i>
                <span>{t('ft_tel_dev')}</span>
              </div>
            </div>

            <div className="f_box address_box">
              <h3>ADDRESS</h3>
              <div className="f_row">
                <span>{t('ft_address')}</span>
              </div>
            </div>
          </div>

          <p className="copyright">{t('ft_copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
