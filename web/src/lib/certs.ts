/**
 * 인증서 정의 + 스토리지 이미지 URL 헬퍼.
 * - 인증서 이미지는 Supabase Storage('certs' 버킷, public)에 저장 → 어드민에서 교체 가능.
 * - getCertImageMap(): 파일명 → 공개 URL(?v=updated_at). 교체 시 버전이 바뀌어 캐시 자동 무효화.
 */
import { getSupabaseServiceRole } from './supabase';

export const CERT_BUCKET = 'certs';

export type CertDef = { file: string; label: string; group: 'haccp' | 'other' | 'mark' };

/** 인증서 목록 (순서·라벨 고정, 이미지만 교체). business 페이지 + 어드민 공통. */
export const CERTS: CertDef[] = [
  { file: 'cert-01-pickles.png', label: '절임식품 HACCP 인증서', group: 'haccp' },
  { file: 'cert-02-braise.png', label: '조림류 HACCP 인증서', group: 'haccp' },
  { file: 'cert-03-salted.png', label: '양념젓갈 HACCP 인증서', group: 'haccp' },
  { file: 'cert-04-jeotgal.png', label: '젓갈 HACCP 인증서', group: 'haccp' },
  { file: 'cert-05-sauce.png', label: '소스 HACCP 인증서', group: 'haccp' },
  { file: 'cert-06-mix.png', label: '혼합장 HACCP 인증서', group: 'haccp' },
  { file: 'cert-07-tea.png', label: '액상차 HACCP 인증서', group: 'haccp' },
  { file: 'cert-09-master.png', label: '전통식품마스터', group: 'other' },
  { file: 'cert-08-tax.png', label: '성실납세자 인증서', group: 'other' },
  { file: 'cert-haccp-mark.png', label: 'HACCP 인증 마크 (상단)', group: 'mark' },
];

export const CERT_FILES = new Set(CERTS.map((c) => c.file));

/** 정적 폴백 경로 (스토리지 장애 시 기존 public 이미지). */
export const certStaticPath = (file: string) => `/images/sub/cert/${file}`;

/** 파일명 → 스토리지 공개 URL(버전 포함). 서버 전용. 실패 시 빈 객체. */
export async function getCertImageMap(): Promise<Record<string, string>> {
  try {
    const supabase = getSupabaseServiceRole();
    const { data } = await supabase.storage.from(CERT_BUCKET).list('', { limit: 100 });
    const map: Record<string, string> = {};
    for (const obj of data ?? []) {
      const { data: pub } = supabase.storage.from(CERT_BUCKET).getPublicUrl(obj.name);
      const v = obj.updated_at ? new Date(obj.updated_at).getTime() : 0;
      map[obj.name] = `${pub.publicUrl}?v=${v}`;
    }
    return map;
  } catch {
    return {};
  }
}
