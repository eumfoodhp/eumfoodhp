<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';
?>

<link rel="stylesheet" href="/css/sub.css">
<link rel="stylesheet" href="/css/about_cert.css">
<style>
@media (max-width: 1024px) {
    #sub_contents.cert_page .cert_container {
        padding: 84px 32px 0 !important;
        gap: 44px !important;
    }
    #sub_contents.cert_page .cert_top {
        gap: 32px !important;
        align-items: flex-start !important;
    }
    #sub_contents.cert_page .top_left,
    #sub_contents.cert_page .top_right {
        width: 100% !important;
        max-width: none !important;
    }
    #sub_contents.cert_page .cert_grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 20px !important;
    }
}

@media (max-width: 735px) {
    #sub_contents.cert_page {
        overflow-x: hidden !important;
    }
    #sub_contents.cert_page .cert_top {
        flex-direction: column !important;
        align-items: flex-start !important;
    }
    #sub_contents.cert_page .cert_container {
        padding: 62px 20px 0 !important;
        gap: 32px !important;
    }
    #sub_contents.cert_page .top_left,
    #sub_contents.cert_page .top_right {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }
    #sub_contents.cert_page .cert_grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 16px !important;
    }
}

@media (max-width: 375px) {
    #sub_contents.cert_page .cert_container {
        padding: 48px 14px 0 !important;
        gap: 24px !important;
    }
    #sub_contents.cert_page .cert_grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
    }
    #sub_contents.cert_page .cert_img_box {
        height: 200px !important;
    }
    #sub_contents.cert_page .cert_img_inner {
        width: 108px !important;
        height: 144px !important;
    }
}
</style>

<main id="sub_contents" class="cert_page">
    <!-- 서브 비주얼 섹션 -->
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_about']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_tab_cert']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['cert_title']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['sub_banner_cert_desc']; ?></p>
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

    <!-- 인증 컨텐츠 섹션 -->
    <section class="cert_content_section">
        <div class="sub_inner">
            <div class="cert_container">
                
                <!-- 상단 영역 -->
                <div class="cert_top">
                    <div class="top_left">
                        <span class="category_label"><?php echo $lang['cert_cate_label']; ?></span>
                        <h3 class="cert_main_title">
                            <span class="cert_main_title_l1"><?php echo $lang['cert_main_tit_1']; ?></span><br>
                            <span class="cert_main_title_l2"><?php echo $lang['cert_main_tit_2']; ?></span>
                        </h3>
                        <div class="haccp_icon_wrap">
                            <img src="/images/sub/cert/cert-haccp-mark.png" alt="HACCP MAFRA 인증 마크" class="haccp_icon" width="107" height="107">
                        </div>
                    </div>
                    
                    <div class="top_right">
                        <div class="cert_top_group">
                            <h4 class="sub_bold_title"><?php echo $lang['cert_sub_tit']; ?></h4>
                            <p class="cert_desc"><?php echo $lang['cert_desc']; ?></p>
                        </div>
                        
                        <div class="haccp_benefit">
                            <h5 class="benefit_title"><?php echo $lang['cert_benefit_tit']; ?></h5>
                            <ul>
                                <li><?php echo $lang['cert_benefit_1']; ?></li>
                                <li><?php echo $lang['cert_benefit_2']; ?></li>
                                <li><?php echo $lang['cert_benefit_3']; ?></li>
                                <li><?php echo $lang['cert_benefit_4']; ?></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 하단 영역 (인증서 리스트) -->
                <div class="cert_bottom">
                    <div class="cert_grid">
                        <?php
                        $certs = [
                            ['title' => $lang['cert_name_1'], 'img' => '/images/sub/cert/cert-01-pickles.png'],
                            ['title' => $lang['cert_name_2'], 'img' => '/images/sub/cert/cert-02-braise.png'],
                            ['title' => $lang['cert_name_3'], 'img' => '/images/sub/cert/cert-03-salted.png'],
                            ['title' => $lang['cert_name_4'], 'img' => '/images/sub/cert/cert-04-jeotgal.png'],
                            ['title' => $lang['cert_name_5'], 'img' => '/images/sub/cert/cert-05-sauce.png'],
                            ['title' => $lang['cert_name_6'], 'img' => '/images/sub/cert/cert-06-mix.png'],
                            ['title' => $lang['cert_name_7'], 'img' => '/images/sub/cert/cert-07-tea.png'],
                            ['title' => $lang['cert_name_8'], 'img' => '/images/sub/cert/cert-08-tax.png'],
                            ['title' => $lang['cert_name_9'], 'img' => '/images/sub/cert/cert-09-master.png'],
                        ];

                        foreach ($certs as $item):
                        ?>
                        <div class="cert_card">
                            <div class="cert_img_box">
                                <div class="cert_img_inner">
                                    <?php if (!empty($item['img'])): ?>
                                        <img src="<?php echo htmlspecialchars($item['img'], ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars(strip_tags($item['title']), ENT_QUOTES, 'UTF-8'); ?>" onerror="this.onerror=null;this.src='/images/sub/cert/cert-haccp-mark.png';">
                                    <?php else: ?>
                                        <span class="temp_txt"><?php echo $lang['cert_preparing']; ?></span>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <div class="cert_info">
                                <p class="cert_name"><?php echo $item['title']; ?></p>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>

            </div>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>