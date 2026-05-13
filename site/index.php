<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

$current_lang = $_SESSION['lang'] ?? 'ko';
$dir_lang = in_array($current_lang, ['ko', 'en', 'zh'], true) ? $current_lang : 'ko';
/* 메인 하단 지도: 제조사 */
if ($dir_lang === 'en') {
    $map_factory_src = '/images/main/en1.png';
} elseif ($dir_lang === 'zh') {
    $map_factory_src = '/images/main/zh1.png';
} else {
    $map_factory_src = '/images/main/map_ko_factory.png';
}
$title_col = 'n_title_' . $current_lang;

$notice_sql = "SELECT idx, $title_col AS title, reg_date 
               FROM notice 
               ORDER BY (CASE WHEN is_notice = 'Y' THEN 1 ELSE 2 END) ASC, reg_date DESC 
               LIMIT 3";
$notice_res = mysqli_query($conn, $notice_sql);

$notices = [];
if($notice_res) {
    while($row = mysqli_fetch_assoc($notice_res)) {
        $notices[] = $row;
    }
}
?>

<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<main id="main">
<section class="hero_section">
    <!-- Swiper 컨테이너 추가 -->
    <div class="swiper hero_swiper">
        <div class="swiper-wrapper">
            <?php for($i=1; $i<=3; $i++): ?>
            <div class="swiper-slide">
                <div class="hero_bg" style="background-image: url('/images/main/main<?php echo $i; ?>.png');"></div>
            </div>
            <?php endfor; ?>
        </div>
    </div>

    <!-- 텍스트 레이어 (슬라이드와 별개로 고정) -->
    <div class="hero_inner">
        <div class="hero_title_group">
            <!-- 피그마 175-3744 섹션타이틀: 브랜드(위) + 기존 헤드라인(위치 보정은 translateY) -->
            <div class="hero_section_title">
                <p class="hero_brand"><?php echo $lang['main_hero_brand']; ?></p>
                <h2 class="main_title hero_headline">
                    <span class="hero_line"><?php echo $lang['main_hero_sub']; ?></span>
                    <span class="hero_line"><?php echo $lang['main_hero_title']; ?></span>
                </h2>
            </div>
        </div>
    </div>
</section>
<section class="overview_section">
    <div class="sticky_wrapper">
        <div class="ov_bg_box ov_after" style="background-image: url('/images/main/overview_handshake.png');"></div>

        <div class="ov_content">
            <div class="ov_stack">
                <span class="ov_sub"><?php echo $lang['main_ov_sub']; ?></span>

                <!-- 피그마: OVERVIEW 아래 육각, 본문은 육각 아래 — 좌·우 디스플레이 제목은 육각과 같은 행 -->
                <div class="ov_hero_row">
                    <div class="ov_title_wrap">
                        <div class="ov_title_cell ov_title_cell--left">
                            <h2 class="ov_title left"><?php echo $lang['main_ov_title_1']; ?></h2>
                        </div>
                        <div class="ov_hex_cell">
                            <div class="ov_hex">
                                <img src="/images/main/overview_handshake.png" alt="">
                            </div>
                        </div>
                        <div class="ov_title_cell ov_title_cell--right">
                            <h2 class="ov_title right"><?php echo $lang['main_ov_title_2']; ?></h2>
                        </div>
                    </div>
                </div>

                <div class="ov_bottom_group">
                    <p class="ov_desc"><?php echo nl2br($lang['main_ov_desc']); ?></p>
                    <a href="/pages/about_greeting.php" class="ov_more_btn">
                        <span><?php echo $lang['main_ov_more']; ?></span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="business_section">
    <div class="business_inner">
        <div class="biz_header">
            <div class="title_group">
                <span class="biz_sub"><?php echo $lang['main_biz_sub']; ?></span>
                <h2 class="biz_title"><?php echo $lang['main_biz_title']; ?></h2>
            </div>
            <a href="/pages/business_area.php" class="biz_more_btn">
                <span><?php echo $lang['main_biz_more']; ?></span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
        </div>

        <div class="biz_grid">
            <?php foreach ($lang['main_biz_items'] as $index => $item):
                $img_idx = $index + 1;
            ?>
            <article class="biz_card" style="background-image: url('/images/main/biz-area-<?php echo $img_idx; ?>.png');">
                <div class="card_text_area">
                    <h3 class="card_main_txt"><?php echo $item['title']; ?></h3>
                    <div class="card_sub_txt"><?php echo nl2br($item['desc']); ?></div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<section class="process_section">
    <div class="process_inner">
        <div class="proc_img_box">
            <?php for($i=1; $i<=5; $i++): ?>
                <img src="/images/main/section4-<?php echo $i; ?>.png" alt="process" class="proc_img <?php echo $i==1 ? 'active' : ''; ?>" data-proc="<?php echo $i; ?>">
            <?php endfor; ?>
        </div>

        <div class="proc_info_box">
            <div class="proc_text_content">
                <?php foreach($lang['main_proc_tabs'] as $idx => $item): ?>
                    <div class="proc_info_group <?php echo $idx==0 ? 'active' : ''; ?>" data-proc="<?php echo $idx+1; ?>">
                        <div class="proc_title_wrap">
                            <span class="proc_tag"><?php echo $item['tag']; ?></span>
                            <h2 class="proc_title"><?php echo nl2br($item['title']); ?></h2>
                        </div>
                    </div>
                <?php endforeach; ?>

                <div class="proc_tabs">
                    <?php foreach($lang['main_proc_tabs'] as $idx => $item): ?>
                        <button type="button" 
                                class="proc_tab_btn <?php echo $idx==0 ? 'active' : ''; ?>" 
                                data-proc="<?php echo $idx+1; ?>"
                                data-link="<?php echo $item['link']; ?>"> <?php echo $idx+1; ?>
                        </button>
                    <?php endforeach; ?>
                </div>

                <div class="proc_desc_wrap">
                    <?php foreach($lang['main_proc_tabs'] as $idx => $item): ?>
                        <p class="proc_desc <?php echo $idx==0 ? 'active' : ''; ?>" data-proc="<?php echo $idx+1; ?>">
                            <?php echo $item['desc']; ?>
                        </p>
                    <?php endforeach; ?>
                </div>
            </div>

            <a href="/pages/business_area.php" id="proc_more_btn" class="proc_more_btn">
                <span><?php echo $lang['common_more']; ?></span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
        </div>
    </div>
