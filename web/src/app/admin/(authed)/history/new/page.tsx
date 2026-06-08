import Link from 'next/link';
import HistoryBatchForm from '../HistoryBatchForm';

export default async function NewHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const sp = await searchParams;
  const y = sp.year ? Number(sp.year) : NaN;
  const initialYear = Number.isFinite(y) ? y : undefined;

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">연혁 추가 — 연도별 일괄 등록</h2>
        <Link href="/admin/history" className="admin_btn secondary">← 목록</Link>
      </div>

      <HistoryBatchForm initialYear={initialYear} />
    </>
  );
}
