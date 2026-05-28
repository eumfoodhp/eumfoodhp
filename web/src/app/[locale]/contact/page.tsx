import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import SubVisual from '@/components/SubVisual';
import SubTabBar from '@/components/SubTabBar';
import { supportTabs } from '@/lib/sub-tabs';
import { createServerSupabase } from '@/lib/supabase-server';
import '@/styles/sub.css';
import '@/styles/public-forms.css';

export const revalidate = 0;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ submitted?: string }>;
}) {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  setRequestLocale(locale);
  const t = await getTranslations();

  const supabase = await createServerSupabase();
  // 공개 가능한 정보만: 작성자명/제목/상태/날짜. 비공개 글은 제목·내용 마스킹.
  const { data: list } = await supabase
    .from('contacts')
    .select('id, writer_name, subject, status, is_private, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <main id="sub_contents" className="contact_page">
      <SubVisual
        parentLabel={t('menu_support')}
        currentLabel={t('sub_inquiry_1to1')}
        title={t('sub_inquiry_1to1')}
        desc={t('contact_hero_desc')}
        tabBar={<SubTabBar tabs={supportTabs(t)} activeKey="contact" />}
      />

      <div className="sub_inner">
        {sp.submitted === '1' && (
          <div className="public_notice success" role="status">
            문의가 정상적으로 접수되었습니다. 빠른 시일 내 답변드리겠습니다.
          </div>
        )}

        <div className="public_list_head">
          <span className="public_list_count">총 {list?.length ?? 0}건</span>
          <Link href="/contact/write" className="pf_submit pf_submit--sm">+ 1:1 문의 작성</Link>
        </div>

        {!list || list.length === 0 ? (
          <div className="public_empty">아직 등록된 문의가 없습니다.</div>
        ) : (
          <table className="public_table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>상태</th>
                <th>제목</th>
                <th style={{ width: 120 }}>작성자</th>
                <th style={{ width: 140 }}>작성일</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.status === 'answered' ? (
                      <span className="status_chip status_chip--ok">답변완료</span>
                    ) : (
                      <span className="status_chip status_chip--wait">대기중</span>
                    )}
                  </td>
                  <td className="public_table_title">
                    {c.is_private && <span aria-hidden="true">🔒 </span>}
                    {c.is_private ? '비공개 글입니다.' : c.subject}
                  </td>
                  <td>{maskName(c.writer_name)}</td>
                  <td>{new Date(c.created_at).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

// "홍길동" → "홍*동" 식 마스킹 (가운데 글자 *)
function maskName(name: string): string {
  if (!name) return '';
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}
