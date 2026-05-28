import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations();

  return (
    <footer id="footer">
      {/* 한반도 이미지 + 펄스 마커 (이미지 좌표 기준 절대 위치). */}
      <div className="footer_bg" aria-hidden="true">
        <img
          src="/images/main/map_ko_factory.png"
          alt=""
          className="footer_bg_img"
          loading="lazy"
        />
        <span className="pulse_dot"></span>
      </div>

      <div className="footer_inner">
        <div className="footer_top">
          <div className="f_logo">
            {/* 컬러 로고 (헤더와 동일) — 단색 ftlogo.png 대체 */}
            <img src="/images/common/logo.png" alt="㈜이음푸드시스템" />
          </div>
        </div>

        <div className="footer_bottom">
          <div className="f_info_group">
            <div className="f_box info_box">
              <h3>INFO</h3>
              <div className="f_row">
                <span>{t('ft_ceo')}</span>
              </div>
              <div className="f_row">
                <span>{t('ft_biz_no')}</span>
              </div>
              <div className="f_row">
                <span>{t('ft_corp_no')}</span>
              </div>
              {/* HACCP 인증 마크 — 법인사업자등록번호 아래로 이동 */}
              <div className="f_row cert_row">
                <img
                  src="/images/common/haccp.png"
                  alt="HACCP 인증"
                  className="cert_mark_img"
                />
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
                <span>{t('ft_tel_acc')}</span>
              </div>
              <div className="f_row" style={{ marginTop: 8 }}>
                <span>{t('ft_fax')}</span>
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
