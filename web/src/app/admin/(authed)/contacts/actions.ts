'use server';

import { createServerSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function answerContact(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  const answer = String(formData.get('answer') ?? '').trim();

  if (!id || !answer) throw new Error('답변 내용을 입력해주세요.');

  const { error } = await supabase
    .from('contacts')
    .update({
      answer,
      answered_at: new Date().toISOString(),
      status: 'answered',
    })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/contacts');
  revalidatePath(`/admin/contacts/${id}`);
  redirect(`/admin/contacts/${id}`);
}

export async function reopenContact(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('id 누락.');

  const { error } = await supabase
    .from('contacts')
    .update({ status: 'pending' })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/contacts');
  revalidatePath(`/admin/contacts/${id}`);
}

export async function deleteContact(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('id 누락.');

  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/contacts');
  redirect('/admin/contacts');
}
