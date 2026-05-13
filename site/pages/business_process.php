<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';

/* 절임식품 아이콘: Figma 553:5977 export → images/sub/figma/biz-pf-pickles-5535977/ (커스텀) */
$pickles_img_num = [
    '01' => '01', '02' => '02', '03' => '03', '04' => '04',
    '05' => '05', '06' => '06', '07' => '07', '08' => '08', '09' => '09',
];
$pickles_row1 = ['01', '02', '03', '04'];
/* Figma 553:5900: 시각적으로 왼쪽이 Step 09(X-ray) … 오른쪽이 Step 05(배합) */
$pickles_row2 = ['08', '07', '06', '05'];
$pickles_row3 = ['09'];
/* 조림류 아이콘: Figma 553:5890 export → images/sub/figma/biz-pf-braised-5535890/ */
$braised_img_num = [
    '01' => '01', '02' => '02', '03' => '03', '04' => '04',
    '05' => '05', '06' => '06', '07' => '07', '08' => '08',
];
$braised_row1 = ['01', '02', '03', '04'];
/* Figma 553:5890: 2행은 시각적으로 Step08 → Step05 순 */
$braised_row2 = ['08', '07', '06', '05'];
/* 피클 아이콘: Figma 553:5894 export → images/sub/figma/biz-pf-pickle-5535894/ */
$pickle_img_num = [
    '01' => '01', '02' => '02', '03' => '03', '04' => '04',
    '05' => '05', '06' => '06', '07' => '07', '08' => '08',
];
$pickle_row1 = ['01', '02', '03', '04'];
/* Figma 553:5894: 2행은 시각적으로 Step08 → Step05 순 */
$pickle_row2 = ['08', '07', '06', '05'];
/* Figma 553:5824(1행) + 684:5232·553:5868·553:5875(2행) — 스텝별 전용 아이콘 */
$sauce_img_num = [
    '01' => '01',
    '02' => '02',
    '03' => '03',
    '04' => '04',
    '05' => '05',
    '06' => '06',
    '07' => '07',
];
$sauce_row1 = ['01', '02', '03', '04'];
/* 2행: 시각적으로 외포장/출하(07) → 금속검출(06) → 내포장(05) */
$sauce_row2 = ['07', '06', '05'];

/**
 * 아이콘 파일 URL 생성.
 * - 파일 내용이 SVG인데 확장자가 .png인 경우(현재 데이터)에는 data URI로 강제 렌더링.
 * - 일반 이미지면 기존 URL 반환.
 */
function biz_pf_icon_src($prefix, $img_num) {
    $rel_candidates = [
        'images/sub/' . $prefix . '-' . $img_num . '.png',
        'images/sub/process/' . $prefix . '-' . $img_num . '.png',
    ];

    foreach ($rel_candidates as $rel) {
        $abs = $_SERVER['DOCUMENT_ROOT'] . '/' . $rel;
        if (!is_file($abs)) {
            continue;
        }

        $raw = @file_get_contents($abs);
        if ($raw === false || $raw === '') {
            continue;
        }

        $trimmed = ltrim($raw);
        if (strncmp($trimmed, '<svg', 4) === 0) {
            // SVG 텍스트를 data URI로 직접 렌더링 (확장자/Content-Type 불일치 회피)
            return 'data:image/svg+xml;utf8,' . rawurlencode($raw);
        }

        // 일반 이미지 파일일 때는 URL 반환
        return images_url(substr($rel, strlen('images/')));
    }

    // 파일이 아예 없을 경우 마지막 fallback
    return images_url('sub/' . $prefix . '-' . $img_num . '.png');
}

/**
 * 특정 스텝만 다른 에셋 파일로 교체. 그 외는 biz_pf_icon_src와 동일(SVG·png 혼용 규칙 포함).
 */
