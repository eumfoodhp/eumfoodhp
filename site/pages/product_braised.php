<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';
?>

<link rel="stylesheet" href="/css/sub.css">
<link rel="stylesheet" href="/css/product_braised.css">

<main id="sub_contents" class="product_page product_braised_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_product']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_prod_braised']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_prod_braised']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['fac_sub_desc']; ?></p>
                </div>
            </div>

            <div class="sub_visual_img product_braised_hero_visual">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/product_pickles.php" class="sub_tab_item"><?php echo $lang['sub_prod_pickles']; ?></a>
                        <a href="/pages/product_braised.php" class="sub_tab_item active"><?php echo $lang['sub_prod_braised']; ?></a>
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
                    <span class="sub_tit"><?php echo $lang['prod_braised_sub_tit']; ?></span>
                    <h3 class="main_tit"><?php echo $lang['prod_braised_main_tit']; ?></h3>
                </div>
                <a href="/download/product_catalog.pdf" class="btn_download" download>
                    <span><?php echo $lang['btn_product_intro']; ?></span>
                    <img src="/images/sub/download.png" alt="">
                </a>
            </div>

            <div class="product_grid">
                <?php
                /**
                 * 썸네일: Figma Rectangle_33194 에셋 번호 → 제품 01~09 순(연근→…→고추장멸치) 매핑.
                 * (파일명 숫자 순 ≠ 그리드 순서 — 제품별로 지정)
                 */
                $braised_img_rect = [30, 39, 31, 33, 34, 35, 36, 37, 38];
                for ($i = 1; $i <= 9; $i++) :
                    $num = str_pad((string) $i, 2, '0', STR_PAD_LEFT);
                    $rect = (int) $braised_img_rect[$i - 1];
                    ?>
                <div class="product_card">
                    <div class="prod_img" style="background-image: url('/images/sub/braised_rect_<?php echo $rect; ?>.png');"></div>
                    <div class="prod_info">
                        <div class="name_group">
                            <div class="name_row">
                                <h4><?php echo $lang['prod_braised_' . $num . '_name']; ?></h4>
                                <span class="en"><?php echo $lang['prod_braised_' . $num . '_en']; ?></span>
                            </div>
                            <p class="desc"><?php echo $lang['prod_braised_' . $num . '_desc']; ?></p>
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
                <?php endfor; ?>
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

    document.querySelectorAll('.product_braised_page .product_card').forEach(function(card) {
        observer.observe(card);
    });
});
</script>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
