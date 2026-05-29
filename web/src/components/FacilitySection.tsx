'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const JPG_AVAILABLE = new Set(['ga-02', 'ga-03', 'ga-07', 'ga-11']);
function facilityImg(prefix: 'ga' | 'na', num: string) {
  const key = `${prefix}-${num}`;
  if (key === 'ga-05') return `/images/sub/facility/${key}.png`;
  if (key === 'na-07') return `/images/sub/facility/${key}-new.png`;
  return `/images/sub/facility/${key}.${JPG_AVAILABLE.has(key) ? 'jpg' : 'png'}`;
}

const GA_NUMS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const NA_NUMS = Array.from({ length: 11 }, (_, i) => String(i + 1).padStart(2, '0'));

/**
 * 시설현황 — facility 페이지의 본문 섹션만 클라이언트 컴포넌트로 추출.
 * 가공/나무 탭 상태 useState 보유.
 */
export default function FacilitySection() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<'ga' | 'na'>('ga');

  return (
    <section className="facility_status_section">
      <div className="facility_status_inner">
        <div className="facility_status_head">
          {/* 시설현황 / ㈜이음푸드시스템 시설현황 텍스트 제거 (사용자 요청) */}
          <div
            className="facility_toggle"
            role="tablist"
            aria-label={t('facility_tablist_label')}
          >
            <button
              type="button"
              role="tab"
              className={`fac_tab_item${activeTab === 'ga' ? ' active' : ''}`}
              aria-selected={activeTab === 'ga'}
              onClick={() => setActiveTab('ga')}
            >
              {t('facility_tab_ga')}
            </button>
            <button
              type="button"
              role="tab"
              className={`fac_tab_item${activeTab === 'na' ? ' active' : ''}`}
              aria-selected={activeTab === 'na'}
              onClick={() => setActiveTab('na')}
            >
              {t('facility_tab_na')}
            </button>
          </div>
        </div>

        <FacilityGrid
          prefix="ga"
          numbers={GA_NUMS}
          hidden={activeTab !== 'ga'}
          t={t}
          nameKey={(n) => `facility_ga_item_${n}_name`}
          descKey={(n) => `facility_ga_item_${n}_desc`}
        />
        <FacilityGrid
          prefix="na"
          numbers={NA_NUMS}
          hidden={activeTab !== 'na'}
          t={t}
          nameKey={(n) => `facility_item_${n}_name`}
          descKey={(n) => `facility_item_${n}_desc`}
        />
      </div>
    </section>
  );
}

function FacilityGrid({
  prefix,
  numbers,
  hidden,
  t,
  nameKey,
  descKey,
}: {
  prefix: 'ga' | 'na';
  numbers: string[];
  hidden: boolean;
  t: (k: string) => string;
  nameKey: (n: string) => string;
  descKey: (n: string) => string;
}) {
  return (
    <div
      className={`facility_grid${hidden ? ' facility_grid--hidden' : ''}`}
      role="tabpanel"
      hidden={hidden}
    >
      {numbers.map((num) => (
        <article className="facility_card" key={num}>
          <div className="facility_img">
            <img
              src={facilityImg(prefix, num)}
              alt={t(nameKey(num))}
              loading="lazy"
              width={508}
              height={414}
            />
          </div>
          <div className="facility_info">
            <div className="facility_name_row">
              <span className="facility_name_label">{t('facility_name_label')}</span>
              <span className="divider"></span>
              <span className="facility_name">{t(nameKey(num))}</span>
            </div>
            <p
              className="facility_desc"
              dangerouslySetInnerHTML={{ __html: t(descKey(num)) }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
