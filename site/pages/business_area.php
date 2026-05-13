<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';
?>

<link rel="stylesheet" href="/css/sub.css">
<link rel="stylesheet" href="/css/business_area.css">

<main id="sub_contents" class="business_area_page">
    <!-- 서브 비주얼 섹션 -->
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_business']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_biz_area']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['biz_title']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['biz_sub_desc']; ?></p>
                </div>
            </div>
            <!-- 메인 히어로 이미지 반영 -->
            <div class="sub_visual_img business_hero_visual">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/business_area.php" class="sub_tab_item active"><?php echo $lang['sub_biz_area']; ?></a>
                        <a href="/pages/business_facility.php" class="sub_tab_item"><?php echo $lang['sub_facility']; ?></a>
                        <a href="/pages/business_process.php" class="sub_tab_item"><?php echo $lang['sub_biz_process']; ?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 섹션 1: Overview -->
    <section class="biz_overview_section">
        <div class="sub_inner biz_ov_inner">
            <!-- 좌측: 텍스트 영역 -->
            <div class="ov_left">
                <span class="ov_cate"><?php echo $lang['biz_ov_cate']; ?></span>
                <h3 class="ov_title">
                    <span class="ov_line ov_line--bold"><?php echo $lang['biz_ov_line1']; ?></span>
                    <span class="ov_line ov_line--light"><?php echo $lang['biz_ov_line2']; ?></span>
                    <span class="ov_line ov_line--light"><?php echo $lang['biz_ov_line3']; ?></span>
                </h3>
            </div>

            <!-- 우측: 통계 아이콘 영역 -->
            <div class="ov_right">
                <div class="stat_grid">
                    <div class="stat_item">
                        <div class="stat_label">
                            <img src="/images/sub/bus-icon1.png" alt="icon">
                            <span><?php echo $lang['biz_stat_label1']; ?></span>
                        </div>
                        <div class="stat_value">
                            <strong><?php echo $lang['biz_stat_value1']; ?></strong>
                            <span><?php echo $lang['biz_stat_unit1']; ?></span>
                        </div>
                    </div>
                    <div class="stat_item">
                        <div class="stat_label">
                            <img src="/images/sub/bus-icon2.png" alt="icon">
                            <span><?php echo $lang['biz_stat_label2']; ?></span>
                        </div>
                        <div class="stat_value">
                            <strong><?php echo $lang['biz_stat_value2']; ?></strong>
                            <span><?php echo $lang['biz_stat_unit2']; ?></span>
                        </div>
                    </div>
                    <div class="stat_item">
                        <div class="stat_label">
                            <img src="/images/sub/bus-icon3.png" alt="icon">
                            <span><?php echo $lang['biz_stat_label3']; ?></span>
                        </div>
                        <div class="stat_value">
                            <strong><?php echo $lang['biz_stat_value3']; ?></strong>
                            <span><?php echo $lang['biz_stat_unit3']; ?></span>
                        </div>
                    </div>
                    <div class="stat_item">
                        <div class="stat_label">
                            <img src="/images/sub/bus-icon4.png" alt="icon">
                            <span><?php echo $lang['biz_stat_label4']; ?></span>
                        </div>
                        <div class="stat_value">
                            <strong><?php echo $lang['biz_stat_value4']; ?></strong>
                            <span><?php echo $lang['biz_stat_unit4']; ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- 섹션 2: Business Areas -->
    <section class="biz_area_detail_section">
        <div class="sub_inner biz_area_container">
            <div class="biz_area_header">
                <span class="area_cate"><?php echo $lang['biz_area_cate']; ?></span>
                <h2 class="area_title"><?php echo $lang['biz_area_title']; ?></h2>
            </div>

            <div class="biz_area_list">
                <!-- Item 01: Image Left, Text Right -->
                <div class="area_item">
                    <div class="area_img" style="background-image: url('/images/sub/bus-img1.png');"></div>
                    <div class="area_text_wrap">
                        <div class="area_text_head">
                            <div class="area_label_row">
                                <span class="num"><?php echo $lang['biz_item_num1']; ?></span>
                                <span class="sub_ttl"><?php echo $lang['biz_item_sub1']; ?></span>
                            </div>
                            <h3 class="main_ttl"><?php echo $lang['biz_item_ttl1']; ?></h3>
                        </div>
                        <p class="desc"><?php echo nl2br($lang['biz_item_desc1']); ?></p>
                    </div>
                </div>

                <!-- Item 02: Text Left, Image Right (Reverse) -->
                <div class="area_item reverse">
                    <div class="area_img" style="background-image: url('/images/sub/bus-img2.png');"></div>
                    <div class="area_text_wrap">
                        <div class="area_text_head">
                            <div class="area_label_row">
                                <span class="num"><?php echo $lang['biz_item_num2']; ?></span>
                                <span class="sub_ttl"><?php echo $lang['biz_item_sub2']; ?></span>
                            </div>
                            <h3 class="main_ttl"><?php echo $lang['biz_item_ttl2']; ?></h3>
                        </div>
                        <p class="desc"><?php echo nl2br($lang['biz_item_desc2']); ?></p>
                    </div>
                </div>

                <!-- Item 03: Image Left, Text Right -->
                <div class="area_item">
                    <div class="area_img" style="background-image: url('/images/sub/bus-img3.png');"></div>
                    <div class="area_text_wrap">
                        <div class="area_text_head">
                            <div class="area_label_row">
                                <span class="num"><?php echo $lang['biz_item_num3']; ?></span>
                                <span class="sub_ttl"><?php echo $lang['biz_item_sub3']; ?></span>
                            </div>
                            <h3 class="main_ttl"><?php echo $lang['biz_item_ttl3']; ?></h3>
                        </div>
                        <p class="desc"><?php echo nl2br($lang['biz_item_desc3']); ?></p>
                    </div>
                </div>

                <!-- Item 04: Text Left, Image Right (Reverse) -->
                <div class="area_item reverse">
                    <div class="area_img" style="background-image: url('/images/sub/bus-img4.png');"></div>
                    <div class="area_text_wrap">
                        <div class="area_text_head">
                            <div class="area_label_row">
                                <span class="num"><?php echo $lang['biz_item_num4']; ?></span>
                                <span class="sub_ttl"><?php echo $lang['biz_item_sub4']; ?></span>
                            </div>
                            <h3 class="main_ttl"><?php echo $lang['biz_item_ttl4']; ?></h3>
                        </div>
                        <p class="desc"><?php echo nl2br($lang['biz_item_desc4']); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>