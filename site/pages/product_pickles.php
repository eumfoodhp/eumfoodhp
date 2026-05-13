<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';
?>

<link rel="stylesheet" href="/css/sub.css">
<link rel="stylesheet" href="/css/product_pickles.css">

<style id="product_pickles_responsive">
/**
 * 절임식품(product_pickles) 전용 반응형
 * 탭·상단 중앙 정렬 등: 모바일(max-width:735px) / 초소형(400px)만 적용.
 * PC(넓은 화면) 스타일은 product_pickles.css 기본 + sub.css를 따름.
 */

@media (max-width: 735px) {
    #sub_contents.product_pickles_page {
        overflow-x: hidden;
        width: 100%;
        max-width: 100vw;
        box-sizing: border-box;
    }

    #sub_contents.product_pickles_page .breadcrumb_wrap {
        margin-bottom: 16px;
        flex-wrap: wrap;
    }

    #sub_contents.product_pickles_page .sub_inner {
        padding-left: 16px;
        padding-right: 16px;
    }

    #sub_contents.product_pickles_page .sub_visual_img.product_pickles_hero_visual {
        min-height: 0 !important;
        height: auto !important;
        padding-bottom: 0 !important;
        background-image: none !important;
        background-color: transparent !important;
        border-radius: 0;
    }

    #sub_contents.product_pickles_page .sub_visual_img.product_pickles_hero_visual::after {
        display: none;
    }

    #sub_contents.product_pickles_page .sub_page_title {
        font-size: 30px;
        line-height: 40px;
        letter-spacing: -0.6px;
    }

    #sub_contents.product_pickles_page .sub_page_desc {
        font-size: 12px;
        line-height: 18px;
    }

    /* 탭: 좌우(sub_inner 패딩) 상쇄해 풀폭 + 그룹 중앙 정렬 */
    #sub_contents.product_pickles_page .sub_tab_container {
        position: static;
        width: calc(100% + 32px);
        max-width: none;
        left: auto;
        transform: none;
        bottom: auto;
        margin-left: -16px;
        margin-right: -16px;
        padding: 6px 0 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }

    #sub_contents.product_pickles_page .sub_tab_inner {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        width: fit-content;
        max-width: 100%;
        margin: 0 auto;
        padding: 5px 6px;
        gap: 4px;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        box-sizing: border-box;
    }

    #sub_contents.product_pickles_page .sub_tab_item {
        padding: 8px 10px;
        font-size: 13px;
        line-height: 1.4;
        flex: 0 0 auto;
        white-space: nowrap;
        text-align: center;
    }

    #sub_contents.product_pickles_page .product_list_section {
        width: 100% !important;
        max-width: 100%;
        box-sizing: border-box;
        padding: 48px 16px 56px;
        margin-left: auto;
        margin-right: auto;
        overflow-x: hidden;
    }

    #sub_contents.product_pickles_page .product_inner {
        width: 100% !important;
        max-width: 100%;
        margin: 0 auto;
        gap: 20px;
        padding-left: 0;
        padding-right: 0;
        box-sizing: border-box;
    }

    #sub_contents.product_pickles_page .product_top_area {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        margin-bottom: 20px;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-bottom: 0;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box;
        text-align: center;
    }

    #sub_contents.product_pickles_page .product_top_area .tit_group {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        align-items: center;
        text-align: center;
        gap: 6px;
    }

    #sub_contents.product_pickles_page .product_top_area .main_tit {
        font-size: 26px;
        line-height: 1.28;
        letter-spacing: -0.5px;
    }

    #sub_contents.product_pickles_page .product_top_area .sub_tit {
        font-size: 15px;
        line-height: 1.35;
    }

    #sub_contents.product_pickles_page .btn_download {
        margin-top: 16px;
        padding: 12px 20px;
        width: auto;
        max-width: 100%;
        justify-content: center;
        align-self: center;
        box-sizing: border-box;
    }

    #sub_contents.product_pickles_page .btn_download span {
        font-size: 13px;
        line-height: 20px;
    }

    #sub_contents.product_pickles_page .btn_download img {
        width: 16px;
        height: 16px;
    }

    #sub_contents.product_pickles_page .product_grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 26px 12px;
        width: 100%;
        margin-left: 0;
        margin-right: 0;
    }

    #sub_contents.product_pickles_page .product_card {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 10px;
    }

    #sub_contents.product_pickles_page .prod_img {
        height: 150px;
        border-radius: 10px;
        flex-shrink: 0;
    }

    #sub_contents.product_pickles_page .prod_info {
        gap: 10px;
        flex: 1;
        min-width: 0;
    }

    #sub_contents.product_pickles_page .name_row {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
    }

    #sub_contents.product_pickles_page .name_row h4 {
        font-size: 14px;
        line-height: 20px;
        letter-spacing: -0.3px;
        word-break: keep-all;
        overflow-wrap: break-word;
    }

    #sub_contents.product_pickles_page .name_row .en {
        font-size: 11px;
        line-height: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    #sub_contents.product_pickles_page .prod_info .desc {
        font-size: 12px;
        line-height: 18px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 0;
        max-height: none;
    }

    #sub_contents.product_pickles_page .spec_info {
        flex-wrap: wrap;
        gap: 6px 12px;
        margin-top: auto;
    }

    #sub_contents.product_pickles_page .spec_group {
        gap: 6px;
    }

    #sub_contents.product_pickles_page .spec_group .v_line {
        height: 12px;
    }

    #sub_contents.product_pickles_page .spec_group .spec_label,
    #sub_contents.product_pickles_page .spec_group .spec_val {
        font-size: 11px;
        line-height: 16px;
        letter-spacing: -0.2px;
    }
}

