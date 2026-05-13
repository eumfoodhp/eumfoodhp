<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

$loc_map_hl = $_SESSION['lang'] === 'zh' ? 'zh-CN' : $_SESSION['lang'];
$loc_factory_map_src = 'https://maps.google.com/maps?q=' . rawurlencode($lang['loc_factory_addr']) . '&hl=' . rawurlencode($loc_map_hl) . '&z=16&output=embed';
?>

<link rel="stylesheet" href="/css/sub.css">
<link rel="stylesheet" href="/css/about_location.css">

<main id="sub_contents" class="location_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_about']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['loc_title']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['loc_title']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['loc_sub_banner_desc']; ?></p>
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

    <section class="location_content_section">
        <div class="sub_inner location_inner">
            
            <div class="location_row">
                <div class="map_area" id="map_yongin">
                    <iframe
                        src="<?php echo htmlspecialchars($loc_factory_map_src, ENT_QUOTES, 'UTF-8'); ?>"
                        width="100%"
                        height="100%"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        title="<?php echo htmlspecialchars($lang['loc_map_factory_alt'], ENT_QUOTES, 'UTF-8'); ?>">
                    </iframe>
                </div>
                <div class="info_area">
                    <div class="loc_heading">
                        <span class="loc_cate"><?php echo $lang['loc_way_to_come']; ?></span>
                        <h3 class="loc_name"><?php echo $lang['loc_factory_title']; ?></h3>
                    </div>
                    
                    <ul class="loc_detail_list">
                        <li class="loc_detail_row">
                            <span class="label"><?php echo $lang['loc_factory_addr_label']; ?></span>
                            <span class="loc_pipe" aria-hidden="true"></span>
                            <p class="content"><?php echo $lang['loc_factory_addr']; ?></p>
                        </li>
                        <li class="loc_detail_row loc_detail_row--tel">
                            <span class="label"><?php echo $lang['loc_factory_tel_label']; ?></span>
                            <span class="loc_pipe" aria-hidden="true"></span>
                            <div class="loc_tel_wrap">
                                <span class="loc_tel_item"><?php echo $lang['loc_tel_quality']; ?></span>
                                <span class="loc_tel_item"><?php echo $lang['loc_tel_sales']; ?></span>
                                <span class="loc_tel_item"><?php echo $lang['loc_tel_purchase']; ?></span>
                                <span class="loc_tel_item"><?php echo $lang['loc_tel_rd']; ?></span>
                                <span class="loc_tel_item"><?php echo $lang['loc_tel_mgmt']; ?></span>
                            </div>
                        </li>
                        <li class="loc_detail_row">
                            <span class="label"><?php echo $lang['loc_factory_fax_label']; ?></span>
                            <span class="loc_pipe" aria-hidden="true"></span>
                            <p class="content"><?php echo $lang['loc_factory_fax']; ?></p>
                        </li>
                    </ul>

                    <div class="qr_section">
                        <div class="qr_label_row">
                            <span class="qr_label"><?php echo $lang['loc_qr_label']; ?></span>
                            <span class="loc_pipe" aria-hidden="true"></span>
                        </div>
                        <div class="qr_group">
                            <div class="qr_item qr_item--mapimg">
                                <img class="qr_img" src="/images/sub/kakao1.jpg" alt="<?php echo htmlspecialchars($lang['loc_qr_kakao'], ENT_QUOTES, 'UTF-8'); ?>" loading="lazy" decoding="async">
                                <span><?php echo $lang['loc_qr_kakao']; ?></span>
                            </div>
                            <div class="qr_item qr_item--mapimg">
                                <img class="qr_img" src="/images/sub/naver1.jpg" alt="<?php echo htmlspecialchars($lang['loc_qr_naver'], ENT_QUOTES, 'UTF-8'); ?>" loading="lazy" decoding="async">
                                <span><?php echo $lang['loc_qr_naver']; ?></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
