'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * 화면에 들어오면 is-revealed 클래스를 붙여 CSS 등장 애니메이션(페이드·업)을 1회 트리거.
 * 서버에서 렌더된 children 을 그대로 감싸기만 함 (마퀴 등 그대로 동작).
 */
export default function RevealOnScroll({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className}${revealed ? ' is-revealed' : ''}`}>
      {children}
    </div>
  );
}
