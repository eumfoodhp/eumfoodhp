'use client';

/**
 * 보도자료 목록의 고정 체크박스 — 클릭 즉시 서버액션으로 토글.
 * 보도자료 고정은 1개만이라, 하나를 켜면 나머지는 서버에서 자동 해제됨
 * (revalidate 후 다른 행 체크박스도 해제 상태로 갱신).
 */
import { useTransition } from 'react';

export default function PressPinToggle({
  id,
  pinned,
  action,
}: {
  id: number;
  pinned: boolean;
  action: (formData: FormData) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <label
      title={pinned ? '상단 고정됨 — 클릭하면 해제' : '상단 고정 (1개만)'}
      style={{ display: 'inline-flex', alignItems: 'center', cursor: pending ? 'wait' : 'pointer' }}
    >
      <input
        type="checkbox"
        checked={pinned}
        disabled={pending}
        onChange={(e) => {
          const fd = new FormData();
          fd.set('id', String(id));
          fd.set('pinned', e.target.checked ? '1' : '0');
          startTransition(() => action(fd));
        }}
        style={{ width: 18, height: 18, cursor: 'inherit' }}
      />
    </label>
  );
}
