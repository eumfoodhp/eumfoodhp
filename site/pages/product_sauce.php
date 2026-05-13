<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';
?>

<link rel="stylesheet" href="/css/sub.css">
<link rel="stylesheet" href="/css/product_sauce.css">

<style id="product_sauce_responsive">
/**
 * 소스(product_sauce) 전용 반응형
 * 탭·상단 중앙 정렬 등: 모바일(max-width:735px) / 초소형(400px)만 적용.
 * PC(넓은 화면) 스타일은 product_sauce.css 기본 + sub.css를 따름.
 */

@media (max-width: 735px) {
    #sub_contents.product_sauce_page {
        overflow-x: hidden;
        width: 100%;
        max-width: 100vw;
        box-sizing: border-box;
    }

    #sub_contents.product_sauce_page .breadcrumb_wrap {
        margin-bottom: 16px;
        flex-wrap: wrap;
    }

    #sub_contents.product_sauce_page .sub_inner {
        padding-left: 16px;
        padding-right: 16px;
    }

    #sub_contents.product_sauce_page .sub_visual_img.product_sauce_hero_visual {
        min-height: 0 !important;
        height: auto !important;
        padding-bottom: 0 !important;
        background-image: none !important;
        background-color: transparent !important;
        border-radius: 0;
    }

    #sub_contents.product_sauce_page .sub_visual_img.product_sauce_hero_visual::after {
        display: none;
    }

    #sub_contents.product_sauce_page .sub_page_title {
        font-size: 30px;
        line-height: 40px;
        letter-spacing: -0.6px;
    }

    #sub_contents.product_sauce_page .sub_page_desc {
        font-size: 12px;
        line-height: 18px;
    }

    /* 탭: 좌우(sub_inner 패딩) 상쇄해 풀폭 + 그룹 중앙 정렬 */
    #sub_contents.product_sauce_page .sub_tab_container {
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

    #sub_contents.product_sauce_page .sub_tab_inner {
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

    #sub_contents.product_sauce_page .sub_tab_item {
        padding: 8px 10px;
        font-size: 13px;
        line-height: 1.4;
        flex: 0 0 auto;
        white-space: nowrap;
        text-align: center;
    }

    #sub_contents.product_sauce_page .product_list_section {
        width: 100% !important;
        max-width: 100%;
        box-sizing: border-box;
        padding: 48px 16px 56px;
        margin-left: auto;
        margin-right: auto;
        overflow-x: hidden;
    }

    #sub_contents.product_sauce_page .product_inner {
        width: 100% !important;
        max-width: 100%;
        margin: 0 auto;
        gap: 20px;
        padding-left: 0;
        padding-right: 0;
        box-sizing: border-box;
    }

    #sub_contents.product_sauce_page .product_top_area {
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

    #sub_contents.product_sauce_page .product_top_area .tit_group {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        align-items: center;
        text-align: center;
        gap: 6px;
    }

    #sub_contents.product_sauce_page .product_top_area .main_tit {
        font-size: 26px;
        line-height: 1.28;
        letter-spacing: -0.5px;
    }

    #sub_contents.product_sauce_page .product_top_area .sub_tit {
        font-size: 15px;
        line-height: 1.35;
    }

    #sub_contents.product_sauce_page .btn_download {
        margin-top: 16px;
        padding: 12px 20px;
        width: auto;
        max-width: 100%;
        justify-content: center;
        align-self: center;
        box-sizing: border-box;
    }

    #sub_contents.product_sauce_page .btn_download span {
        font-size: 13px;
        line-height: 20px;
    }

    #sub_contents.product_sauce_page .btn_download img {
        width: 16px;
        height: 16px;
    }

    #sub_contents.product_sauce_page .product_grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 26px 12px;
        width: 100%;
        margin-left: 0;
        margin-right: 0;
    }

    #sub_contents.product_sauce_page .product_card {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 10px;
    }

    #sub_contents.product_sauce_page .prod_img {
        height: 150px;
        border-radius: 10px;
        flex-shrink: 0;
    }

    #sub_contents.product_sauce_page .prod_info {
        gap: 10px;
        flex: 1;
        min-width: 0;
    }

    #sub_contents.product_sauce_page .name_row {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
    }

    #sub_contents.product_sauce_page .name_row h4 {
        font-size: 14px;
        line-height: 20px;
        letter-spacing: -0.3px;
        word-break: keep-all;
        overflow-wrap: break-word;
    }

    #sub_contents.product_sauce_page .name_row .en {
        font-size: 11px;
        line-height: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    #sub_contents.product_sauce_page .prod_info .desc {
        font-size: 12px;
        line-height: 18px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 0;
        max-height: none;
    }

    #sub_contents.product_sauce_page .spec_info {
        flex-wrap: wrap;
        gap: 6px 12px;
        margin-top: auto;
    }

    #sub_contents.product_sauce_page .spec_group {
        gap: 6px;
    }

    #sub_contents.product_sauce_page .spec_group .v_line {
        height: 12px;
    }

    #sub_contents.product_sauce_page .spec_group .spec_label,
    #sub_contents.product_sauce_page .spec_group .spec_val {
        font-size: 11px;
        line-height: 16px;
        letter-spacing: -0.2px;
    }
    #sub_contents.product_sauce_page .sauce_section {
        padding: 48px 0 72px;
        gap: 48px;
        box-sizing: border-box;
    }

    #sub_contents.product_sauce_page .sauce_top_left {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
    }

    #sub_contents.product_sauce_page .sauce_top_left .tit_group {
        align-items: center;
        text-align: center;
        margin-right: 0;
    }

    #sub_contents.product_sauce_page .sauce_note {
        display: none;
    }

    #sub_contents.product_sauce_page .sauce_note_mobile {
        display: block;
        color: #aaa;
        font-size: 11px;
        line-height: 18px;
        letter-spacing: -0.2px;
        margin-top: 8px;
        text-align: center;
    }

}

