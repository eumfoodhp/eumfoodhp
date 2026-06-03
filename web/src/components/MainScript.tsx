'use client';

import Script from 'next/script';
import { useEffect } from 'react';

/**
 * 메인 페이지 전용 스크립트(/js/main.js) 로더.
 *
 * main.js 는 한 번만 로드되지만 모든 셋업(제품 탭 / overview 스크롤 애니메이션 /
 * #main>section 등장 옵저버)을 window.__eumfoodSetupMain() 으로 노출한다.
 *
 * next/script 의 onReady 는 "최초 로드 + 컴포넌트가 마운트될 때마다" 호출되므로,
 * 타 페이지 방문 후 메인으로 (SPA) 복귀할 때도 다시 셋업이 돌아간다.
 * (예전엔 DOMContentLoaded 로만 셋업해서 SPA 복귀 시 재실행되지 않아
 *  #main>section{opacity:0} 섹션들이 .active 를 못 받아 영영 안 보였음.)
 *
 * 언마운트(메인을 떠남) 시 __eumfoodStopMain() 으로 detached 노드 대상
 * requestAnimationFrame / IntersectionObserver 를 정리한다.
 */
type MainHooks = {
  __eumfoodSetupMain?: () => void;
  __eumfoodStopMain?: () => void;
};

export default function MainScript() {
  useEffect(() => {
    // onReady 가 마운트 시 호출하지만, 이미 로드된 상태에서의 재마운트 타이밍
    // 보강용으로 effect 에서도 한 번 시도(존재하면 idempotent).
    (window as unknown as MainHooks).__eumfoodSetupMain?.();
    return () => {
      (window as unknown as MainHooks).__eumfoodStopMain?.();
    };
  }, []);

  return (
    <Script
      src="/js/main.js"
      strategy="afterInteractive"
      onReady={() => {
        (window as unknown as MainHooks).__eumfoodSetupMain?.();
      }}
    />
  );
}
