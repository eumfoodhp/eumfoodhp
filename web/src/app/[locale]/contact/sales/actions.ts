'use server';

import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const ALLOWED_CATEGORIES = ['product', 'partnership', 'sponsor', 'general'];

export async function submitSales(formData: FormData) {
  const trap = String(formData.get('website') ?? '').trim();
  if (trap) throw new Error('잘못된 요청입니다.');

  const company = String(formData.get('company') ?? '').trim();
  const position = String(formData.get('position') ?? '').trim();
  const writer_name = String(formData.get('writer_name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const country = String(formData.get('country') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const privacy_agreed = formData.get('privacy_agreed') === 'on';

  if (!company) throw new Error('회사명을 입력해주세요.');
  if (!position) throw new Error('직무를 입력해주세요.');
  if (!writer_name) throw new Error('담당자 이름을 입력해주세요.');
  if (!email) throw new Error('이메일을 입력해주세요.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('이메일 형식이 올바르지 않습니다.');
  if (!phone) throw new Error('연락처를 입력해주세요.');
  if (!country) throw new Error('국가를 입력해주세요.');
  if (!content) throw new Error('문의 내용을 입력해주세요.');
  if (content.length > 5000) throw new Error('내용이 너무 깁니다.');
  if (!ALLOWED_CATEGORIES.includes(category)) throw new Error('분류를 선택해주세요.');
  if (!privacy_agreed) throw new Error('개인정보 수집·이용에 동의해주세요.');

  const supabase = await createServerSupabase();
  const { error } = await supabase.from('sales_inquiries').insert({
    company,
    position,
    writer_name,
    email,
    phone,
    country,
    category,
    content,
    privacy_agreed,
    status: 'pending',
  });
  if (error) throw new Error('문의 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');

  revalidatePath('/admin/sales');
  redirect('/contact/sales?submitted=1');
}