@media (max-width: 400px) {
    #sub_contents.product_sauce_page .sub_inner {
        padding-left: 12px;
        padding-right: 12px;
    }

    #sub_contents.product_sauce_page .sub_tab_container {
        width: calc(100% + 24px);
        margin-left: -12px;
        margin-right: -12px;
    }

    #sub_contents.product_sauce_page .breadcrumb .depth1,
    #sub_contents.product_sauce_page .breadcrumb .depth2 {
        font-size: 12px;
        line-height: 18px;
    }

    #sub_contents.product_sauce_page .sub_page_title {
        font-size: 26px;
        line-height: 34px;
    }

    #sub_contents.product_sauce_page .sub_tab_inner {
        width: fit-content;
        max-width: 100%;
        margin: 0 auto;
        padding: 4px 5px;
        gap: 3px;
        border-radius: 8px;
    }

    #sub_contents.product_sauce_page .sub_tab_item {
        padding: 6px 8px;
        font-size: 11px;
        line-height: 1.4;
        border-radius: 6px;
    }

    #sub_contents.product_sauce_page .product_list_section {
        padding: 40px 12px 48px;
    }

    #sub_contents.product_sauce_page .product_inner {
        width: 100% !important;
        max-width: 100%;
        padding-left: 0;
        padding-right: 0;
        box-sizing: border-box;
    }

    #sub_contents.product_sauce_page .product_top_area {
        gap: 6px;
        margin-bottom: 16px;
    }

    #sub_contents.product_sauce_page .product_top_area .tit_group {
        gap: 2px;
    }

    #sub_contents.product_sauce_page .product_top_area .main_tit {
        font-size: 22px;
        line-height: 30px;
    }

    #sub_contents.product_sauce_page .product_top_area .sub_tit {
        font-size: 14px;
        line-height: 22px;
    }

    #sub_contents.product_sauce_page .btn_download {
        margin-top: 12px;
        padding: 10px 14px;
        gap: 6px;
        align-self: center;
    }

    #sub_contents.product_sauce_page .btn_download span {
        font-size: 12px;
        line-height: 18px;
    }

    #sub_contents.product_sauce_page .product_grid {
        gap: 20px 10px;
        width: 100%;
    }

    #sub_contents.product_sauce_page .prod_img {
        height: 128px;
        border-radius: 8px;
    }

    #sub_contents.product_sauce_page .name_row h4 {
        font-size: 13px;
        line-height: 18px;
    }

    #sub_contents.product_sauce_page .name_row .en {
        font-size: 10px;
        line-height: 14px;
        -webkit-line-clamp: 2;
    }

    #sub_contents.product_sauce_page .prod_info .desc {
        font-size: 11px;
        line-height: 16px;
        -webkit-line-clamp: 3;
    }

    #sub_contents.product_sauce_page .spec_group {
        flex-wrap: wrap;
        row-gap: 2px;
    }

    #sub_contents.product_sauce_page .spec_group .spec_label,
    #sub_contents.product_sauce_page .spec_group .spec_val {
        font-size: 10px;
        line-height: 14px;
    }

    #sub_contents.product_sauce_page .spec_info {
        gap: 4px 8px;
    }
    #sub_contents.product_sauce_page .sauce_section {
        padding: 40px 0 60px;
        gap: 40px;
    }

}