@media (max-width: 400px) {
    #sub_contents.product_pickles_page .sub_inner {
        padding-left: 12px;
        padding-right: 12px;
    }

    #sub_contents.product_pickles_page .sub_tab_container {
        width: calc(100% + 24px);
        margin-left: -12px;
        margin-right: -12px;
    }

    #sub_contents.product_pickles_page .breadcrumb .depth1,
    #sub_contents.product_pickles_page .breadcrumb .depth2 {
        font-size: 12px;
        line-height: 18px;
    }

    #sub_contents.product_pickles_page .sub_page_title {
        font-size: 26px;
        line-height: 34px;
    }

    #sub_contents.product_pickles_page .sub_tab_inner {
        width: fit-content;
        max-width: 100%;
        margin: 0 auto;
        padding: 4px 5px;
        gap: 3px;
        border-radius: 8px;
    }

    #sub_contents.product_pickles_page .sub_tab_item {
        padding: 6px 8px;
        font-size: 11px;
        line-height: 1.4;
        border-radius: 6px;
    }

    #sub_contents.product_pickles_page .product_list_section {
        padding: 40px 12px 48px;
    }

    #sub_contents.product_pickles_page .product_inner {
        width: 100% !important;
        max-width: 100%;
        padding-left: 0;
        padding-right: 0;
        box-sizing: border-box;
    }

    #sub_contents.product_pickles_page .product_top_area {
        gap: 6px;
        margin-bottom: 16px;
    }

    #sub_contents.product_pickles_page .product_top_area .tit_group {
        gap: 2px;
    }

    #sub_contents.product_pickles_page .product_top_area .main_tit {
        font-size: 22px;
        line-height: 30px;
    }

    #sub_contents.product_pickles_page .product_top_area .sub_tit {
        font-size: 14px;
        line-height: 22px;
    }

    #sub_contents.product_pickles_page .btn_download {
        margin-top: 12px;
        padding: 10px 14px;
        gap: 6px;
        align-self: center;
    }

    #sub_contents.product_pickles_page .btn_download span {
        font-size: 12px;
        line-height: 18px;
    }

    #sub_contents.product_pickles_page .product_grid {
        gap: 20px 10px;
        width: 100%;
    }

    #sub_contents.product_pickles_page .prod_img {
        height: 128px;
        border-radius: 8px;
    }

    #sub_contents.product_pickles_page .name_row h4 {
        font-size: 13px;
        line-height: 18px;
    }

    #sub_contents.product_pickles_page .name_row .en {
        font-size: 10px;
        line-height: 14px;
        -webkit-line-clamp: 2;
    }

    #sub_contents.product_pickles_page .prod_info .desc {
        font-size: 11px;
        line-height: 16px;
        -webkit-line-clamp: 3;
    }

    #sub_contents.product_pickles_page .spec_group {
        flex-wrap: wrap;
        row-gap: 2px;
    }

    #sub_contents.product_pickles_page .spec_group .spec_label,
    #sub_contents.product_pickles_page .spec_group .spec_val {
        font-size: 10px;
        line-height: 14px;
    }

    #sub_contents.product_pickles_page .spec_info {
        gap: 4px 8px;
    }
}

