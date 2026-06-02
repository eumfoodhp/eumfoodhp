'use client';

import { useTranslations } from 'next-intl';
import enMessages from '@/i18n/messages/en.json';

const EN = enMessages as unknown as Record<string, string>;

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
 * 시설현황 — 가동/나동 두 그리드를 위→아래 죽 나열 (사용자 요청).
 * 이전엔 탭 토글이었지만 현재는 한 페이지에 모두 노출.
 */
export default function FacilitySection() {
  const t = useTranslations();

  return (
    <section className="facility_status_section">
      <div className="facility_status_inner">
        <div className="facility_block">
          <h3 className="facility_block_title">
            <span>{t('facility_tab_ga')}</span>
            <span className="facility_block_title_en">Plant A</span>
          </h3>
          <FacilityGrid
            prefix="ga"
            numbers={GA_NUMS}
            t={t}
            nameKey={(n) => `facility_ga_item_${n}_name`}
            descKey={(n) => `facility_ga_item_${n}_desc`}
          />
        </div>

        <div className="facility_block">
          <h3 className="facility_block_title">
            <span>{t('facility_tab_na')}</span>
            <span className="facility_block_title_en">Plant B</span>
          </h3>
          <FacilityGrid
            prefix="na"
            numbers={NA_NUMS}
            t={t}
            nameKey={(n) => `facility_item_${n}_name`}
            descKey={(n) => `facility_item_${n}_desc`}
          />
        </div>
      </div>
    </section>
  );
}

function FacilityGrid({
  prefix,
  numbers,
  t,
  nameKey,
  descKey,
}: {
  prefix: 'ga' | 'na';
  numbers: string[];
  t: (k: string) => string;
  nameKey: (n: string) => string;
  descKey: (n: string) => string;
}) {
  return (
    <div className="facility_grid">
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
              <span className="facility_name">{t(nameKey(num))}</span>
              <span className="facility_name_en">{EN[nameKey(num)] ?? ''}</span>
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
