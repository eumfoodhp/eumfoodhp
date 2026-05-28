'use server';

import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// 매우 단순한 honeypot + 길이 검사 — 봇 자동 제출 차단
function validateContact(form: FormData): {
  writer_name: string;
  email: string | null;
  phone: string | null;
  subject: string;
  content: string;
  is_private: boolean;
} {
  const trap = String(form.get('website') ?? '').trim();
  if (trap) throw new Error('잘못된 요청입니다.');

  const writer_name = String(form.get('writer_name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim() || null;
  const phone = String(form.get('phone') ?? '').trim() || null;
  const subject = String(form.get('subject') ?? '').trim();
  const content = String(form.get('content') ?? '').trim();
  const is_private = form.get('is_private') === 'on';

  if (!writer_name) throw new Error('작성자 이름을 입력해주세요.');
  if (writer_name.length > 50) throw new Error('이름이 너무 깁니다.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('이메일 형식이 올바르지 않습니다.');
  }
  if (!subject) throw new Error('제목을 입력해주세요.');
  if (subject.length > 200) throw new Error('제목이 너무 깁니다.');
  if (!content) throw new Error('문의 내용을 입력해주세요.');
  if (content.length > 5000) throw new Error('내용이 너무 깁니다.');

  return { writer_name, email, phone, subject, content, is_private };
}

export async function submitContact(formData: FormData) {
  const data = validateContact(formData);

  const supabase = await createServerSupabase();
  const { error } = await supabase.from('contacts').insert({
    ...data,
    status: 'pending',
  });
  if (error) throw new Error('문의 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');

  revalidatePath('/contact');
  revalidatePath('/admin/contacts');
  redirect('/contact?submitted=1');
}
