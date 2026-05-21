const langToggleBtn = document.querySelector('.lang_toggle_btn');
const langList = document.querySelector('.lang_list');
const moBtn = document.querySelector('.mo_menu_btn');
const moClose = document.querySelector('.mo_close_btn');
const moNav = document.querySelector('#mo_nav');
const moOverlay = document.querySelector('.mo_overlay');
const moTitles = document.querySelectorAll('.mo_menu_title');
const langLinks = document.querySelectorAll('.lang_list a, .mo_lang_area a');

if (langToggleBtn) {
    langToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langList.classList.toggle('active');
    });
}

document.addEventListener('click', () => {
    if (langList) langList.classList.remove('active');
});

if (moBtn) {
    moBtn.addEventListener('click', () => {
        moNav.classList.add('active');
        moOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

const closeNav = () => {
    if (moNav) {
        moNav.classList.remove('active');
        moOverlay.classList.remove('active');
        document.body.style.overflow = 'unset';
    }
};

if (moClose) moClose.addEventListener('click', closeNav);
if (moOverlay) moOverlay.addEventListener('click', closeNav);

moTitles.forEach((title) => {
    title.addEventListener('click', function () {
        if (window.innerWidth > 1024) return;

        const subMenu = this.nextElementSibling;
        if (!subMenu || !subMenu.classList.contains('mo_sub_menu')) return;

        const isOpen = this.classList.contains('open');

        moTitles.forEach((t) => {
            t.classList.remove('open');
            t.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.mo_sub_menu').forEach((s) => {
            s.classList.remove('open');
        });

        if (!isOpen) {
            this.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            subMenu.classList.add('open');
        }
    });
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