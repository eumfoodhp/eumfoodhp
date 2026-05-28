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
  const sort_order = Number(formData.get('sort_order') ?? 0) || 0;

  if (!year || !title) throw new Error('연도와 제목은 필수입니다.');
  if (month !== null && (month < 1 || month > 12)) throw new Error('월은 1~12.');

  const { error } = await supabase
    .from('history_entries')
    .insert({ year, month, title, description, sort_order });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/history');
  revalidatePath('/about/history');
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
  const sort_order = Number(formData.get('sort_order') ?? 0) || 0;

  if (!id || !year || !title) throw new Error('필수 항목 누락.');

  const { error } = await supabase
    .from('history_entries')
    .update({ year, month, title, description, sort_order })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/history');
  revalidatePath('/about/history');
  redirect('/admin/history');
}

export async function deleteHistory(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('id 누락.');

  const { error } = await supabase.from('history_entries').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/history');
  revalidatePath('/about/history');
}
