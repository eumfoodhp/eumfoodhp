'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useState, useTransition, FormEvent, ChangeEvent } from 'react';

type Option = { value: string; label: string };

export default function BoardSearchForm({
  initialQ = '',
  initialCat = 'all',
  filterOptions,
  filterPlaceholder = '카테고리',
  placeholder = '검색어를 입력해주세요',
}: {
  initialQ?: string;
  initialCat?: string;
  filterOptions?: Option[];
  filterPlaceholder?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState(initialCat);
  const [, startTransition] = useTransition();

  function go(nextQ: string, nextCat: string) {
    const params = new URLSearchParams();
    if (nextQ.trim()) params.set('q', nextQ.trim());
    if (nextCat && nextCat !== 'all') params.set('cat', nextCat);
    const qs = params.toString();
    startTransition(() => {
      router.push(`${pathname}${qs ? `?${qs}` : ''}` as never);
    });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    go(q, cat);
  }

  function onCatChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setCat(next);
    go(q, next);
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'contents' }}>
      {filterOptions && filterOptions.length > 0 && (
        <select
          className="board_filter_select"
          aria-label={filterPlaceholder}
          value={cat}
          onChange={onCatChange}
        >
          <option value="all">{filterPlaceholder}</option>
          {filterOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}
      <div className="board_search">
        <input
          type="search"
          placeholder={placeholder}
          aria-label="검색어"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" aria-label="검색">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </form>
  );
}
