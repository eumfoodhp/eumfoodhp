'use server';

import { createServerSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateSalesStatus(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  const status = String(formData.get('status') ?? '').trim();

  if (!id || !['pending', 'contacted', 'closed'].includes(status)) {
    throw new Error('잘못된 상태 값.');
  }

  const { error } = await supabase
    .from('sales_inquiries')
    .update({ status })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/sales');
  revalidatePath(`/admin/sales/${id}`);
}

export async function deleteSales(formData: FormData) {
  const supabase = await createServerSupabase();
  const id = Number(formData.get('id'));
  if (!id) throw new Error('id 누락.');

  const { error } = await supabase.from('sales_inquiries').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/sales');
  redirect('/admin/sales');
}
