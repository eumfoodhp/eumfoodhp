'use client';

import { useTranslations } from 'next-intl';

// 자사몰/고객문의/카탈로그는 헤더 우측 아이콘으로 옮김 (중복 제거).
// QuickMenu는 맨위로 버튼만 남김.
export default function QuickMenu() {
  const t = useTranslations();

  return (
    <div className="quick_menu">
      <button
        type="button"
        className="quick_item btn_top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <img src="/images/common/top.png" alt={t('quick_top')} />
      </button>
    </div>
  );
}