function biz_pf_resolve_step_icon($prefix, $step_id, $img_num) {
    static $custom = [
        'pickles' => [
            '01' => 'sub/figma/biz-pf-pickles-5535977/01.png',
            '02' => 'sub/custom/biz-pf-raw-inspection.png',
            '03' => 'sub/figma/biz-pf-pickles-5535977/03.png',
            '04' => 'sub/figma/biz-pf-pickles-5535977/04.png',
            '05' => 'sub/figma/biz-pf-pickles-5535977/05.png',
            '06' => 'sub/figma/biz-pf-pickles-5535977/06.png',
            '07' => 'sub/figma/biz-pf-pickles-5535977/07.png',
            '08' => 'sub/figma/biz-pf-pickles-5535977/08.png',
            '09' => 'sub/figma/biz-pf-pickles-5535977/09.png',
        ],
        'braised' => [
            '01' => 'sub/figma/biz-pf-braised-5535890/01.png',
            '02' => 'sub/custom/biz-pf-raw-inspection.png',
            '03' => 'sub/custom/biz-pf-seonbyeol.png',
            '04' => 'sub/figma/biz-pf-braised-5535890/04.png',
            '05' => 'sub/figma/biz-pf-braised-5535890/05.png',
            '06' => 'sub/figma/biz-pf-braised-5535890/06.png',
            '07' => 'sub/figma/biz-pf-braised-5535890/07.png',
            '08' => 'sub/figma/biz-pf-braised-5535890/08.png',
        ],
        'pickle' => [
            '01' => 'sub/figma/biz-pf-pickle-5535894/01.png',
            '02' => 'sub/custom/biz-pf-raw-inspection.png',
            '03' => 'sub/custom/biz-pf-seonbyeol.png',
            '04' => 'sub/figma/biz-pf-pickle-5535894/04.png',
            '05' => 'sub/figma/biz-pf-pickle-5535894/05.png',
            '06' => 'sub/figma/biz-pf-pickle-5535894/06.png',
            '07' => 'sub/figma/biz-pf-pickle-5535894/07.png',
            '08' => 'sub/figma/biz-pf-pickle-5535894/08.png',
        ],
        'sauce' => [
            '01' => 'sub/figma/biz-pf-sauce-flow/01.png',
            '02' => 'sub/custom/biz-pf-raw-inspection.png',
            '03' => 'sub/figma/biz-pf-sauce-flow/03.png',
            '04' => 'sub/figma/biz-pf-sauce-flow/04.png',
            '05' => 'sub/figma/biz-pf-sauce-flow/05.png',
            '06' => 'sub/figma/biz-pf-sauce-flow/06.png',
            '07' => 'sub/figma/biz-pf-sauce-flow/07.png',
        ],
    ];
    if (isset($custom[$prefix][$step_id])) {
        $rel = $custom[$prefix][$step_id];
        $abs = $_SERVER['DOCUMENT_ROOT'] . '/images/' . $rel;
        if (is_file($abs)) {
            $raw = @file_get_contents($abs);
            if ($raw !== false && $raw !== '') {
                $trimmed = ltrim($raw);
                if (strncmp($trimmed, '<svg', 4) === 0) {
                    return 'data:image/svg+xml;utf8,' . rawurlencode($raw);
                }
            }
            return images_url($rel);
        }
    }
    return biz_pf_icon_src($prefix, $img_num);
}

include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';
?>

<link rel="stylesheet" href="/css/sub.css">
<link rel="stylesheet" href="/css/business_process.css">