</section>
<section class="product_section">
    <div class="product_inner">
        <div class="prod_header">
            <span class="prod_sub"><?php echo $lang['main_prod_sub']; ?></span>
            <h2 class="prod_title"><?php echo $lang['main_prod_title']; ?></h2>
        </div>

        <div class="prod_nav_wrap">
            <div class="prod_categories">
                <?php foreach($lang['main_prod_categories'] as $idx => $cate): ?>
                    <button type="button" 
                            class="prod_cate_btn <?php echo $idx==0 ? 'active' : ''; ?>" 
                            data-cate="<?php echo $cate['name']; ?>" 
                            data-link="<?php echo $cate['link']; ?>">
                        <?php echo $cate['name']; ?>
                    </button>
                <?php endforeach; ?>
            </div>
            
            <a href="<?php echo $lang['main_prod_categories'][0]['link']; ?>" id="prod_more_link" class="prod_more_link">
                <span><?php echo $lang['main_prod_more_text']; ?></span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
        </div>

        <div class="prod_content">
            <?php foreach($lang['main_prod_list'] as $cate_name => $items): ?>
                <div class="prod_grid <?php echo $cate_name == $lang['main_prod_categories'][0]['name'] ? 'active' : ''; ?>" data-cate="<?php echo $cate_name; ?>">
                    <?php foreach($items as $item): ?>
                        <div class="prod_card">
                            <?php
                            $prodImg = $item['img'];
                            $prodImgUrl = (strpos($prodImg, '/') === 0 || preg_match('#^https?://#i', $prodImg))
                                ? $prodImg
                                : '/images/main/' . $prodImg;
                            ?>
                            <div class="prod_img" style="background-image: url('<?php echo htmlspecialchars($prodImgUrl, ENT_QUOTES, 'UTF-8'); ?>');"></div>
                            <div class="prod_info">
                                <div class="prod_name_group">
                                    <h3 class="prod_name"><?php echo $item['name']; ?></h3>
                                    <span class="prod_eng"><?php echo $item['eng']; ?></span>
                                </div>
                                <p class="prod_desc"><?php echo $item['desc']; ?></p>
                                <?php if (empty($item['hide_meta'])) : ?>
                                <div class="prod_meta">
                                    <span class="meta_label"><?php echo $lang['main_prod_label_storage']; ?></span>
                                    <span class="meta_val highlight"><?php echo $item['storage']; ?></span>
                                    <i class="v_line"></i>
                                    <span class="meta_label"><?php echo $lang['main_prod_label_package']; ?></span>
                                    <span class="meta_val highlight"><?php echo $item['weight']; ?></span>
                                </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<section class="partner_section">
    <div class="partner_inner">
        <div class="partner_text_box">
            <span class="partner_sub"><?php echo $lang['main_partner_sub']; ?></span>
            <h2 class="partner_title"><?php echo nl2br($lang['main_partner_title']); ?></h2>
        </div>

        <div class="partner_logo_area">
            <div class="logo_track to_left">
                <div class="logo_list">
                    <?php foreach($lang['main_partner_logos'] as $partner): ?>
                        <div class="partner_item"><img src="/images/common/<?php echo $partner['img']; ?>" alt=""></div>
                    <?php endforeach; ?>
                    <?php foreach($lang['main_partner_logos'] as $partner): ?>
                        <div class="partner_item"><img src="/images/common/<?php echo $partner['img']; ?>" alt=""></div>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="logo_track to_right">
                <div class="logo_list">
                    <?php foreach(array_reverse($lang['main_partner_logos']) as $partner): ?>
                        <div class="partner_item"><img src="/images/common/<?php echo $partner['img']; ?>" alt=""></div>
                    <?php endforeach; ?>
                    <?php foreach(array_reverse($lang['main_partner_logos']) as $partner): ?>
                        <div class="partner_item"><img src="/images/common/<?php echo $partner['img']; ?>" alt=""></div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="notice_section">
    <div class="notice_inner">
        <div class="notice_header">
            <div class="notice_title_group">
                <span class="notice_sub"><?php echo $lang['main_notice_sub']; ?></span>
                <h2 class="notice_title"><?php echo $lang['main_notice_title']; ?></h2>
            </div>
            <a href="/pages/notice_list.php" class="notice_more_link">
                <span><?php echo $lang['main_notice_more']; ?></span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
        </div>

        <div class="notice_content">
            <?php 
            $notice_imgs = [
                '/images/main/section4-1.png',
                '/images/main/section4-2.png',
                '/images/main/section4-3.png',
            ];
            for ($i = 0; $i < 3; $i++): 
                if (isset($notices[$i])): 
                    $post = $notices[$i];
            ?>
                <a href="/pages/notice_view.php?idx=<?php echo $post['idx']; ?>" class="notice_card">
                    <div class="card_img" style="background-image: url('<?php echo $notice_imgs[$i]; ?>');"></div>
                    <div class="card_info">
                        <div class="card_top_group">
                            <div class="card_cate_group">
                                <svg width="6" height="6" viewBox="0 0 6 6" fill="none"><circle cx="3" cy="3" r="3" fill="#FF5D27"/></svg>
                                <span class="card_cate">NEWS</span>
                            </div>
                            <h3 class="card_title"><?php echo htmlspecialchars($post['title']); ?></h3>
                        </div>
                        <span class="card_date"><?php echo date('Y.m.d', strtotime($post['reg_date'])); ?></span>
                    </div>
                </a>
            <?php 
                else:
            ?>
                <div class="notice_card notice_card_empty">
                    <div class="card_img card_img_empty"></div>
                    <div class="card_info">
                        <div class="card_top_group">
                            <div class="card_cate_group" style="opacity: 0.3;">
                                <svg width="6" height="6" viewBox="0 0 6 6" fill="none"><circle cx="3" cy="3" r="3" fill="#ddd"/></svg>
                                <span class="card_cate" style="color:#ccc;"><?php echo $lang['main_notice_coming']; ?></span>
                            </div>
                            <h3 class="card_title" style="color:#ccc; text-align:center;"><?php echo $lang['main_notice_none']; ?></h3>
                        </div>
                        <span class="card_date" style="color:#eee;">0000.00.00</span>
                    </div>
                </div>
            <?php 
                endif; 
            endfor; 
            ?>
        </div>
    </div>
