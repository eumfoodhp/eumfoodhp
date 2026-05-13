<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

$current_lang = $_SESSION['lang'] ?? 'ko';

// 1. 연혁 데이터 가져오기 (연도 내림차순)
$history_data = [];
if (isset($conn) && $conn) {
    $content_col = ($current_lang == 'ko') ? 'h_content' : "COALESCE(NULLIF(h_content_$current_lang, ''), h_content)";
    $query = "SELECT h_year, $content_col AS display_content FROM history ORDER BY h_year DESC, idx DESC";
    $result = mysqli_query($conn, $query);

    if ($result) {
        while($row = mysqli_fetch_assoc($result)) {
            if(!empty($row['display_content'])) {
                $history_data[$row['h_year']][] = $row['display_content'];
            }
        }
    }
}

// 2. 연도 구간 정의 (이미지 기준)
$periods = [
    ['id' => 'p1', 'label' => 'NOW ~ 2022', 'start' => 2022, 'end' => 9999],
    ['id' => 'p2', 'label' => '2021 ~ 2017', 'start' => 2017, 'end' => 2021],
    ['id' => 'p3', 'label' => '2016 ~ 2012', 'start' => 2012, 'end' => 2016],
    ['id' => 'p4', 'label' => '2011 ~ 2009', 'start' => 2009, 'end' => 2011],
];
?>

<link rel="stylesheet" href="/css/sub.css">

<main id="sub_contents" class="history_page">
    <!-- 서브 비주얼 섹션 (탭메뉴 포함) -->
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_about']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_tab_history']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['history_title']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['sub_banner_history_desc']; ?></p>
                </div>
            </div>
            <div class="sub_visual_img" style="background-image: url('/images/sub/tempo.png');">
                <div class="sub_tab_container">
                <div class="sub_tab_inner">
                    <!-- 인사말 -->
                    <a href="/pages/about_greeting.php" 
                    class="sub_tab_item <?php echo (basename($_SERVER['PHP_SELF']) == 'about_greeting.php') ? 'active' : ''; ?>">
                    <?php echo $lang['sub_tab_greeting']; ?>
                    </a>

                    <!-- 회사연혁 -->
                    <a href="/pages/about_history.php" 
                    class="sub_tab_item <?php echo (basename($_SERVER['PHP_SELF']) == 'about_history.php') ? 'active' : ''; ?>">
                    <?php echo $lang['sub_tab_history']; ?>
                    </a>

                    <!-- 인증/특허현황 (about_cert.php) -->
                    <a href="/pages/about_cert.php" 
                    class="sub_tab_item <?php echo (basename($_SERVER['PHP_SELF']) == 'about_cert.php') ? 'active' : ''; ?>">
                    <?php echo $lang['sub_tab_cert']; ?>
                    </a>

                    <!-- 조직도 (파일명 수정됨: about_organization.php) -->
                    <a href="/pages/about_organization.php" 
                    class="sub_tab_item <?php echo (basename($_SERVER['PHP_SELF']) == 'about_organization.php') ? 'active' : ''; ?>">
                    <?php echo $lang['sub_tab_org']; ?>
                    </a>

                    <!-- 오시는 길 -->
                    <a href="/pages/about_location.php" 
                    class="sub_tab_item <?php echo (basename($_SERVER['PHP_SELF']) == 'about_location.php') ? 'active' : ''; ?>">
                    <?php echo $lang['sub_tab_direction']; ?>
                    </a>
                </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 타임라인 섹션 -->
    <section class="new_history_section">
        <div class="sub_inner">
            <div class="new_history_container">
                
                <!-- 왼쪽: 구간 탭 (Sticky) -->
                <div class="history_side">
                    <div class="history_sticky_tabs">
                        <?php foreach($periods as $p): ?>
                            <a href="#<?php echo $p['id']; ?>" class="period_tab"><?php echo $p['label']; ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- 오른쪽: 연혁 리스트 -->
                <div class="history_main">
                    <?php foreach($periods as $p): ?>
                        <div id="<?php echo $p['id']; ?>" class="period_group">
                            <h3 class="period_title"><?php echo $p['label']; ?></h3>
                            <div class="period_content">
                                <?php 
                                foreach($history_data as $year => $contents): 
                                    if ($year >= $p['start'] && $year <= $p['end']):
                                ?>
                                    <div class="year_item">
                                        <h4 class="year_tit"><?php echo $year; ?></h4>
                                        <ul class="year_details">
                                            <?php foreach($contents as $c): ?>
                                                <li><?php echo nl2br(htmlspecialchars($c)); ?></li>
                                            <?php endforeach; ?>
                                        </ul>
                                    </div>
                                <?php 
                                    endif;
                                endforeach; 
                                ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

            </div>
        </div>
    </section>
</main>

<script>
// 스크롤/클릭 시 좌측 연혁 탭과 우측 섹션을 정확히 동기화
(function () {
    const tabs = Array.from(document.querySelectorAll('.history_sticky_tabs .period_tab'));
    const sections = Array.from(document.querySelectorAll('.period_group'));
    if (!tabs.length || !sections.length) return;

    const getHeaderOffset = () => {
        // 고정 헤더 + 여백 보정
        const w = window.innerWidth || document.documentElement.clientWidth;
        return w <= 735 ? 88 : 140;
    };

    const setActiveTab = (id) => {
        tabs.forEach((tab) => {
            const targetId = (tab.getAttribute('href') || '').replace('#', '');
            tab.classList.toggle('active', targetId === id);
        });
    };

    const findCurrentSectionId = () => {
        const offset = getHeaderOffset();
        let currentId = sections[0].id;

        for (const section of sections) {
            const top = section.getBoundingClientRect().top;
            if (top - offset <= 0) {
                currentId = section.id;
            } else {
                break;
            }
        }
        return currentId;
    };

    let ticking = false;
    let clickLockUntil = 0;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            if (Date.now() < clickLockUntil) {
                ticking = false;
                return;
            }
            setActiveTab(findCurrentSectionId());
            ticking = false;
        });
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', (e) => {
            const href = tab.getAttribute('href') || '';
            if (!href.startsWith('#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offset = getHeaderOffset();
            const y = window.pageYOffset + target.getBoundingClientRect().top - offset;
            // 클릭 직후 스크롤 스파이 덮어쓰기를 잠깐 막아 1회 클릭으로 즉시 활성화 유지
            clickLockUntil = Date.now() + 700;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveTab(target.id);
        });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('DOMContentLoaded', onScroll);
    onScroll();
})();
</script>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>