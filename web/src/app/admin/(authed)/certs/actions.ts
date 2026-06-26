'use server';

import { getSupabaseServiceRole } from '@/lib/supabase';
import { CERT_BUCKET, CERT_FILES } from '@/lib/certs';
import { revalidatePath } from 'next/cache';

/** 인증서 이미지 교체 — 스토리지 같은 파일명에 덮어쓰기(service key). 공개 페이지 즉시 반영. */
export async function replaceCertImage(formData: FormData) {
  const name = String(formData.get('file_name') ?? '');
  const file = formData.get('file');

  if (!CERT_FILES.has(name)) throw new Error('잘못된 인증서 항목입니다.');
  if (!(file instanceof File) || file.size === 0) throw new Error('파일을 선택해주세요.');
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일(PNG/JPG)만 가능합니다. PDF는 이미지로 저장 후 올려주세요.');
  }
  if (file.size > 10 * 1024 * 1024) throw new Error('10MB 이하 이미지만 가능합니다.');

  const buf = Buffer.from(await file.arrayBuffer());
  const supabase = getSupabaseServiceRole();
  const { error } = await supabase.storage.from(CERT_BUCKET).upload(name, buf, {
    contentType: file.type,
    upsert: true,
    cacheControl: '3600',
  });
  if (error) throw new Error('업로드 실패: ' + error.message);

  revalidatePath('/admin/certs');
  revalidatePath('/business');
}
