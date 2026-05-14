document.addEventListener('DOMContentLoaded', () => {
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

            // 더 알아보기: 메인에서는 사업영역 소개(business_area.php)로 고정
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
            const targetLink = btn.getAttribute('data-link'); // ko.php에서 넘어온 링크

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
});

// Section 8: Directions Tab
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
    if (!wrapper || !leftTitle || !rightTitle || window.innerWidth <= 1024) {
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

    if (window.innerWidth <= 1024) {
        wrapper.classList.add('active');
        wrapper.style.setProperty('--ov-blend', '1');
        if (leftTitle) leftTitle.style.transform = '';
        if (rightTitle) rightTitle.style.transform = '';
        return;
    }

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

    const shift = blend * overviewMaxShift;
    if (leftTitle) leftTitle.style.transform = `translate3d(${shift.toFixed(2)}px,0,0)`;
    if (rightTitle) rightTitle.style.transform = `translate3d(${(-shift).toFixed(2)}px,0,0)`;

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

function setOverviewMobileState() {
    const wrapper = overviewWrapperEl || document.querySelector('.sticky_wrapper');
    const leftTitle = overviewLeftTitleEl || document.querySelector('.ov_title.left');
    const rightTitle = overviewRightTitleEl || document.querySelector('.ov_title.right');
    if (wrapper) {
        wrapper.classList.add('active');
        overviewActiveClassOn = true;
        wrapper.style.setProperty('--ov-blend', '1');
        wrapper.style.removeProperty('--ov-title-col-gap');
        wrapper.style.removeProperty('--ov-gap-stack-top');
        wrapper.style.removeProperty('--ov-gap-stack-mid');
        wrapper.style.removeProperty('--ov-gap-stack-inner');
        wrapper.style.removeProperty('--ov-pinch-sub-y');
        wrapper.style.removeProperty('--ov-pinch-bottom-y');
    }
    if (leftTitle) leftTitle.style.transform = '';
    if (rightTitle) rightTitle.style.transform = '';
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

    if (window.innerWidth > 1024) {
        wrapper.classList.remove('active');
        overviewActiveClassOn = false;
        wrapper.style.removeProperty('--ov-blend');
        blendDisplay = 0;
        recalcOverviewMaxShift();
        requestAnimationFrame(() => {
            recalcOverviewMaxShift();
        });
        startOverviewAnimation();
        return;
    }

    stopOverviewAnimation();
    setOverviewMobileState();
}

document.addEventListener('DOMContentLoaded', () => {
    cacheOverviewElements();
    applyOverviewMode();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            recalcOverviewMaxShift();
        });
    }

    let overviewResizeTimer = null;
    window.addEventListener('resize', () => {
        if (overviewResizeTimer) clearTimeout(overviewResizeTimer);
        overviewResizeTimer = setTimeout(() => {
            applyOverviewMode();
        }, 120);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // 감시할 섹션들 모두 선택
    const revealSections = document.querySelectorAll("#main > section");

    const revealOption = {
        root: null, // 뷰포트 기준
        rootMargin: '0px',
        threshold: 0.15 // 섹션이 15% 정도 보였을 때 실행
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 화면에 들어오면 'active' 클래스 추가
                entry.target.classList.add("active");
                // 한 번 나타난 뒤에는 다시 감시할 필요 없으면 아래 줄 활성화 (선택)
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOption);

    // 각 섹션 감시 시작
    revealSections.forEach(section => {
        revealObserver.observe(section);
    });
});