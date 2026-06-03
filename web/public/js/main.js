// 이 파일은 Next.js <Script strategy="afterInteractive" onReady={...}> 로 로드된다.
// onReady 는 최초 로드 + SPA 재마운트(타 페이지 → 메인 복귀)마다 호출되므로,
// 모든 셋업을 window.__eumfoodSetupMain() 한 곳에 모아 매 마운트마다 재실행한다.
// (예전 DOMContentLoaded 방식은 SPA 복귀 시 재실행되지 않아 #main>section{opacity:0}
//  섹션이 .active 를 못 받아 영영 안 보이던 버그가 있었음 — 타페이지 방문 후 메인 복귀.)

function __eumfoodSetupTabs() {
    /**
     * Section 4: Process Tab Interaction
     * 숫자 탭 클릭 시 이미지, 텍스트, 그리고 상세페이지 링크 변경
     */
    const procBtns = document.querySelectorAll('.proc_tab_btn');
    const procImgs = document.querySelectorAll('.proc_img');
    const procInfoGroups = document.querySelectorAll('.proc_info_group');
    const procDescs = document.querySelectorAll('.proc_desc');
    procBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-proc');

            // 1. 모든 요소 active 제거
            [procBtns, procImgs, procInfoGroups, procDescs].forEach(group => {
                group.forEach(el => el.classList.remove('active'));
            });

            // 2. 선택된 요소 active 추가
            btn.classList.add('active');
            document.querySelector(`.proc_img[data-proc="${id}"]`)?.classList.add('active');
            document.querySelector(`.proc_info_group[data-proc="${id}"]`)?.classList.add('active');
            document.querySelector(`.proc_desc[data-proc="${id}"]`)?.classList.add('active');

            // 더 알아보기 링크는 React 컴포넌트(item.link, 예: /about#area)에서 처리
        });
    });

    /**
     * Section 5: Product Category Tab Interaction
     * 카테고리 클릭 시 제품 그리드 전환 및 상세페이지 링크 변경
     */
    const cateBtns = document.querySelectorAll('.prod_cate_btn');
    const prodGrids = document.querySelectorAll('.prod_grid');
    const prodMoreLink = document.getElementById('prod_more_link'); // 제품 섹션 상세버튼

    cateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetCate = btn.getAttribute('data-cate');
            const targetLink = btn.getAttribute('data-link'); // 카테고리별 제품 앵커 (i18n messages 의 link)

            // 1. 카테고리 버튼 활성화
            cateBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. 제품 그리드 전환
            prodGrids.forEach(grid => {
                if (grid.getAttribute('data-cate') === targetCate) {
                    grid.classList.add('active');
                } else {
                    grid.classList.remove('active');
                }
            });

            // 3. 더 알아보기 버튼 링크 업데이트
            if (prodMoreLink && targetLink) {
                prodMoreLink.setAttribute('href', targetLink);
            }
        });
    });
}

// Section 8: Directions Tab (지도 섹션은 footer 로 이관 — 메인엔 보통 없음/no-op,
// 있더라도 footer 는 layout 에 있어 SPA 내비게이션에도 DOM 유지되므로 1회 바인딩으로 충분)
const dirBtns = document.querySelectorAll('.dir_tab_btn');
const dirGroups = document.querySelectorAll('.dir_detail_group');
const dirMapImg = document.getElementById('dir_map_img'); // 지도 이미지 요소 선택

dirBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-dir');

        // 1. 버튼 활성화 클래스 처리
        dirBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 2. 정보 그룹 활성화 클래스 처리
        dirGroups.forEach(group => {
            if (group.getAttribute('data-dir') === target) {
                group.classList.add('active');
            } else {
                group.classList.remove('active');
            }
        });

        // 3. 지도 이미지: 언어별(data-map-*) + 탭(제조사/물류)에 맞게 교체
        if (dirMapImg) {
            const factorySrc = dirMapImg.getAttribute('data-map-factory');
            const logisticsSrc = dirMapImg.getAttribute('data-map-logistics');
            if (target === 'factory' && factorySrc) {
                dirMapImg.src = factorySrc;
            } else if (target === 'logistics' && logisticsSrc) {
                dirMapImg.src = logisticsSrc;
            }
        }
    });
});

