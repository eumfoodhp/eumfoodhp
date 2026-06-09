'use server';

import { createServerSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