<main id="sub_contents" class="business_process_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_business']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_biz_process']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_biz_process']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['biz_process_sub_desc']; ?></p>
                </div>
            </div>
            <div class="sub_visual_img business_process_hero_visual">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/business_area.php" class="sub_tab_item"><?php echo $lang['sub_biz_area']; ?></a>
                        <a href="/pages/business_facility.php" class="sub_tab_item"><?php echo $lang['sub_facility']; ?></a>
                        <a href="/pages/business_process.php" class="sub_tab_item active"><?php echo $lang['sub_biz_process']; ?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="biz_process_flow_section biz_process_flow_section--pickles" aria-labelledby="biz_pf_pickles_heading">
        <div class="sub_inner biz_pf_inner">
            <header class="biz_pf_flow_head">
                <p class="biz_pf_eyebrow"><?php echo $lang['biz_pf_pickles_eyebrow']; ?></p>
                <h2 id="biz_pf_pickles_heading" class="biz_pf_flow_title"><?php echo $lang['biz_pf_pickles_head']; ?></h2>
            </header>

            <div class="biz_pf_pickles_flow">
                <div class="biz_pf_diagram" role="img" aria-label="<?php echo htmlspecialchars($lang['biz_pf_pickles_head']); ?>">
                    <div class="biz_pf_snake_lines" aria-hidden="true">
                        <span class="biz_pf_ln biz_pf_ln--h1"></span>
                        <span class="biz_pf_ln biz_pf_ln--h2"></span>
                        <?php if (count($pickles_row3) > 1) { ?><span class="biz_pf_ln biz_pf_ln--h3"></span><?php } ?>
                        <span class="biz_pf_ln biz_pf_ln--v1"></span>
                        <span class="biz_pf_ln biz_pf_ln--v2"></span>
                    </div>

                    <div class="biz_pf_flow_row biz_pf_flow_row--r1">
                        <?php foreach ($pickles_row1 as $pk_id) {
                            $pfx = 'biz_pf_pk_' . $pk_id;
                            $img = $pickles_img_num[$pk_id];
                            $step_lbl = $lang['biz_process_step_prefix'] . ' ' . $lang[$pfx . 'b'];
                            $img_src = biz_pf_resolve_step_icon('pickles', $pk_id, $img);
                            ?>
                            <div class="biz_pf_step">
                                <span class="biz_pf_step_badge"><?php echo htmlspecialchars($step_lbl); ?></span>
                                <div class="biz_pf_step_circle">
                                    <div class="biz_pf_step_icon">
                                        <img src="<?php echo htmlspecialchars($img_src, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($lang[$pfx . 't']); ?>" width="90" height="90" decoding="async">
                                    </div>
                                    <p class="biz_pf_step_label"><?php echo $lang[$pfx . 't']; ?></p>
                                </div>
                            </div>
                        <?php } ?>
                    </div>

                    <div class="biz_pf_flow_row biz_pf_flow_row--r2">
                        <?php foreach ($pickles_row2 as $pk_id) {
                            $pfx = 'biz_pf_pk_' . $pk_id;
                            $img = $pickles_img_num[$pk_id];
                            $step_lbl = $lang['biz_process_step_prefix'] . ' ' . $lang[$pfx . 'b'];
                            $img_src = biz_pf_resolve_step_icon('pickles', $pk_id, $img);
                            ?>
                            <div class="biz_pf_step">
                                <span class="biz_pf_step_badge"><?php echo htmlspecialchars($step_lbl); ?></span>
                                <div class="biz_pf_step_circle">
                                    <div class="biz_pf_step_icon">
                                        <img src="<?php echo htmlspecialchars($img_src, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($lang[$pfx . 't']); ?>" width="90" height="90" decoding="async">
                                    </div>
                                    <p class="biz_pf_step_label"><?php echo $lang[$pfx . 't']; ?></p>
                                </div>
                            </div>
                        <?php } ?>
                    </div>

                    <div class="biz_pf_flow_row biz_pf_flow_row--r3">
                        <?php foreach ($pickles_row3 as $pk_id) {
                            $pfx = 'biz_pf_pk_' . $pk_id;
                            $img = $pickles_img_num[$pk_id];
                            $step_lbl = $lang['biz_process_step_prefix'] . ' ' . $lang[$pfx . 'b'];
                            $img_src = biz_pf_resolve_step_icon('pickles', $pk_id, $img);
                            ?>
                            <div class="biz_pf_step">
                                <span class="biz_pf_step_badge"><?php echo htmlspecialchars($step_lbl); ?></span>
                                <div class="biz_pf_step_circle">
                                    <div class="biz_pf_step_icon">
                                        <img src="<?php echo htmlspecialchars($img_src, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($lang[$pfx . 't']); ?>" width="90" height="90" decoding="async">
                                    </div>
                                    <p class="biz_pf_step_label"><?php echo $lang[$pfx . 't']; ?></p>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="biz_process_flow_section biz_process_flow_section--braised" aria-labelledby="biz_pf_braised_heading">
        <div class="sub_inner biz_pf_inner">
            <header class="biz_pf_flow_head">
                <p class="biz_pf_eyebrow biz_pf_eyebrow--green"><?php echo isset($lang['biz_pf_braised_eyebrow']) ? $lang['biz_pf_braised_eyebrow'] : 'Stewed Food'; ?></p>
                <h2 id="biz_pf_braised_heading" class="biz_pf_flow_title"><?php echo $lang['biz_pf_braised_head']; ?></h2>
            </header>

            <div class="biz_pf_pickles_flow biz_pf_pickles_flow--braised">
                <div class="biz_pf_diagram biz_pf_diagram--braised" role="img" aria-label="<?php echo htmlspecialchars($lang['biz_pf_braised_head']); ?>">
                    <div class="biz_pf_snake_lines" aria-hidden="true">
                        <span class="biz_pf_ln biz_pf_ln--bh1"></span>
                        <span class="biz_pf_ln biz_pf_ln--bh2"></span>
                        <span class="biz_pf_ln biz_pf_ln--bv1"></span>
                    </div>

                    <div class="biz_pf_flow_row biz_pf_flow_row--br1">
                        <?php foreach ($braised_row1 as $br_id) {
                            $pfx = 'biz_pf_br_' . $br_id;
                            $img = $braised_img_num[$br_id];
                            $step_lbl = $lang['biz_process_step_prefix'] . ' ' . $lang[$pfx . 'b'];
                            $img_src = biz_pf_resolve_step_icon('braised', $br_id, $img);
                            ?>
                            <div class="biz_pf_step biz_pf_step--green">
                                <span class="biz_pf_step_badge"><?php echo htmlspecialchars($step_lbl); ?></span>
                                <div class="biz_pf_step_circle">
                                    <div class="biz_pf_step_icon">
                                        <img src="<?php echo htmlspecialchars($img_src, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($lang[$pfx . 't']); ?>" width="90" height="90" decoding="async">
                                    </div>
                                    <p class="biz_pf_step_label"><?php echo $lang[$pfx . 't']; ?></p>
                                </div>
                            </div>
                        <?php } ?>
                    </div>

                    <div class="biz_pf_flow_row biz_pf_flow_row--br2">
                        <?php foreach ($braised_row2 as $br_id) {
                            $pfx = 'biz_pf_br_' . $br_id;
                            $img = $braised_img_num[$br_id];
                            $step_lbl = $lang['biz_process_step_prefix'] . ' ' . $lang[$pfx . 'b'];
                            $img_src = biz_pf_resolve_step_icon('braised', $br_id, $img);
                            ?>
                            <div class="biz_pf_step biz_pf_step--green">
                                <span class="biz_pf_step_badge"><?php echo htmlspecialchars($step_lbl); ?></span>
                                <div class="biz_pf_step_circle">
                                    <div class="biz_pf_step_icon">
                                        <img src="<?php echo htmlspecialchars($img_src, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($lang[$pfx . 't']); ?>" width="90" height="90" decoding="async">
                                    </div>
                                    <p class="biz_pf_step_label"><?php echo $lang[$pfx . 't']; ?></p>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="biz_process_flow_section biz_process_flow_section--pickle" aria-labelledby="biz_pf_pickle_heading">
        <div class="sub_inner biz_pf_inner">
            <header class="biz_pf_flow_head">
                <p class="biz_pf_eyebrow biz_pf_eyebrow--orange"><?php echo isset($lang['biz_pf_pickle_eyebrow']) ? $lang['biz_pf_pickle_eyebrow'] : 'Pickle'; ?></p>
                <h2 id="biz_pf_pickle_heading" class="biz_pf_flow_title"><?php echo $lang['biz_pf_pickle_head']; ?></h2>
            </header>

            <div class="biz_pf_pickles_flow biz_pf_pickles_flow--pickle">
                <div class="biz_pf_diagram biz_pf_diagram--pickle" role="img" aria-label="<?php echo htmlspecialchars($lang['biz_pf_pickle_head']); ?>">
                    <div class="biz_pf_snake_lines" aria-hidden="true">
                        <span class="biz_pf_ln biz_pf_ln--ph1"></span>
                        <span class="biz_pf_ln biz_pf_ln--ph2"></span>
                        <span class="biz_pf_ln biz_pf_ln--pv1"></span>
                    </div>

                    <div class="biz_pf_flow_row biz_pf_flow_row--pr1">
                        <?php foreach ($pickle_row1 as $pi_id) {
                            $pfx = 'biz_pf_pi_' . $pi_id;
                            $img = $pickle_img_num[$pi_id];
                            $step_lbl = $lang['biz_process_step_prefix'] . ' ' . $lang[$pfx . 'b'];
                            $img_src = biz_pf_resolve_step_icon('pickle', $pi_id, $img);
                            ?>
                            <div class="biz_pf_step biz_pf_step--orange">
                                <span class="biz_pf_step_badge"><?php echo htmlspecialchars($step_lbl); ?></span>
                                <div class="biz_pf_step_circle">
                                    <div class="biz_pf_step_icon">
                                        <img src="<?php echo htmlspecialchars($img_src, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($lang[$pfx . 't']); ?>" width="90" height="90" decoding="async">
                                    </div>
                                    <p class="biz_pf_step_label"><?php echo $lang[$pfx . 't']; ?></p>
                                </div>
                            </div>
                        <?php } ?>
                    </div>

                    <div class="biz_pf_flow_row biz_pf_flow_row--pr2">
                        <?php foreach ($pickle_row2 as $pi_id) {
                            $pfx = 'biz_pf_pi_' . $pi_id;
                            $img = $pickle_img_num[$pi_id];
                            $step_lbl = $lang['biz_process_step_prefix'] . ' ' . $lang[$pfx . 'b'];
                            $img_src = biz_pf_resolve_step_icon('pickle', $pi_id, $img);
                            ?>
                            <div class="biz_pf_step biz_pf_step--orange">
                                <span class="biz_pf_step_badge"><?php echo htmlspecialchars($step_lbl); ?></span>
                                <div class="biz_pf_step_circle">
                                    <div class="biz_pf_step_icon">
                                        <img src="<?php echo htmlspecialchars($img_src, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($lang[$pfx . 't']); ?>" width="90" height="90" decoding="async">
                                    </div>
                                    <p class="biz_pf_step_label"><?php echo $lang[$pfx . 't']; ?></p>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="biz_process_flow_section biz_process_flow_section--sauce" aria-labelledby="biz_pf_sauce_heading">
        <div class="sub_inner biz_pf_inner">
            <header class="biz_pf_flow_head">
                <p class="biz_pf_eyebrow biz_pf_eyebrow--blue"><?php echo isset($lang['biz_pf_sauce_eyebrow']) ? $lang['biz_pf_sauce_eyebrow'] : 'Sauce, Mixing Sauce, Liquid tea'; ?></p>
                <h2 id="biz_pf_sauce_heading" class="biz_pf_flow_title"><?php echo $lang['biz_pf_sauce_head']; ?></h2>
            </header>

            <div class="biz_pf_pickles_flow biz_pf_pickles_flow--sauce">
                <div class="biz_pf_diagram biz_pf_diagram--sauce" role="img" aria-label="<?php echo htmlspecialchars($lang['biz_pf_sauce_head']); ?>">
                    <div class="biz_pf_snake_lines" aria-hidden="true">
                        <span class="biz_pf_ln biz_pf_ln--sh1"></span>
                        <span class="biz_pf_ln biz_pf_ln--sh2"></span>
                        <span class="biz_pf_ln biz_pf_ln--sv1"></span>
                    </div>

                    <div class="biz_pf_flow_row biz_pf_flow_row--sr1">
                        <?php foreach ($sauce_row1 as $sa_id) {
                            $pfx = 'biz_pf_sa_' . $sa_id;
                            $img = $sauce_img_num[$sa_id];
                            $step_lbl = $lang['biz_process_step_prefix'] . ' ' . $lang[$pfx . 'b'];
                            $img_src = biz_pf_resolve_step_icon('sauce', $sa_id, $img);
                            ?>
                            <div class="biz_pf_step biz_pf_step--blue">
                                <span class="biz_pf_step_badge"><?php echo htmlspecialchars($step_lbl); ?></span>
                                <div class="biz_pf_step_circle">
                                    <div class="biz_pf_step_icon">
                                        <img src="<?php echo htmlspecialchars($img_src, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($lang[$pfx . 't']); ?>" width="90" height="90" decoding="async">
                                    </div>
                                    <p class="biz_pf_step_label"><?php echo $lang[$pfx . 't']; ?></p>
                                </div>
                            </div>
                        <?php } ?>
                    </div>

                    <div class="biz_pf_flow_row biz_pf_flow_row--sr2">
                        <?php foreach ($sauce_row2 as $sa_id) {
                            $pfx = 'biz_pf_sa_' . $sa_id;
                            $img = $sauce_img_num[$sa_id];
                            $step_lbl = $lang['biz_process_step_prefix'] . ' ' . $lang[$pfx . 'b'];
                            $img_src = biz_pf_resolve_step_icon('sauce', $sa_id, $img);
                            ?>
                            <div class="biz_pf_step biz_pf_step--blue">
                                <span class="biz_pf_step_badge"><?php echo htmlspecialchars($step_lbl); ?></span>
                                <div class="biz_pf_step_circle">
                                    <div class="biz_pf_step_icon">
                                        <img src="<?php echo htmlspecialchars($img_src, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($lang[$pfx . 't']); ?>" width="90" height="90" decoding="async">
                                    </div>
                                    <p class="biz_pf_step_label"><?php echo $lang[$pfx . 't']; ?></p>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
