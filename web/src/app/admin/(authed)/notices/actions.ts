'use server';

import { createServerSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNotice(formData: FormData) {
  const supabase = await createServerSupabase();
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim() || null;
  const is_pinned = formData.get('is_pinned') === 'on';
  const title_zh = String(formData.get('title_zh') ?? '').trim() || null;
  const content_zh = String(formData.get('content_zh') ?? '').trim() || null;

  if (!title || !content) throw new Error('제목과 내용을 입력해주세요.');

  const { error } = await supabase
    .from('notices')
    .insert({ title, content, category, is_pinned, title_zh, content_zh });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/notices');
  revalidatePath('/notice');
  redirect('/admin/notices');
}

export async function updateNotice(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim() || null;
  const is_pinned = formData.get('is_pinned') === 'on';
  const title_zh = String(formData.get('title_zh') ?? '').trim() || null;
  const content_zh = String(formData.get('content_zh') ?? '').trim() || null;

  if (!id || !title || !content) throw new Error('필수 항목 누락.');

  const { error } = await supabase
    .from('notices')
    .update({ title, content, category, is_pinned, title_zh, content_zh })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/notices');
  revalidatePath('/notice');
  redirect('/admin/notices');
}

export async function deleteNotice(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('id 누락.');

  const { error } = await supabase.from('notices').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/notices');
  revalidatePath('/notice');
}
