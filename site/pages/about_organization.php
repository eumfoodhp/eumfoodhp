<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';
?>

<link rel="stylesheet" href="/css/sub.css">
<link rel="stylesheet" href="/css/about_organization.css">

<main id="sub_contents" class="organization_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_about']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_tab_org']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['org_title']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['org_sub_banner_desc']; ?></p>
                </div>
            </div>
            <div class="sub_visual_img" style="background-image: url('/images/sub/tempo.png');">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/about_greeting.php"
                        class="sub_tab_item <?php echo (basename($_SERVER['PHP_SELF']) == 'about_greeting.php') ? 'active' : ''; ?>">
                        <?php echo $lang['sub_tab_greeting']; ?>
                        </a>

                        <a href="/pages/about_history.php"
                        class="sub_tab_item <?php echo (basename($_SERVER['PHP_SELF']) == 'about_history.php') ? 'active' : ''; ?>">
                        <?php echo $lang['sub_tab_history']; ?>
                        </a>

                        <a href="/pages/about_cert.php"
                        class="sub_tab_item <?php echo (basename($_SERVER['PHP_SELF']) == 'about_cert.php') ? 'active' : ''; ?>">
                        <?php echo $lang['sub_tab_cert']; ?>
                        </a>

                        <a href="/pages/about_organization.php"
                        class="sub_tab_item <?php echo (basename($_SERVER['PHP_SELF']) == 'about_organization.php') ? 'active' : ''; ?>">
                        <?php echo $lang['sub_tab_org']; ?>
                        </a>

                        <a href="/pages/about_location.php"
                        class="sub_tab_item <?php echo (basename($_SERVER['PHP_SELF']) == 'about_location.php') ? 'active' : ''; ?>">
                        <?php echo $lang['sub_tab_direction']; ?>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="org_content_section">
        <div class="org_container">
            <div class="org_chart_wrap">
                <div class="org_chart_image_wrap">
                    <?php
                    // 언어별 조직도: lang 키가 서버에 없어도 세션만 맞으면 바뀌도록 매핑 (카페24 등 구버전 lang 대비)
                    $__lc = isset($_SESSION['lang']) && in_array($_SESSION['lang'], ['ko', 'en', 'zh'], true)
                        ? $_SESSION['lang']
                        : 'ko';
                    $__orgMap = [
                        'ko' => '/images/sub/org-chart-v3.png',
                        'en' => '/images/sub/org-chart-en.png',
                        'zh' => '/images/sub/org-chart-zh.png',
                    ];
                    $orgChartRel = !empty($lang['org_chart_image'])
                        ? $lang['org_chart_image']
                        : ($__orgMap[$__lc] ?? $__orgMap['ko']);
                    $orgAbs = $_SERVER['DOCUMENT_ROOT'] . $orgChartRel;
                    $orgChartSrc = $orgChartRel;
                    if (is_file($orgAbs)) {
                        $orgChartSrc .= '?v=' . (int) filemtime($orgAbs);
                    }
                    ?>
                    <img
                        src="<?php echo htmlspecialchars($orgChartSrc, ENT_QUOTES, 'UTF-8'); ?>"
                        alt="<?php echo htmlspecialchars($lang['org_title'], ENT_QUOTES, 'UTF-8'); ?>"
                        class="org_chart_image"
                        loading="lazy"
                    >
                </div>
            </div>

            <div class="org_bg_typo">
                <?php echo $lang['org_bg_text']; ?>
            </div>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
