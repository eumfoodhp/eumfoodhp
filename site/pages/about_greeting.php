<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';
?>

<link rel="stylesheet" href="/css/sub.css">

<main id="sub_contents" class="greeting_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_about']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_greeting']; ?></span>
                </nav>
                
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['greeting_title']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['sub_banner_greeting_desc']; ?></p>
                </div>
            </div>

            <div class="sub_visual_img" style="background-image: url('/images/sub/tempo.png');">
                <!-- 서브 탭 메뉴 -->
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

<section class="ceo_intro_section">
    <div class="ceo_inner">
        <div class="ceo_main_group">
            <span class="ceo_tag"><?php echo $lang['greeting_ceo_intro']; ?></span>
            
            <div class="ceo_content_group">
                <div class="ceo_main_title">
                    <h3 class="light"><?php echo $lang['greeting_hello_1']; ?></h3>
                    <h3 class="bold"><?php echo $lang['greeting_hello_2']; ?></h3>
                </div>

                <p class="ceo_desc">
                    <?php echo nl2br($lang['greeting_ceo_text']); ?>
                </p>
            </div>
        </div>

        <div class="ceo_signature">
            <span class="ceo_label"><?php echo $lang['greeting_ceo_label']; ?></span>
            <strong class="ceo_name"><?php echo $lang['greeting_ceo_name']; ?></strong>
        </div>
    </div>
</section>
</main>

<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php';
?>