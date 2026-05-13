<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';

if (isset($_GET['lang'])) {
    $_SESSION['lang'] = $_GET['lang'];
}

$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'ko';
$lang_file = $_SERVER['DOCUMENT_ROOT'] . '/lang/' . $current_lang . '.php'; 

if (file_exists($lang_file)) {
    include_once $lang_file;
} else {
    include_once $_SERVER['DOCUMENT_ROOT'] . '/lang/ko.php';
}
?>
<!DOCTYPE html>
<html lang="<?php echo $current_lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>㈜이음푸드시스템</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <link rel="stylesheet" href="/css/common.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
</head>
<body>
    <header id="header">
        <div class="header_inner">
            <h1 class="logo">
                <a href="/index.php">
                    <img src="/images/common/logo.png" alt="㈜이음푸드시스템 로고">
                </a>
            </h1>

            <!-- PC: GNB만 묶음 / 메가는 #header 하단에 두어 헤더와 겹치지 않음 -->
            <div class="gnb_wrap">
                <nav class="gnb" aria-label="PC navigation">
                    <div class="gnb_grid">
                        <a href="#" class="gnb_main_link"><span><?php echo $lang['menu_about']; ?></span></a>
                        <a href="#" class="gnb_main_link"><span><?php echo $lang['menu_business'] ?? '사업영역'; ?></span></a>
                        <a href="#" class="gnb_main_link"><span><?php echo $lang['menu_product']; ?></span></a>
                        <a href="#" class="gnb_main_link"><span><?php echo $lang['menu_news'] ?? '뉴스룸'; ?></span></a>
                        <a href="#" class="gnb_main_link"><span><?php echo $lang['menu_support']; ?></span></a>
                    </div>
                </nav>
                <!-- 메가: GNB와 동일 박스 → 회사소개 열 = 회사소개 바로 아래 / 배경은 100vw -->
                <div class="mega_panel">
                    <div class="mega_menu_backdrop" aria-hidden="true"></div>
                    <div class="mega_panel_inner">
                        <div class="mega_col mega_c1">
                            <ul class="mega_sub_list">
                                <li><a href="/pages/about_greeting.php"><?php echo $lang['sub_greeting']; ?></a></li>
                                <li><a href="/pages/about_history.php"><?php echo $lang['sub_history']; ?></a></li>
                                <li><a href="/pages/about_cert.php"><?php echo $lang['sub_cert']; ?></a></li>
                                <li><a href="/pages/about_organization.php"><?php echo $lang['sub_org']; ?></a></li>
                                <li><a href="/pages/about_location.php"><?php echo $lang['sub_location']; ?></a></li>
                            </ul>
                        </div>
                        <div class="mega_col mega_c2">
                            <ul class="mega_sub_list">
                                <li><a href="/pages/business_area.php"><?php echo $lang['sub_biz_area'] ?? '사업영역'; ?></a></li>
                                <li><a href="/pages/business_facility.php"><?php echo $lang['sub_facility'] ?? '시설현황'; ?></a></li>
                                <li><a href="/pages/business_process.php"><?php echo $lang['sub_biz_process'] ?? '제조공정 소개'; ?></a></li>
                            </ul>
                        </div>
                        <div class="mega_col mega_c3">
                            <ul class="mega_sub_list">
                                <li><a href="/pages/product_pickles.php"><?php echo $lang['sub_prod_pickles']; ?></a></li>
                                <li><a href="/pages/product_braised.php"><?php echo $lang['sub_prod_braised']; ?></a></li>
                                <li><a href="/pages/product_namul.php"><?php echo $lang['sub_prod_namul']; ?></a></li>
                                <li><a href="/pages/product_salted.php"><?php echo $lang['sub_prod_salted']; ?></a></li>
                                <li><a href="/pages/product_sauce.php"><?php echo $lang['sub_prod_sauce']; ?></a></li>
                                <li><a href="/pages/product_tea.php"><?php echo $lang['sub_prod_tea']; ?></a></li>
                            </ul>
                        </div>
                        <div class="mega_col mega_c4">
                            <ul class="mega_sub_list">
                                <li><a href="/pages/notice_list.php"><?php echo $lang['sub_notice']; ?></a></li>
                                <li><a href="/pages/news_press.php"><?php echo $lang['sub_news_press'] ?? '보도자료'; ?></a></li>
                                <li><a href="/pages/board_list.php"><?php echo $lang['sub_board']; ?></a></li>
                            </ul>
                        </div>
                        <div class="mega_col mega_c5">
                            <ul class="mega_sub_list">
                                <li><a href="/pages/contact.php"><?php echo $lang['sub_inquiry_1to1'] ?? '1:1문의'; ?></a></li>
                                <li><a href="/pages/contact_sales.php"><?php echo $lang['sub_inquiry_sales'] ?? '영업문의'; ?></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="util_area">
                <a href="/pages/contact.php" class="btn_inquiry">
                    <span><?php echo $lang['menu_inquiry'] ?? '문의하기'; ?></span>
                </a>
                <div class="lang_wrap">
                    <button type="button" class="lang_toggle_btn">
                        <img src="/images/common/lang.png" alt="Language">
                    </button>
                    <ul class="lang_list">
                        <li><a href="?lang=ko">KO</a></li>
                        <li><a href="?lang=en">EN</a></li>
                        <li><a href="?lang=zh">ZH</a></li>
                    </ul>
                </div>
                <button type="button" class="mo_menu_btn">
                    <img src="/images/common/mo.png" alt="Mobile Menu">
                </button>
            </div>

            <!-- 모바일 네비게이션 (수정본) -->
            <div id="mo_nav" class="full_menu_overlay">
                <div class="menu_container">
                    <div class="mo_nav_top">
                        <button type="button" class="mo_close_btn">&times;</button>
                    </div>

                    <div class="menu_wrapper">
                        <div class="menu_group">
                            <button type="button" class="menu_dep1 mo_menu_title" aria-expanded="false">
                                <h3><?php echo $lang['menu_about']; ?></h3>
                                <span class="mo_plus" aria-hidden="true">+</span>
                            </button>
                            <ul class="menu_dep2 mo_sub_menu">
                                <li><a href="/pages/about_greeting.php"><?php echo $lang['sub_greeting']; ?></a></li>
                                <li><a href="/pages/about_history.php"><?php echo $lang['sub_history']; ?></a></li>
                                <li><a href="/pages/about_cert.php"><?php echo $lang['sub_cert']; ?></a></li>
                                <li><a href="/pages/about_organization.php"><?php echo $lang['sub_org']; ?></a></li>
                                <li><a href="/pages/about_location.php"><?php echo $lang['sub_location']; ?></a></li>
                            </ul>
                        </div>
                        <div class="menu_group">
                            <button type="button" class="menu_dep1 mo_menu_title" aria-expanded="false">
                                <h3><?php echo $lang['menu_business'] ?? '사업영역'; ?></h3>
                                <span class="mo_plus" aria-hidden="true">+</span>
                            </button>
                            <ul class="menu_dep2 mo_sub_menu">
                                <li><a href="/pages/business_area.php"><?php echo $lang['sub_biz_area'] ?? '사업영역'; ?></a></li>
                                <li><a href="/pages/business_facility.php"><?php echo $lang['sub_facility'] ?? '시설현황'; ?></a></li>
                                <li><a href="/pages/business_process.php"><?php echo $lang['sub_biz_process'] ?? '제조공정 소개'; ?></a></li>
                            </ul>
                        </div>
                        <div class="menu_group">
                            <button type="button" class="menu_dep1 mo_menu_title" aria-expanded="false">
                                <h3><?php echo $lang['menu_product']; ?></h3>
                                <span class="mo_plus" aria-hidden="true">+</span>
                            </button>
                            <ul class="menu_dep2 mo_sub_menu">
                                <li><a href="/pages/product_pickles.php"><?php echo $lang['sub_prod_pickles']; ?></a></li>
                                <li><a href="/pages/product_braised.php"><?php echo $lang['sub_prod_braised']; ?></a></li>
                                <li><a href="/pages/product_namul.php"><?php echo $lang['sub_prod_namul']; ?></a></li>
                                <li><a href="/pages/product_salted.php"><?php echo $lang['sub_prod_salted']; ?></a></li>
                                <li><a href="/pages/product_sauce.php"><?php echo $lang['sub_prod_sauce']; ?></a></li>
                                <li><a href="/pages/product_tea.php"><?php echo $lang['sub_prod_tea']; ?></a></li>
                            </ul>
                        </div>
                        <div class="menu_group">
                            <button type="button" class="menu_dep1 mo_menu_title" aria-expanded="false">
                                <h3><?php echo $lang['menu_news'] ?? '뉴스룸'; ?></h3>
                                <span class="mo_plus" aria-hidden="true">+</span>
                            </button>
                            <ul class="menu_dep2 mo_sub_menu">
                                <li><a href="/pages/notice_list.php"><?php echo $lang['sub_notice']; ?></a></li>
                                <li><a href="/pages/news_press.php"><?php echo $lang['sub_news_press'] ?? '보도자료'; ?></a></li>
                                <li><a href="/pages/board_list.php"><?php echo $lang['sub_board']; ?></a></li>
                            </ul>
                        </div>
                        <div class="menu_group">
                            <button type="button" class="menu_dep1 mo_menu_title" aria-expanded="false">
                                <h3><?php echo $lang['menu_support']; ?></h3>
                                <span class="mo_plus" aria-hidden="true">+</span>
                            </button>
                            <ul class="menu_dep2 mo_sub_menu">
                                <li><a href="/pages/contact.php"><?php echo $lang['sub_inquiry_1to1'] ?? '1:1문의'; ?></a></li>
                                <li><a href="/pages/contact_sales.php"><?php echo $lang['sub_inquiry_sales'] ?? '영업문의'; ?></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mo_overlay"></div>
        </div>
    </header>