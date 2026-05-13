<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

/**
 * 시설 이미지 URL: JPG 우선, 없으면 PNG(레거시) 폴백.
 */
function biz_facility_img_src(string $prefix, string $num): string {
    $base = '/images/sub/facility/' . $prefix . '-' . $num;
    $root = $_SERVER['DOCUMENT_ROOT'];
    /* 세척 컨베이어벨트(ga-05): 원본 PNG 유지 — JPG가 있어도 PNG 우선 */
    if ($prefix === 'ga' && $num === '05') {
        if (is_file($root . $base . '.png')) {
            return $base . '.png';
        }
        if (is_file($root . $base . '.jpg')) {
            return $base . '.jpg';
        }
        return $base . '.png';
    }
    if (is_file($root . $base . '.jpg')) {
        return $base . '.jpg';
    }
    if ($prefix === 'na' && $num === '07' && is_file($root . $base . '-new.png')) {
        return $base . '-new.png';
    }
    if (is_file($root . $base . '.png')) {
        return $base . '.png';
    }
    return $base . '.jpg';
}
?>

<link rel="stylesheet" href="/css/sub.css">
<link rel="stylesheet" href="/css/business_facility.css">

<main id="sub_contents" class="business_facility_page">
    <!-- 서브 비주얼 섹션 -->
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_business']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_facility']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['fac_title']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['fac_sub_desc']; ?></p>
                </div>
            </div>
            <!-- 시설현황 메인 히어로 이미지 -->
            <div class="sub_visual_img business_facility_hero_visual">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/business_area.php" class="sub_tab_item"><?php echo $lang['sub_biz_area']; ?></a>
                        <a href="/pages/business_facility.php" class="sub_tab_item active"><?php echo $lang['sub_facility']; ?></a>
                        <a href="/pages/business_process.php" class="sub_tab_item"><?php echo $lang['sub_biz_process']; ?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="facility_status_section">
        <div class="facility_status_inner">
            <div class="facility_status_head">
                <div class="facility_title_group">
                    <span class="facility_sub_tit"><?php echo $lang['facility_status_sub_tit']; ?></span>
                    <h3 class="facility_main_tit"><?php echo $lang['facility_status_main_tit']; ?></h3>
                </div>
                <div class="facility_toggle" role="tablist" aria-label="<?php echo htmlspecialchars($lang['facility_tablist_label'], ENT_QUOTES, 'UTF-8'); ?>">
                    <button type="button" role="tab" class="fac_tab_item active" id="facilityTabGa" data-facility-tab="ga" aria-selected="true" aria-controls="facilityGridGa"><?php echo $lang['facility_tab_ga']; ?></button>
                    <button type="button" role="tab" class="fac_tab_item" id="facilityTabNa" data-facility-tab="na" aria-selected="false" aria-controls="facilityGridNa"><?php echo $lang['facility_tab_na']; ?></button>
                </div>
            </div>

            <div id="facilityGridGa" class="facility_grid" role="tabpanel" aria-labelledby="facilityTabGa" data-facility-panel="ga">
                <?php for ($i = 1; $i <= 12; $i++): ?>
                    <?php
                    $num = str_pad((string) $i, 2, '0', STR_PAD_LEFT);
                    $imgPath = biz_facility_img_src('ga', $num);
                    $nameKey = 'facility_ga_item_' . $num . '_name';
                    $descKey = 'facility_ga_item_' . $num . '_desc';
                    ?>
                    <article class="facility_card">
                        <div class="facility_img">
                            <img src="<?php echo htmlspecialchars($imgPath, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars(strip_tags($lang[$nameKey]), ENT_QUOTES, 'UTF-8'); ?>" loading="lazy" width="508" height="414">
                        </div>
                        <div class="facility_info">
                            <div class="facility_name_row">
                                <span class="facility_name_label"><?php echo $lang['facility_name_label']; ?></span>
                                <span class="divider"></span>
                                <span class="facility_name"><?php echo $lang[$nameKey]; ?></span>
                            </div>
                            <p class="facility_desc"><?php echo $lang[$descKey]; ?></p>
                        </div>
                    </article>
                <?php endfor; ?>
            </div>

            <div id="facilityGridNa" class="facility_grid facility_grid--hidden" role="tabpanel" aria-labelledby="facilityTabNa" data-facility-panel="na" hidden>
                <?php for ($i = 1; $i <= 11; $i++): ?>
                    <?php
                    $num = str_pad((string) $i, 2, '0', STR_PAD_LEFT);
                    $imgPath = biz_facility_img_src('na', $num);
                    $nameKey = 'facility_item_' . $num . '_name';
                    $descKey = 'facility_item_' . $num . '_desc';
                    ?>
                    <article class="facility_card">
                        <div class="facility_img">
                            <img src="<?php echo htmlspecialchars($imgPath, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars(strip_tags($lang[$nameKey]), ENT_QUOTES, 'UTF-8'); ?>" loading="lazy" width="508" height="414">
                        </div>
                        <div class="facility_info">
                            <div class="facility_name_row">
                                <span class="facility_name_label"><?php echo $lang['facility_name_label']; ?></span>
                                <span class="divider"></span>
                                <span class="facility_name"><?php echo $lang[$nameKey]; ?></span>
                            </div>
                            <p class="facility_desc"><?php echo $lang[$descKey]; ?></p>
                        </div>
                    </article>
                <?php endfor; ?>
            </div>
        </div>
    </section>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    var tabGa = document.getElementById('facilityTabGa');
    var tabNa = document.getElementById('facilityTabNa');
    var panelGa = document.getElementById('facilityGridGa');
    var panelNa = document.getElementById('facilityGridNa');
    if (!tabGa || !tabNa || !panelGa || !panelNa) return;

    function setFacilityTab(which) {
        var isGa = which === 'ga';
        tabGa.classList.toggle('active', isGa);
        tabNa.classList.toggle('active', !isGa);
        tabGa.setAttribute('aria-selected', isGa ? 'true' : 'false');
        tabNa.setAttribute('aria-selected', isGa ? 'false' : 'true');
        panelGa.classList.toggle('facility_grid--hidden', !isGa);
        panelNa.classList.toggle('facility_grid--hidden', isGa);
        if (isGa) {
            panelGa.removeAttribute('hidden');
            panelNa.setAttribute('hidden', 'hidden');
        } else {
            panelNa.removeAttribute('hidden');
            panelGa.setAttribute('hidden', 'hidden');
        }
    }

    tabGa.addEventListener('click', function() { setFacilityTab('ga'); });
    tabNa.addEventListener('click', function() { setFacilityTab('na'); });
});
</script>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>