let currentScroll = 0;
let targetScroll = 0;
/** 스크롤 진행도 보간 */
const ease = 0.12;
/** blend 표시값 보간 */
let blendDisplay = 0;
const blendEase = 0.15;
let overviewRafId = null;
let overviewAnimating = false;
let overviewActiveClassOn = false;
let overviewLastTs = 0;
/** Overview 애니메이션용 DOM 캐시 (매 프레임 querySelector 방지) */
let overviewSectionEl = null;
let overviewWrapperEl = null;
let overviewLeftTitleEl = null;
let overviewRightTitleEl = null;

function cacheOverviewElements() {
    overviewSectionEl = document.querySelector('.overview_section');
    overviewWrapperEl = document.querySelector('.sticky_wrapper');
    overviewLeftTitleEl = document.querySelector('.ov_title.left');
    overviewRightTitleEl = document.querySelector('.ov_title.right');
}

let overviewPrefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** 스크롤 끝에서 겹치지 않도록 한쪽당 최대 translate(px) */
let overviewMaxShift = 0;

function recalcOverviewMaxShift() {
    const wrapper = overviewWrapperEl || document.querySelector('.sticky_wrapper');
    const leftTitle = overviewLeftTitleEl || document.querySelector('.ov_title.left');
    const rightTitle = overviewRightTitleEl || document.querySelector('.ov_title.right');
    if (!wrapper || !leftTitle || !rightTitle) {
        overviewMaxShift = 0;
        return;
    }
    // 모바일: layout 이 column 이라 transform 안 함 (maxShift 0).
    // blend 변수만 스크롤 따라 변화.
    if (window.innerWidth <= 1024) {
        overviewMaxShift = 0;
        return;
    }

    const vw = window.innerWidth;
    const colGapStart = Math.min(48, Math.max(24, vw * 0.03));
    const colGapEnd = 0;
    const targetGapPx = 22;

    const prevBlend = wrapper.style.getPropertyValue('--ov-blend');
    const prevGap = wrapper.style.getPropertyValue('--ov-title-col-gap');
    const prevGt = wrapper.style.getPropertyValue('--ov-gap-stack-top');
    const prevGm = wrapper.style.getPropertyValue('--ov-gap-stack-mid');
    const prevGi = wrapper.style.getPropertyValue('--ov-gap-stack-inner');
    const prevPs = wrapper.style.getPropertyValue('--ov-pinch-sub-y');
    const prevPb = wrapper.style.getPropertyValue('--ov-pinch-bottom-y');
    const prevLt = leftTitle.style.transform;
    const prevRt = rightTitle.style.transform;

    wrapper.style.setProperty('--ov-blend', '0');
    wrapper.style.setProperty('--ov-title-col-gap', `${colGapStart}px`);
    wrapper.style.setProperty('--ov-gap-stack-top', '24px');
    wrapper.style.setProperty('--ov-gap-stack-mid', '28px');
    wrapper.style.setProperty('--ov-gap-stack-inner', '40px');
    wrapper.style.setProperty('--ov-pinch-sub-y', '0px');
    wrapper.style.setProperty('--ov-pinch-bottom-y', '0px');
    leftTitle.style.transform = '';
    rightTitle.style.transform = '';
    void wrapper.offsetHeight;

    const lr = leftTitle.getBoundingClientRect();
    const rr = rightTitle.getBoundingClientRect();
    const G0 = rr.left - lr.right;

    let max = (G0 - 2 * (colGapStart - colGapEnd) - targetGapPx) / 2;
    if (!Number.isFinite(max) || max < 0) max = 0;
    overviewMaxShift = Math.min(max, 400);

    if (prevBlend) wrapper.style.setProperty('--ov-blend', prevBlend);
    else wrapper.style.removeProperty('--ov-blend');
    if (prevGap) wrapper.style.setProperty('--ov-title-col-gap', prevGap);
    else wrapper.style.removeProperty('--ov-title-col-gap');
    if (prevGt) wrapper.style.setProperty('--ov-gap-stack-top', prevGt);
    else wrapper.style.removeProperty('--ov-gap-stack-top');
    if (prevGm) wrapper.style.setProperty('--ov-gap-stack-mid', prevGm);
    else wrapper.style.removeProperty('--ov-gap-stack-mid');
    if (prevGi) wrapper.style.setProperty('--ov-gap-stack-inner', prevGi);
    else wrapper.style.removeProperty('--ov-gap-stack-inner');
    if (prevPs) wrapper.style.setProperty('--ov-pinch-sub-y', prevPs);
    else wrapper.style.removeProperty('--ov-pinch-sub-y');
    if (prevPb) wrapper.style.setProperty('--ov-pinch-bottom-y', prevPb);
    else wrapper.style.removeProperty('--ov-pinch-bottom-y');
    if (prevLt) leftTitle.style.transform = prevLt;
    else leftTitle.style.removeProperty('transform');
    if (prevRt) rightTitle.style.transform = prevRt;
    else rightTitle.style.removeProperty('transform');
}