/* 360px 이하: 탭·카드 여백 최소화 */
@media (max-width: 360px) {
    #sub_contents.product_sauce_page .sub_tab_item {
        padding: 7px 5px;
        font-size: 10px;
        line-height: 15px;
    }

    #sub_contents.product_sauce_page .product_grid {
        gap: 16px 8px;
    }

    #sub_contents.product_sauce_page .prod_img {
        height: 118px;
    }
}
</style>

<main id="sub_contents" class="product_page product_sauce_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_product']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_prod_sauce']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_prod_sauce']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['fac_sub_desc']; ?></p>
                </div>
            </div>

            <div class="sub_visual_img product_sauce_hero_visual">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/product_pickles.php" class="sub_tab_item"><?php echo $lang['sub_prod_pickles']; ?></a>
                        <a href="/pages/product_braised.php" class="sub_tab_item"><?php echo $lang['sub_prod_braised']; ?></a>
                        <a href="/pages/product_namul.php" class="sub_tab_item"><?php echo $lang['sub_prod_namul']; ?></a>
                        <a href="/pages/product_salted.php" class="sub_tab_item"><?php echo $lang['sub_prod_salted']; ?></a>
                        <a href="/pages/product_sauce.php" class="sub_tab_item active"><?php echo $lang['sub_prod_sauce']; ?></a>
                        <a href="/pages/product_tea.php" class="sub_tab_item"><?php echo $lang['sub_prod_tea']; ?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="sauce_section">
        <?php
        $sections = [
            ['sub' => $lang['prod_sauce_pack_sub_tit'], 'main' => $lang['prod_sauce_pack_main_tit'], 'note' => $lang['prod_sauce_pack_note'], 'start' => 1, 'count' => 4],
            ['sub' => $lang['prod_sauce_korean_sub_tit'], 'main' => $lang['prod_sauce_korean_main_tit'], 'note' => '', 'start' => 5, 'count' => 9],
            /* 양식 소스 7종 — 돈까스(16)는 아시아로 이동, 크림스파게티(22)는 삭제 */
            ['sub' => $lang['prod_sauce_china_sub_tit'], 'main' => $lang['prod_sauce_china_main_tit'], 'note' => '', 'ids' => [14, 15, 17, 18, 19, 20, 21]],
            ['sub' => $lang['prod_sauce_asia_sub_tit'], 'main' => $lang['prod_sauce_asia_main_tit'], 'note' => '', 'ids' => [16, 23, 24, 25, 26, 27, 28, 30, 31]],
        ];
        ?>

        <?php foreach ($sections as $sec) : ?>
        <section class="product_list_section">
            <div class="product_inner">
                <div class="product_top_area">
                    <div class="sauce_top_left">
                        <div class="tit_group">
                            <span class="sub_tit"><?php echo $sec['sub']; ?></span>
                            <h3 class="main_tit"><?php echo $sec['main']; ?></h3>
                        </div>
                        <?php if (!empty($sec['note'])) : ?>
                            <p class="sauce_note"><?php echo $sec['note']; ?></p>
                        <?php endif; ?>
                    </div>
                    <?php if ((int) ($sec['start'] ?? 0) === 1) : ?>
                    <a href="/download/product_catalog.pdf" class="btn_download" download>
                        <span><?php echo $lang['btn_product_intro']; ?></span>
                        <img src="/images/sub/download.png" alt="">
                    </a>
                    <?php endif; ?>
                </div>

                <div class="product_grid<?php echo ((int) ($sec['start'] ?? 0) === 1) ? ' product_grid--sauce_pack' : ''; ?>">
                    <?php
                    if (!empty($sec['ids'])) {
                        $id_list = $sec['ids'];
                    } else {
                        $id_list = [];
                        for ($j = 0; $j < (int) $sec['count']; $j++) {
                            $id_list[] = (int) ($sec['start'] ?? 0) + $j;
                        }
                    }
                    ?>
                    <?php foreach ($id_list as $idx) : ?>
                        <?php
                        $num = str_pad((string) $idx, 2, '0', STR_PAD_LEFT);
                        $unit_key = 'prod_sauce_' . $num . '_unit';
                        $storage_key = 'prod_sauce_' . $num . '_storage';
                        $storage_value = isset($lang[$storage_key]) ? $lang[$storage_key] : $lang['prod_spec_refrigerated'];
                        $unit_value = isset($lang[$unit_key]) ? $lang[$unit_key] : $lang['prod_spec_unit_1kg'];
                        $is_pack = ((int) ($sec['start'] ?? 0) === 1);
                        $img_url = $is_pack
                            ? ('/images/sub/sauce_pack/sauce-pack-' . $num . '.png')
                            : ('/images/sub/prod4-' . $idx . '.png');
                        $desc_raw = $lang['prod_sauce_' . $num . '_desc'] ?? '';
                        ?>
                    <div class="product_card">
                        <div class="prod_img" style="background-image: url('<?php echo htmlspecialchars($img_url, ENT_QUOTES, 'UTF-8'); ?>');"></div>
                        <div class="prod_info">
                            <div class="name_group">
                                <div class="name_row">
                                    <h4><?php echo $lang['prod_sauce_' . $num . '_name']; ?></h4>
                                    <span class="en"><?php echo $lang['prod_sauce_' . $num . '_en']; ?></span>
                                </div>
                                <?php if (trim((string) $desc_raw) !== '') : ?>
                                    <p class="desc"><?php echo $desc_raw; ?></p>
                                <?php endif; ?>
                            </div>
                            <?php if ($is_pack) : ?>
                            <div class="spec_info spec_info--volume_only">
                                <div class="spec_group">
                                    <span class="spec_label"><?php echo $lang['prod_spec_volume']; ?></span>
                                    <i class="v_line"></i>
                                    <span class="spec_val"><?php echo htmlspecialchars($unit_value, ENT_QUOTES, 'UTF-8'); ?></span>
                                </div>
                            </div>
                            <?php else : ?>
                            <div class="spec_info">
                                <div class="spec_group">
                                    <span class="spec_label"><?php echo $lang['prod_spec_storage']; ?></span>
                                    <i class="v_line"></i>
                                    <span class="spec_val"><?php echo $storage_value; ?></span>
                                </div>
                                <div class="spec_group">
                                    <span class="spec_label"><?php echo $lang['prod_spec_package']; ?></span>
                                    <i class="v_line"></i>
                                    <span class="spec_val"><?php echo $unit_value; ?></span>
                                </div>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php if (!empty($sec['note'])) : ?>
                    <p class="sauce_note_mobile">* <?php echo $sec['note']; ?></p>
                <?php endif; ?>
            </div>
        </section>
        <?php endforeach; ?>
    </div>
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

    document.querySelectorAll('.product_sauce_page .product_card').forEach(function(card) {
        observer.observe(card);
    });
});
</script>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
