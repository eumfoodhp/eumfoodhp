'use server';

import { createServerSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * 입력 URL → 표시용 이미지 주소 해석 (사용자 요청 B방식).
 * - 직접 이미지 주소(.jpg/.png 등 또는 content-type image/*)면 그대로 사용
 * - 기사 페이지 주소면 그 페이지의 og:image / twitter:image 를 추출
 * - 실패하면 null (공개 페이지에서 placeholder 표시)
 * 저장(create/update) 시 호출 → 기사 주소만 넣어도 대표이미지가 뜸.
 */
async function resolveOgImage(rawUrl: string): Promise<string | null> {
  let url = (rawUrl ?? '').trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  // 확장자로 이미 직접 이미지 주소인 경우 바로 사용
  if (/\.(jpe?g|png|webp|gif|avif|svg)(\?|#|$)/i.test(url)) return url;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 7000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; eumfoodbot/1.0)' },
    });
    clearTimeout(timer);
    const ct = res.headers.get('content-type') || '';
    if (ct.startsWith('image/')) return res.url || url; // 응답 자체가 이미지
    if (!ct.includes('html')) return null;
    const html = await res.text();
    const pick = (re: RegExp) => html.match(re)?.[1]?.trim() || null;
    let img =
      pick(/<meta[^>]+(?:property|name)=["']og:image(?::secure_url|:url)?["'][^>]+content=["']([^"']+)["']/i) ||
      pick(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i) ||
      pick(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    if (!img) return null;
    if (img.startsWith('//')) img = 'https:' + img;
    else if (img.startsWith('/')) img = new URL(res.url || url).origin + img;
    return img;
  } catch {
    return null;
  }
}

export async function createPress(formData: FormData) {
  const supabase = await createServerSupabase();
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const source = String(formData.get('source') ?? '').trim() || null;
  const link_url = String(formData.get('link_url') ?? '').trim() || null;
  const thumbRaw = String(formData.get('thumbnail') ?? '').trim();
  const is_pinned = formData.get('is_pinned') === 'on';

  if (!title || !content) throw new Error('제목과 내용을 입력해주세요.');

  // 썸네일: 입력값(이미지/기사 주소) 또는 원본 기사 URL → 대표이미지 자동 해석 (사용자 요청 B)
  const thumbnail = (await resolveOgImage(thumbRaw || link_url || '')) || null;

  // 보도자료 고정은 1개만 — 새 글을 고정하면 기존 고정 전부 해제
  if (is_pinned) {
    await supabase.from('press_releases').update({ is_pinned: false }).eq('is_pinned', true);
  }

  const { error } = await supabase
    .from('press_releases')
    .insert({ title, content, source, link_url, thumbnail, is_pinned });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/press');
  revalidatePath('/press');
  redirect('/admin/press');
}

export async function updatePress(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const source = String(formData.get('source') ?? '').trim() || null;
  const link_url = String(formData.get('link_url') ?? '').trim() || null;
  const thumbRaw = String(formData.get('thumbnail') ?? '').trim();
  const is_pinned = formData.get('is_pinned') === 'on';

  if (!id || !title || !content) throw new Error('필수 항목 누락.');

  // 썸네일: 입력값(이미지/기사 주소) 또는 원본 기사 URL → 대표이미지 자동 해석 (사용자 요청 B)
  const thumbnail = (await resolveOgImage(thumbRaw || link_url || '')) || null;

  // 보도자료 고정은 1개만 — 이 글을 고정하면 다른 글의 고정 해제
  if (is_pinned) {
    await supabase.from('press_releases').update({ is_pinned: false }).eq('is_pinned', true).neq('id', id);
  }

  const { error } = await supabase
    .from('press_releases')
    .update({ title, content, source, link_url, thumbnail, is_pinned })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/press');
  revalidatePath('/press');
  redirect('/admin/press');
}

export async function deletePress(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('id 누락.');

  const { error } = await supabase.from('press_releases').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/press');
  revalidatePath('/press');
}

/**
 * 목록에서 체크박스로 고정 토글.
 * 보도자료 고정은 1개만 — 켜면 다른 글 전부 해제하고 이 글만 고정.
 */
export async function togglePressPin(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  const pinned = formData.get('pinned') === '1';
  if (!id) throw new Error('id 누락.');

  if (pinned) {
    await supabase.from('press_releases').update({ is_pinned: false }).neq('id', id);
    const { error } = await supabase.from('press_releases').update({ is_pinned: true }).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('press_releases').update({ is_pinned: false }).eq('id', id);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/press');
}
