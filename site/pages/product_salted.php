<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';
?>

<link rel="stylesheet" href="/css/sub.css">
<link rel="stylesheet" href="/css/product_salted.css">

<main id="sub_contents" class="product_page product_salted_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_product']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_prod_salted']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_prod_salted']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['fac_sub_desc']; ?></p>
                </div>
            </div>

            <div class="sub_visual_img product_salted_hero_visual">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/product_pickles.php" class="sub_tab_item"><?php echo $lang['sub_prod_pickles']; ?></a>
                        <a href="/pages/product_braised.php" class="sub_tab_item"><?php echo $lang['sub_prod_braised']; ?></a>
                        <a href="/pages/product_namul.php" class="sub_tab_item"><?php echo $lang['sub_prod_namul']; ?></a>
                        <a href="/pages/product_salted.php" class="sub_tab_item active"><?php echo $lang['sub_prod_salted']; ?></a>
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
                    <span class="sub_tit"><?php echo $lang['prod_salted_sub_tit']; ?></span>
                    <h3 class="main_tit"><?php echo $lang['prod_salted_main_tit']; ?></h3>
                </div>
                <a href="/download/product_catalog.pdf" class="btn_download" download>
                    <span><?php echo $lang['btn_product_intro']; ?></span>
                    <img src="/images/sub/download.png" alt="">
                </a>
            </div>

            <div class="product_grid product_grid--salted_three">
                <?php
                /** 오징어젓·낙지젓·새우젓 3종 — 썸네일은 메인과 동일 이미지 사용 */
                $salted_items = [
                    ['id' => '01', 'img' => '/images/main/prod-salted-squid-new.png'],
                    ['id' => '02', 'img' => '/images/main/prod-salted-octopus-new.png'],
                    ['id' => '03', 'img' => '/images/main/prod-salted-shrimp-new.png'],
                ];
                foreach ($salted_items as $row) :
                    $num = $row['id'];
                    $img_url = $row['img'];
                    ?>
                <div class="product_card">
                    <div class="prod_img" style="background-image: url('<?php echo htmlspecialchars($img_url, ENT_QUOTES, 'UTF-8'); ?>');"></div>
                    <div class="prod_info">
                        <div class="name_group">
                            <div class="name_row">
                                <h4><?php echo $lang['prod_salted_' . $num . '_name']; ?></h4>
                                <span class="en"><?php echo $lang['prod_salted_' . $num . '_en']; ?></span>
                            </div>
                            <p class="desc"><?php echo $lang['prod_salted_' . $num . '_desc']; ?></p>
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

    document.querySelectorAll('.product_salted_page .product_card').forEach(function(card) {
        observer.observe(card);
    });
});
</script>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