function updateOverviewAnimation() {
    if (!overviewWrapperEl) cacheOverviewElements();
    const section = overviewSectionEl;
    const wrapper = overviewWrapperEl;
    const leftTitle = overviewLeftTitleEl;
    const rightTitle = overviewRightTitleEl;

    if (!section || !wrapper) return;

    // 모바일도 스크롤 기반 blend 애니메이션 활성화 (사용자 요청)
    // translate 효과는 모바일 layout 에서 어색하므로 비활성 — maxShift 0 으로
    // 처리해 blend 변수 (CSS 의 손 이미지 변화) 만 스크롤 따라 변화.

    const rect = section.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewHeight = window.innerHeight;
    
    const scrollRange = Math.max(sectionHeight - viewHeight, 1);
    const rawPercent = -rect.top / scrollRange;
    targetScroll = Math.max(0, Math.min(1, rawPercent));

    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const dt = overviewLastTs ? (now - overviewLastTs) : 16.67;
    overviewLastTs = now;
    const frameFactor = Math.max(0.5, Math.min(2.0, dt / 16.67));
    const easedScroll = 1 - Math.pow(1 - ease, frameFactor);
    const easedBlend = 1 - Math.pow(1 - blendEase, frameFactor);

    if (overviewPrefersReducedMotion) {
        currentScroll = targetScroll;
    } else {
        currentScroll += (targetScroll - currentScroll) * easedScroll;
    }
    const blendRaw = Math.max(0, Math.min(1, (currentScroll - 0.05) / 0.38));
    if (overviewPrefersReducedMotion) {
        blendDisplay = blendRaw;
    } else {
        blendDisplay += (blendRaw - blendDisplay) * easedBlend;
    }
    const blend = Math.max(0, Math.min(1, blendDisplay));
    wrapper.style.setProperty('--ov-blend', blend.toFixed(4));

    const gapTopStart = 24;
    const gapTopEnd = -6;
    const gapMidStart = 28;
    const gapMidEnd = -8;
    const innerStart = 40;
    const innerEnd = 4;
    const gTop = gapTopStart + (gapTopEnd - gapTopStart) * blend;
    const gMid = gapMidStart + (gapMidEnd - gapMidStart) * blend;
    const gIn = innerStart + (innerEnd - innerStart) * blend;
    wrapper.style.setProperty('--ov-gap-stack-top', `${gTop.toFixed(2)}px`);
    wrapper.style.setProperty('--ov-gap-stack-mid', `${gMid.toFixed(2)}px`);
    wrapper.style.setProperty('--ov-gap-stack-inner', `${gIn.toFixed(2)}px`);

    /* OVERVIEW → 아래, 본문+버튼 → 위 (소수 유지로 덜 덜덜거림) */
    const vw = window.innerWidth;
    const subDown = blend * Math.min(96, Math.max(56, vw * 0.07));
    const bottomUp = -blend * Math.min(120, Math.max(68, vw * 0.09));
    wrapper.style.setProperty('--ov-pinch-sub-y', `${subDown.toFixed(2)}px`);
    wrapper.style.setProperty('--ov-pinch-bottom-y', `${bottomUp.toFixed(2)}px`);

    const colGapStart = Math.min(48, Math.max(24, vw * 0.03));
    const colGapEnd = 0;
    const colGap = colGapStart + (colGapEnd - colGapStart) * blend;
    wrapper.style.setProperty('--ov-title-col-gap', `${colGap.toFixed(2)}px`);

    if (vw <= 735) {
        // 모바일 — 좌/우 타이틀(세로 stack)이 양옆에서 가운데로 슬라이드되며 등장.
        // PC의 좌우 수렴을 폰 레이아웃에 맞춰 재현 (사진이 양쪽에서 들어오는 효과, 사용자 요청).
        // blend 0(진입)→ 좌 -slideX / 우 +slideX 로 벌어져 있다가, blend↑ 하며 0(가운데)로.
        const slideX = Math.min(72, vw * 0.18) * (1 - blend);
        if (leftTitle) leftTitle.style.transform = `translate3d(${(-slideX).toFixed(2)}px,0,0)`;
        if (rightTitle) rightTitle.style.transform = `translate3d(${slideX.toFixed(2)}px,0,0)`;
    } else {
        const shift = blend * overviewMaxShift;
        if (leftTitle) leftTitle.style.transform = `translate3d(${shift.toFixed(2)}px,0,0)`;
        if (rightTitle) rightTitle.style.transform = `translate3d(${(-shift).toFixed(2)}px,0,0)`;
    }

    // 임계값 히스테리시스: 경계 구간에서 active 토글 떨림 방지
    const activeOnThreshold = 0.46;
    const activeOffThreshold = 0.38;
    const wantActive = overviewActiveClassOn
        ? blendDisplay > activeOffThreshold
        : blendDisplay > activeOnThreshold;
    if (wantActive !== overviewActiveClassOn) {
        overviewActiveClassOn = wantActive;
        wrapper.classList.toggle('active', wantActive);
    }

    overviewRafId = requestAnimationFrame(updateOverviewAnimation);
}