</section>
<section class="direction_section">
    <img src="<?php echo htmlspecialchars($map_factory_src, ENT_QUOTES, 'UTF-8'); ?>"
         alt="<?php echo htmlspecialchars($lang['main_dir_title'] ?? 'Directions', ENT_QUOTES, 'UTF-8'); ?>"
         class="dir_bg_map"
         id="dir_map_img"
         data-map-factory="<?php echo htmlspecialchars($map_factory_src, ENT_QUOTES, 'UTF-8'); ?>">

    <div class="direction_inner">
        <div class="dir_content_area">
            <div class="dir_header">
                <span class="dir_sub"><?php echo $lang['main_dir_sub']; ?></span>
                <h2 class="dir_title"><?php echo $lang['main_dir_title']; ?></h2>
                <p class="dir_desc"><?php echo $lang['main_dir_desc']; ?></p>
            </div>

            <div class="dir_tabs">
                <button type="button" class="dir_tab_btn active" data-dir="factory">
                    <?php echo $lang['main_dir_tabs']['factory']['name']; ?>
                </button>
            </div>

            <div class="dir_info_box">
                <?php foreach($lang['main_dir_tabs'] as $key => $info): ?>
                    <div class="dir_detail_group <?php echo $key === 'factory' ? 'active' : ''; ?>" data-dir="<?php echo $key; ?>">
                        <div class="detail_item">
                            <span class="detail_label"><?php echo $info['addr_label']; ?></span>
                            <p class="detail_val"><?php echo $info['address']; ?></p>
                        </div>
                        <div class="detail_item">
                            <span class="detail_label"><?php echo $info['phone_label']; ?></span>
                            <div class="detail_val phone_grid">
                                <?php foreach($info['phones'] as $p_name => $p_num): ?>
                                    <span><?php echo $p_name; ?> : <?php echo $p_num; ?></span>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        <div class="detail_item">
                            <span class="detail_label"><?php echo $info['fax_label']; ?></span>
                            <p class="detail_val"><?php echo $info['fax']; ?></p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>
</main>

<script src="/js/common.js"></script>
<script src="/js/main.js"></script>
<script>
    // 페이지 로드 후 즉시 실행
    document.addEventListener('DOMContentLoaded', function() {
        const heroSwiper = new Swiper('.hero_swiper', {
            loop: true,
            effect: 'fade', // 부드럽게 겹치며 전환
            fadeEffect: { crossFade: true },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            speed: 2000, // 전환되는 시간 (2초)
        });
    });
</script>

<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php';
?>