'use server';

import { createServerSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { translateKoToZh } from '@/lib/translate';

export async function createHistory(formData: FormData) {
  const supabase = await createServerSupabase();
  const year = Number(formData.get('year'));
  const monthRaw = String(formData.get('month') ?? '').trim();
  const month = monthRaw ? Number(monthRaw) : null;
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  const title_zh = String(formData.get('title_zh') ?? '').trim() || null;
  const description_zh = String(formData.get('description_zh') ?? '').trim() || null;
  const sort_order = Number(formData.get('sort_order') ?? 0) || 0;

  if (!year || !title) throw new Error('연도와 제목은 필수입니다.');
  if (month !== null && (month < 1 || month > 12)) throw new Error('월은 1~12.');

  const { error } = await supabase
    .from('history_entries')
    .insert({ year, month, title, description, title_zh, description_zh, sort_order });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/history');
  revalidatePath('/about#history');
  redirect('/admin/history');
}

// 연도 1개 + 제목 여러 줄 → 같은 연도로 여러 항목 한 번에 생성 (사용자 요청).
// 줄(행)별로 month/title/description 입력이 같은 인덱스로 정렬됨(빈 input 도 제출되므로).
// sort_order 는 입력한 줄 순서(비어있지 않은 줄 기준)대로 0,1,2… 자동 부여.
export async function createHistoryBatch(formData: FormData) {
  const supabase = await createServerSupabase();
  const year = Number(formData.get('year'));
  if (!year) throw new Error('연도는 필수입니다.');

  const titles = formData.getAll('title').map((v) => String(v).trim());
  const months = formData.getAll('month').map((v) => String(v).trim());
  const descs = formData.getAll('description').map((v) => String(v).trim());
  const titlesZh = formData.getAll('title_zh').map((v) => String(v).trim());

  const rows: {
    year: number;
    month: number | null;
    title: string;
    description: string | null;
    title_zh: string | null;
    sort_order: number;
  }[] = [];
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];
    if (!title) continue; // 제목 빈 줄은 건너뜀
    const month = months[i] ? Number(months[i]) : null;
    if (month !== null && (month < 1 || month > 12)) throw new Error('월은 1~12 사이여야 합니다.');
    rows.push({ year, month, title, description: descs[i] || null, title_zh: titlesZh[i] || null, sort_order: rows.length });
  }
  if (rows.length === 0) throw new Error('제목을 한 줄 이상 입력하세요.');

  const { error } = await supabase.from('history_entries').insert(rows);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/history');
  revalidatePath('/about#history');
  redirect('/admin/history');
}

export async function updateHistory(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  const year = Number(formData.get('year'));
  const monthRaw = String(formData.get('month') ?? '').trim();
  const month = monthRaw ? Number(monthRaw) : null;
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  const title_zh = String(formData.get('title_zh') ?? '').trim() || null;
  const description_zh = String(formData.get('description_zh') ?? '').trim() || null;
  const sort_order = Number(formData.get('sort_order') ?? 0) || 0;

  if (!id || !year || !title) throw new Error('필수 항목 누락.');

  const { error } = await supabase
    .from('history_entries')
    .update({ year, month, title, description, title_zh, description_zh, sort_order })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/history');
  revalidatePath('/about#history');
  redirect('/admin/history');
}

export async function deleteHistory(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('id 누락.');

  const { error } = await supabase.from('history_entries').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/history');
  revalidatePath('/about#history');
}

/* ============================================================
   원페이지 인라인 관리용 — 리다이렉트 없이 줄 단위로 저장/삭제
   (중국어 컬럼 title_zh/description_zh 는 건드리지 않음 → 기존 값 보존)
   ============================================================ */

// id 있으면 수정, 없으면 생성 후 새 id 반환. 줄 blur 시 호출.
export async function saveHistoryEntry(data: {
  id: number | null;
  year: number;
  month: number | null;
  title: string;
  description: string | null;
}): Promise<{ id: number }> {
  const supabase = await createServerSupabase();
  const year = Number(data.year);
  const title = (data.title ?? '').trim();
  const month = data.month != null && String(data.month) !== '' ? Number(data.month) : null;
  const description = (data.description ?? '').trim() || null;

  if (!year) throw new Error('연도는 필수입니다.');
  if (!title) throw new Error('제목은 필수입니다.');
  if (month !== null && (month < 1 || month > 12)) throw new Error('월은 1~12 사이여야 합니다.');

  if (data.id) {
    // 기존 항목 — 제목 그대로 + 이미 번역돼 있으면 재번역 생략(캐싱).
    // 번역 실패 시 title_zh 를 patch 에 넣지 않아 기존 번역 보존 (번역기 에러 대비)
    const { data: existing } = await supabase
      .from('history_entries')
      .select('title, title_zh')
      .eq('id', data.id)
      .single();
    const patch: {
      year: number;
      month: number | null;
      title: string;
      description: string | null;
      title_zh?: string;
    } = { year, month, title, description };
    if (!existing || existing.title !== title || !existing.title_zh) {
      const zh = await translateKoToZh(title);
      if (zh) patch.title_zh = zh; // 성공할 때만 갱신
    }
    const { error } = await supabase.from('history_entries').update(patch).eq('id', data.id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/history');
    revalidatePath('/about#history');
    return { id: data.id };
  }

  // 새 항목: 같은 연도의 마지막 sort_order + 1
  const { data: last } = await supabase
    .from('history_entries')
    .select('sort_order')
    .eq('year', year)
    .order('sort_order', { ascending: false })
    .limit(1);
  const sort_order = (last?.[0]?.sort_order ?? -1) + 1;

  const titleZh = await translateKoToZh(title); // 새 항목 — 실패하면 null(중문 페이지 한글 fallback)
  const { data: inserted, error } = await supabase
    .from('history_entries')
    .insert({ year, month, title, description, title_zh: titleZh, sort_order })
    .select('id')
    .single();
  if (error) throw new Error(error.message);

  revalidatePath('/admin/history');
  revalidatePath('/about#history');
  return { id: inserted!.id };
}

// 줄 삭제 (id 기준). 저장 안 된 새 줄은 클라이언트에서 그냥 제거.
export async function deleteHistoryEntry(id: number): Promise<void> {
  const supabase = await createServerSupabase();
  if (!id) return;
  const { error } = await supabase.from('history_entries').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/history');
  revalidatePath('/about#history');
}

// 기존 연혁 중 중문(title_zh) 없는 항목 일괄 자동 번역. 재실행 가능(번역된 건 건너뜀).
// 타임아웃으로 중간에 끊겨도 완료분은 저장돼 다시 누르면 이어서 번역됨.
export async function autoTranslateHistoryBatch(): Promise<{ done: number; remaining: number }> {
  const supabase = await createServerSupabase();
  const { data: rows } = await supabase
    .from('history_entries')
    .select('id, title, title_zh')
    .is('title_zh', null);
  const list = (rows ?? []) as Array<{ id: number; title: string }>;
  let done = 0;
  for (const r of list) {
    const zh = await translateKoToZh(r.title);
    if (zh) {
      await supabase.from('history_entries').update({ title_zh: zh }).eq('id', r.id);
      done += 1;
    }
  }
  revalidatePath('/admin/history');
  revalidatePath('/about#history');
  return { done, remaining: list.length - done };
}