function startOverviewAnimation() {
    if (overviewAnimating) return;
    overviewAnimating = true;
    overviewLastTs = 0;
    overviewRafId = requestAnimationFrame(updateOverviewAnimation);
}

function stopOverviewAnimation() {
    overviewAnimating = false;
    if (overviewRafId) {
        cancelAnimationFrame(overviewRafId);
        overviewRafId = null;
    }
}

function applyOverviewMode() {
    cacheOverviewElements();
    const wrapper = overviewWrapperEl;
    if (!wrapper) return;

    // PC·모바일 모두 스크롤 기반 blend 애니메이션 실행.
    // 모바일은 recalcOverviewMaxShift() 가 maxShift=0 으로 잡아 좌우 타이틀
    // 슬라이드만 생략하고, --ov-blend(배경 크로스페이드) · .active(텍스트색)
    // 는 PC와 동일하게 스크롤에 맞춰 구동된다.
    wrapper.classList.remove('active');
    overviewActiveClassOn = false;
    wrapper.style.removeProperty('--ov-blend');
    blendDisplay = 0;
    recalcOverviewMaxShift();
    requestAnimationFrame(() => {
        recalcOverviewMaxShift();
    });
    startOverviewAnimation();
}

let __eumfoodResizeBound = false;
function __eumfoodSetupOverview() {
    stopOverviewAnimation();   // 이전 마운트의 rAF 취소 (재마운트 중복 방지)
    cacheOverviewElements();
    applyOverviewMode();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            recalcOverviewMaxShift();
        });
    }
    // resize 리스너는 window 에 1회만 (window 는 SPA 내비게이션에도 유지됨)
    if (!__eumfoodResizeBound) {
        __eumfoodResizeBound = true;
        let overviewResizeTimer = null;
        window.addEventListener('resize', () => {
            if (overviewResizeTimer) clearTimeout(overviewResizeTimer);
            overviewResizeTimer = setTimeout(() => {
                applyOverviewMode();
            }, 120);
        });
    }
}

function __eumfoodSetupReveal() {
    // 이전 마운트의 옵저버 해제 (재마운트 누수/중복 방지)
    if (window.__eumfoodRevealObs) window.__eumfoodRevealObs.disconnect();

    const revealSections = document.querySelectorAll("#main > section");
    const revealOption = {
        root: null,        // 뷰포트 기준
        rootMargin: '0px',
        threshold: 0.15    // 섹션이 15% 정도 보였을 때 실행
    };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, revealOption);
    revealSections.forEach(section => revealObserver.observe(section));
    window.__eumfoodRevealObs = revealObserver;
}

// ── 최초 로드 + SPA 재마운트마다 <Script onReady> 가 호출 → 전체 재셋업 ──
window.__eumfoodSetupMain = function () {
    __eumfoodSetupTabs();
    __eumfoodSetupOverview();
    __eumfoodSetupReveal();
};

// 메인 페이지를 떠날 때(컴포넌트 unmount) 정리 — detached 노드 대상 rAF/옵저버 중단
window.__eumfoodStopMain = function () {
    stopOverviewAnimation();
    if (window.__eumfoodRevealObs) {
        window.__eumfoodRevealObs.disconnect();
        window.__eumfoodRevealObs = null;
    }
};