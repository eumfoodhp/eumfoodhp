'use server';

import { createServerSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createDownload(formData: FormData) {
  const supabase = await createServerSupabase();
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  const category = String(formData.get('category') ?? '').trim() || null;
  const file_url = String(formData.get('file_url') ?? '').trim();
  const file_type = String(formData.get('file_type') ?? '').trim() || null;
  const file_size_raw = String(formData.get('file_size') ?? '').trim();
  const file_size = file_size_raw ? Number(file_size_raw) : null;

  if (!title || !file_url) throw new Error('제목과 파일 URL을 입력해주세요.');

  const { error } = await supabase
    .from('downloads')
    .insert({ title, description, category, file_url, file_type, file_size });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/downloads');
  revalidatePath('/download');
  redirect('/admin/downloads');
}

export async function updateDownload(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  const category = String(formData.get('category') ?? '').trim() || null;
  const file_url = String(formData.get('file_url') ?? '').trim();
  const file_type = String(formData.get('file_type') ?? '').trim() || null;
  const file_size_raw = String(formData.get('file_size') ?? '').trim();
  const file_size = file_size_raw ? Number(file_size_raw) : null;

  if (!id || !title || !file_url) throw new Error('필수 항목 누락.');

  const { error } = await supabase
    .from('downloads')
    .update({ title, description, category, file_url, file_type, file_size })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/downloads');
  revalidatePath('/download');
  redirect('/admin/downloads');
}

export async function deleteDownload(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('id 누락.');

  const { error } = await supabase.from('downloads').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/downloads');
  revalidatePath('/download');
}
