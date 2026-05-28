'use server';

import { createServerSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPress(formData: FormData) {
  const supabase = await createServerSupabase();
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const source = String(formData.get('source') ?? '').trim() || null;
  const link_url = String(formData.get('link_url') ?? '').trim() || null;
  const thumbnail = String(formData.get('thumbnail') ?? '').trim() || null;

  if (!title || !content) throw new Error('제목과 내용을 입력해주세요.');

  const { error } = await supabase
    .from('press_releases')
    .insert({ title, content, source, link_url, thumbnail });
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
  const thumbnail = String(formData.get('thumbnail') ?? '').trim() || null;

  if (!id || !title || !content) throw new Error('필수 항목 누락.');

  const { error } = await supabase
    .from('press_releases')
    .update({ title, content, source, link_url, thumbnail })
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
