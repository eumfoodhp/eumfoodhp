'use client';

import { useEffect, useState, useCallback } from 'react';

type CertItem = {
  key: string;
  img: string;
  label: string;
};

type Props = {
  items: CertItem[];
};

/**
 * 인증서 그리드 — 카드 클릭 시 라이트박스로 원본 이미지 확대 표시.
 * - ESC / 배경 클릭 / 닫기 버튼으로 닫힘
 * - 좌우 화살표 키 / 버튼으로 이전·다음 인증서 탐색
 * - 열린 동안 body 스크롤 잠금
 */
export default function CertGrid({ items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? 0 : (i + 1) % items.length)),
    [items.length]
  );
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? 0 : (i - 1 + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    // body 스크롤 잠금
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = original;
    };
  }, [openIdx, close, next, prev]);

  const current = openIdx !== null ? items[openIdx] : null;

  return (
    <>
      <div className="cert_grid">
        {items.map((item, idx) => (
          <button
            key={item.key}
            type="button"
            className="cert_card"
            onClick={() => setOpenIdx(idx)}
            aria-label={`${item.label} 확대 보기`}
          >
            <div className="cert_img_box">
              <div className="cert_img_inner">
                <img src={item.img} alt={item.label} />
              </div>
              <span className="cert_zoom_hint" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </span>
            </div>
            <div className="cert_info">
              <p className="cert_name">{item.label}</p>
            </div>
          </button>
        ))}
      </div>

      {current && (
        <div
          className="cert_lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.label}
          onClick={close}
        >
          <button
            type="button"
            className="cert_lb_nav cert_lb_nav--prev"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="이전 인증서"
          >
            ‹
          </button>

          <figure className="cert_lb_figure" onClick={(e) => e.stopPropagation()}>
            <img src={current.img} alt={current.label} />
            <figcaption className="cert_lb_caption">{current.label}</figcaption>
          </figure>

          <button
            type="button"
            className="cert_lb_nav cert_lb_nav--next"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="다음 인증서"
          >
            ›
          </button>

          <button
            type="button"
            className="cert_lb_close"
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
