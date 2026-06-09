// 언어 토글 / 모바일 햄버거 메뉴 — 이벤트 위임(document)으로 처리.
// 직접 querySelector + addEventListener 는 헤더가 SPA 내비게이션·로케일 전환으로
// 리렌더되면 캡처한 노드가 stale 돼 클릭이 안 먹는 문제가 있었음(햄버거 작동 안 함).
// document 는 영속이므로 위임하면 헤더가 몇 번 리렌더돼도 항상 동작한다.

function closeMobileNav() {
    const moNav = document.querySelector('#mo_nav');
    const moOverlay = document.querySelector('.mo_overlay');
    if (moNav) moNav.classList.remove('active');
    if (moOverlay) moOverlay.classList.remove('active');
    document.body.classList.remove('menu_open');
    document.body.style.overflow = 'unset';
}

document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    // 언어 토글 버튼
    if (target.closest('.lang_toggle_btn')) {
        e.stopPropagation();
        const langList = document.querySelector('.lang_list');
        if (langList) langList.classList.toggle('active');
        return;
    }

    // 햄버거 — 모바일 메뉴 토글 (열려 있으면 닫기)
    if (target.closest('.mo_menu_btn')) {
        const moNav = document.querySelector('#mo_nav');
        if (moNav && moNav.classList.contains('active')) {
            closeMobileNav();   // 토글: 이미 열려 있으면 닫기
            return;
        }
        const moOverlay = document.querySelector('.mo_overlay');
        if (moNav) moNav.classList.add('active');
        if (moOverlay) moOverlay.classList.add('active');
        document.body.classList.add('menu_open');
        document.body.style.overflow = 'hidden';
        return;
    }

    // 닫기 — 메뉴 오버레이(#mo_nav) 안에서 "링크(a)가 아닌 곳"을 누르면 어디든 닫기.
    //   흰 박스(.menu_container)가 화면 대부분을 덮으므로, 박스 안 빈 영역/배경/닫기버튼(×)
    //   어디를 눌러도 닫힘. 링크는 이동+자동닫힘이 처리, 아코디언 타이틀은 제외.
    if (
        target.classList.contains('mo_overlay') ||
        (target.closest('#mo_nav') &&
            !target.closest('a') &&
            !target.closest('.mo_menu_title'))
    ) {
        closeMobileNav();
        return;
    }

    // 모바일 메뉴 타이틀 아코디언 (.mo_menu_title 이 있을 때만)
    const moTitle = target.closest('.mo_menu_title');
    if (moTitle && window.innerWidth <= 1024) {
        const subMenu = moTitle.nextElementSibling;
        if (subMenu && subMenu.classList.contains('mo_sub_menu')) {
            const isOpen = moTitle.classList.contains('open');
            document.querySelectorAll('.mo_menu_title').forEach((t) => {
                t.classList.remove('open');
                t.setAttribute('aria-expanded', 'false');
            });
            document.querySelectorAll('.mo_sub_menu').forEach((s) => s.classList.remove('open'));
            if (!isOpen) {
                moTitle.classList.add('open');
                moTitle.setAttribute('aria-expanded', 'true');
                subMenu.classList.add('open');
            }
        }
        return;
    }

    // 그 외 클릭 — 열려 있던 언어 리스트 닫기
    const langList = document.querySelector('.lang_list');
    if (langList) langList.classList.remove('active');
});

// [제거됨] PHP 시절 ?lang=xx 쿼리 기반 언어 전환 로직.
// 새 사이트는 next-intl이 /ko, /en, /zh 경로 라우팅을 처리하므로,
// 이 핸들러가 클릭을 가로채면 정작 next-intl Link가 동작 못 함.
// LanguageSwitcher 컴포넌트가 모든 전환을 담당.

/* PC 메가메뉴: GNB→서브 사이 데드존에서 :has()만으로 닫히는 현상 방지 */
(function () {
    const header = document.getElementById('header');
    const gnb = header && header.querySelector('.gnb_wrap');
    const mega = header && header.querySelector('.mega_panel');
    if (!header || !gnb || !mega) return;

    let closeTimer = null;
    /** GNB → 서브 이동 시 데드존용 */
    const CLOSE_DELAY_FROM_GNB_MS = 220;
    /** 서브 영역을 벗어날 때는 빠르게 닫기 */
    const CLOSE_DELAY_FROM_MEGA_MS = 70;

    function openMega() {
        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }
        header.classList.add('mega-hover');
    }

    function scheduleClose(delayMs) {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            header.classList.remove('mega-hover');
            closeTimer = null;
        }, delayMs);
    }

    gnb.addEventListener('mouseenter', openMega);
    gnb.addEventListener('mouseleave', () => scheduleClose(CLOSE_DELAY_FROM_GNB_MS));
    mega.addEventListener('mouseenter', openMega);
    mega.addEventListener('mouseleave', () => scheduleClose(CLOSE_DELAY_FROM_MEGA_MS));

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 1024) {
            if (closeTimer) {
                clearTimeout(closeTimer);
                closeTimer = null;
            }
            header.classList.remove('mega-hover');
        }
    });
})();