/* 360px 이하: 탭·카드 여백 최소화 */
@media (max-width: 360px) {
    #sub_contents.product_pickles_page .sub_tab_item {
        padding: 7px 5px;
        font-size: 10px;
        line-height: 15px;
    }

    #sub_contents.product_pickles_page .product_grid {
        gap: 16px 8px;
    }

    #sub_contents.product_pickles_page .prod_img {
        height: 118px;
    }
}
</style>

<main id="sub_contents" class="product_page product_pickles_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_product']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_prod_pickles']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_prod_pickles']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['fac_sub_desc']; ?></p>
                </div>
            </div>

            <div class="sub_visual_img product_pickles_hero_visual">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/product_pickles.php" class="sub_tab_item active"><?php echo $lang['sub_prod_pickles']; ?></a>
                        <a href="/pages/product_braised.php" class="sub_tab_item"><?php echo $lang['sub_prod_braised']; ?></a>
                        <a href="/pages/product_namul.php" class="sub_tab_item"><?php echo $lang['sub_prod_namul']; ?></a>
                        <a href="/pages/product_salted.php" class="sub_tab_item"><?php echo $lang['sub_prod_salted']; ?></a>
                        <a href="/pages/product_sauce.php" class="sub_tab_item"><?php echo $lang['sub_prod_sauce']; ?></a>
                        <a href="/pages/product_tea.php" class="sub_tab_item"><?php echo $lang['sub_prod_tea']; ?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="product_list_section">
        <div class="product_inner">
            <div class="product_top_area">
                <div class="tit_group">
                    <span class="sub_tit"><?php echo $lang['prod_pickles_sub_tit']; ?></span>
                    <h3 class="main_tit"><?php echo $lang['prod_pickles_main_tit']; ?></h3>
                </div>
                <a href="/download/product_catalog.pdf" class="btn_download" download>
                    <span><?php echo $lang['btn_product_intro']; ?></span>
                    <img src="/images/sub/download.png" alt="">
                </a>
            </div>

            <div class="product_grid">
                <?php
                /** 표시 순서: Figma 291:7410 첫 행 ~ 291:7430 마지막 행(오이지무침·락교)까지 동일 */
                $pickles_display_order = [9, 1, 3, 2, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18];
                foreach ($pickles_display_order as $slot_index => $pick_id) :
                    $img_num = $slot_index + 1;
                    $num = str_pad((string) $pick_id, 2, '0', STR_PAD_LEFT);
                    ?>
                <div class="product_card">
                    <div class="prod_img" style="background-image: url('/images/sub/prod1-<?php echo (int) $img_num; ?>.png');"></div>
                    <div class="prod_info">
                        <div class="name_group">
                            <div class="name_row">
                                <h4><?php echo $lang['prod_pickles_' . $num . '_name']; ?></h4>
                                <span class="en"><?php echo $lang['prod_pickles_' . $num . '_en']; ?></span>
                            </div>
                            <p class="desc"><?php echo $lang['prod_pickles_' . $num . '_desc']; ?></p>
                        </div>
                        <div class="spec_info">
                            <div class="spec_group">
                                <span class="spec_label"><?php echo $lang['prod_spec_storage']; ?></span>
                                <i class="v_line"></i>
                                <span class="spec_val"><?php echo $lang['prod_spec_refrigerated']; ?></span>
                            </div>
                            <div class="spec_group">
                                <span class="spec_label"><?php echo $lang['prod_spec_package']; ?></span>
                                <i class="v_line"></i>
                                <span class="spec_val"><?php echo $lang['prod_spec_unit_1kg']; ?></span>
                            </div>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    var observerOptions = { threshold: 0.2, rootMargin: '0px 0px -8% 0px' };
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is_visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product_pickles_page .product_card').forEach(function(card) {
        observer.observe(card);
    });
});
</script>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
