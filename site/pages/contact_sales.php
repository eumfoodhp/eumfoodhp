<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

?>

<link rel="stylesheet" href="/css/sub.css">
<style>
    .sales_form_section { padding: 120px 0 140px; }
    /* PC·태블릿: 기존과 동일 — flex, 좌측 sales_info(제목+연락처), 우측 폼 */
    .sales_form_wrap {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 80px;
    }
    .sales_info {
        width: 543px;
        display: flex;
        flex-direction: column;
        gap: 60px;
    }
    .sales_info_contact {
        display: flex;
        flex-direction: column;
        gap: 60px;
    }
    .sales_title_group { display: flex; flex-direction: column; gap: 8px; }
    .sales_title_group .label { color: #ff5d27; font-size: 18px; line-height: 28px; letter-spacing: -0.45px; font-weight: 500; }
    .sales_title_group .title { color: #222; font-size: 42px; line-height: 60px; letter-spacing: -1.05px; font-weight: 700; }
    .sales_info_block { display: flex; flex-direction: column; gap: 12px; }
    .sales_info_block .name { color: #767676; font-size: 18px; line-height: 28px; letter-spacing: -0.45px; font-weight: 300; }
    .sales_info_block .value { color: #222; font-size: 18px; line-height: 28px; letter-spacing: -0.45px; font-weight: 500; word-break: keep-all; }
    .sales_phone_rows { display: flex; flex-direction: column; gap: 8px; }
    .sales_phone_rows .row { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
    .sales_phone_rows span { color: #222; font-size: 18px; line-height: 28px; letter-spacing: -0.45px; font-weight: 500; white-space: nowrap; }
    .sales_info_block.address_block { width: 307px; }

    .sales_form_area {
        width: 784px;
        display: flex;
        flex-direction: column;
        gap: 80px;
    }
    .sales_step { display: flex; flex-direction: column; gap: 32px; }
    .sales_step_head { display: flex; flex-direction: column; gap: 8px; width: 460px; }
    .sales_step_no { color: #ff5d27; font-size: 16px; line-height: 26px; letter-spacing: -0.4px; font-weight: 300; }
    .sales_step_tit { color: #222; font-size: 24px; line-height: 34px; letter-spacing: -0.6px; font-weight: 500; }

    .sales_grid_2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .sales_field { display: flex; flex-direction: column; gap: 4px; }
    .sales_field label { color: #1d212c; font-size: 14px; line-height: 22px; letter-spacing: -0.35px; font-weight: 500; }
    .sales_field label .req { color: #ff5d27; }
    .sales_input, .sales_select, .sales_textarea {
        width: 100%; border: 0; border-bottom: 1px solid #e5e5ec; background: #fff;
        color: #222; font-size: 14px; line-height: 22px; padding: 16px 0;
    }
    .sales_select { appearance: none; background: url('/images/common/header-icon.png') no-repeat right center / 14px auto; }
    .sales_textarea {
        border: 1px solid #e5e5ec; border-radius: 4px; padding: 16px; min-height: 200px; resize: vertical;
    }
    .sales_radio_wrap { display: flex; flex-wrap: wrap; gap: 16px; }
    .sales_radio { display: inline-flex; align-items: center; gap: 4px; color: #767676; font-size: 14px; }
    .sales_file_row { display: grid; grid-template-columns: 1fr 106px; gap: 8px; align-items: end; }
    .sales_file_btn {
        height: 54px; border: 1px solid #e5e5ec; border-radius: 4px; background: #fff;
        color: #222; font-size: 14px; line-height: 22px; font-weight: 500;
    }
    .sales_policy_box {
        border: 1px solid #e5e5ec; border-radius: 10px; padding: 24px; display: flex; flex-direction: column; gap: 16px;
    }
    .sales_policy_top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .sales_policy_check { display: inline-flex; align-items: center; gap: 6px; font-size: 18px; line-height: 28px; letter-spacing: -0.45px; font-weight: 500; color: #222; }
    .sales_policy_check .req { color: #ff5d27; }
    .sales_policy_content { color: #505050; font-size: 14px; line-height: 22px; letter-spacing: -0.35px; }
    .sales_submit_btn {
        width: 148px; height: 54px; border: 0; border-radius: 4px; background: #ff5d27;
        color: #fff; font-size: 14px; line-height: 22px; letter-spacing: -0.35px; font-weight: 500;
    }

    @media (max-width: 1400px) {
        .sales_form_wrap {
            flex-direction: column;
            gap: 50px;
        }
        .sales_info,
        .sales_form_area {
            width: 100%;
            max-width: 100%;
        }
        .sales_info_block.address_block { width: 100%; max-width: 100%; }
    }
    @media (max-width: 768px) {
        .sales_form_section { padding: 80px 0 100px; }
        .sales_title_group .title { font-size: 34px; line-height: 46px; }
        .sales_grid_2 { grid-template-columns: 1fr; }
        .sales_step_head { width: 100%; }
        .sales_file_row { grid-template-columns: 1fr; }
    }

    @media (max-width: 735px) {
        .sales_form_section { padding: 40px 0 56px; }
        .sales_form_wrap { gap: 32px; }

        /* 모바일만: 폼 안쪽으로 순서 재배치 — 제목 → 폼 → 연락처(PC 레이아웃은 위 기본 flex 유지) */
        .sales_info {
            display: contents;
        }
        .sales_title_group { order: 1; }
        .sales_form_area { order: 2; }
        .sales_info_contact { order: 3; }

        .sales_info_contact { gap: 32px; }
        .sales_title_group .label { font-size: 14px; }
        .sales_title_group .title { font-size: 26px; line-height: 36px; }
        .sales_info_block .name { font-size: 14px; line-height: 22px; }
        .sales_info_block .value { font-size: 14px; line-height: 22px; }
        .sales_phone_rows span { font-size: 14px; line-height: 22px; }
        .sales_info_block.address_block { width: 100%; }

        /* 폼 영역 */
        .sales_form_area { gap: 40px; }
        .sales_step { gap: 20px; }
        .sales_step_no { font-size: 13px; }
        .sales_step_tit { font-size: 18px; line-height: 28px; }
        .sales_field label { font-size: 13px; }
        .sales_input, .sales_select { padding: 12px 0; font-size: 14px; }
        .sales_textarea { padding: 12px; min-height: 160px; font-size: 14px; }
        .sales_radio_wrap { gap: 10px; }
        .sales_radio { font-size: 13px; }
        .sales_file_btn { height: 44px; font-size: 13px; }
        .sales_policy_box { padding: 16px; gap: 10px; }
        .sales_policy_check { font-size: 14px; line-height: 22px; }
        .sales_policy_content { font-size: 13px; }
        .sales_submit_btn { width: 100%; height: 48px; font-size: 14px; }
    }

    @media (max-width: 400px) {
        .sales_title_group .title { font-size: 22px; line-height: 30px; }
        .sales_step_tit { font-size: 16px; }
    }
</style>

<main id="sub_contents" class="contact_page contact_sales_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_support']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_inquiry_sales']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_inquiry_sales']; ?></h2>
                    <p class="sub_page_desc"><?php echo htmlspecialchars($lang['sales_hero_desc'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                </div>
            </div>
            <div class="sub_visual_img" style="background-image: url('/images/sub/contact.png');">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/contact.php" class="sub_tab_item"><?php echo $lang['sub_inquiry_1to1']; ?></a>
                        <a href="/pages/contact_sales.php" class="sub_tab_item active"><?php echo $lang['sub_inquiry_sales']; ?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="sales_form_section">
        <div class="sub_inner">
            <form class="sales_form_wrap" action="/pages/contact_sales_submit.php" method="post" enctype="multipart/form-data">
                <div class="sales_info">
                    <div class="sales_title_group">
                        <span class="label"><?php echo htmlspecialchars($lang['sales_label'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
                        <h3 class="title"><?php echo $lang['sub_inquiry_sales']; ?></h3>
                    </div>
                    <div class="sales_info_contact">
                        <div class="sales_info_block">
                            <p class="name"><?php echo htmlspecialchars($lang['sales_phone_label'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                            <div class="sales_phone_rows">
                                <div class="row">
                                    <span><?php echo htmlspecialchars($lang['sales_tel_quality'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
                                    <span><?php echo htmlspecialchars($lang['sales_tel_sales'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
                                    <span><?php echo htmlspecialchars($lang['sales_tel_admin'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
                                </div>
                                <div class="row">
                                    <span><?php echo htmlspecialchars($lang['sales_tel_purchase'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
                                    <span><?php echo htmlspecialchars($lang['sales_tel_rnd'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
                                </div>
                            </div>
                        </div>
                        <div class="sales_info_block address_block">
                            <p class="name"><?php echo htmlspecialchars($lang['sales_address_label'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                            <p class="value"><?php echo htmlspecialchars($lang['sales_address_value'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                        </div>
                    </div>
                </div>

                <div class="sales_form_area">
                    <section class="sales_step">
                        <div class="sales_step_head">
                            <span class="sales_step_no">STEP 01</span>
                            <p class="sales_step_tit"><?php echo htmlspecialchars($lang['sales_step1_title'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                        </div>
                        <div class="sales_grid_2">
                            <div class="sales_field"><label><?php echo htmlspecialchars($lang['sales_form_company'] ?? '', ENT_QUOTES, 'UTF-8'); ?><span class="req">*</span></label><input class="sales_input" type="text" name="company_name" placeholder="<?php echo htmlspecialchars($lang['sales_form_company_ph'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required></div>
                            <div class="sales_field"><label><?php echo htmlspecialchars($lang['sales_form_position'] ?? '', ENT_QUOTES, 'UTF-8'); ?><span class="req">*</span></label><input class="sales_input" type="text" name="position_name" placeholder="<?php echo htmlspecialchars($lang['sales_form_position_ph'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required></div>
                            <div class="sales_field"><label><?php echo htmlspecialchars($lang['sales_form_name'] ?? '', ENT_QUOTES, 'UTF-8'); ?><span class="req">*</span></label><input class="sales_input" type="text" name="writer_name" placeholder="<?php echo htmlspecialchars($lang['sales_form_name_ph'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required></div>
                            <div class="sales_field"><label><?php echo htmlspecialchars($lang['sales_form_email'] ?? '', ENT_QUOTES, 'UTF-8'); ?><span class="req">*</span></label><input class="sales_input" type="email" name="writer_email" placeholder="<?php echo htmlspecialchars($lang['sales_form_email_ph'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required></div>
                            <div class="sales_field"><label><?php echo htmlspecialchars($lang['sales_form_phone'] ?? '', ENT_QUOTES, 'UTF-8'); ?><span class="req">*</span></label><input class="sales_input" type="text" name="writer_phone" placeholder="<?php echo htmlspecialchars($lang['sales_form_phone_ph'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required></div>
                            <div class="sales_field">
                                <label><?php echo htmlspecialchars($lang['sales_form_country'] ?? '', ENT_QUOTES, 'UTF-8'); ?><span class="req">*</span></label>
                                <select class="sales_select" name="country" required>
                                    <option value=""><?php echo htmlspecialchars($lang['sales_form_country_ph'] ?? '', ENT_QUOTES, 'UTF-8'); ?></option>
                                    <option value="Korea"><?php echo htmlspecialchars($lang['sales_country_korea'] ?? 'Korea', ENT_QUOTES, 'UTF-8'); ?></option>
                                    <option value="China"><?php echo htmlspecialchars($lang['sales_country_china'] ?? 'China', ENT_QUOTES, 'UTF-8'); ?></option>
                                    <option value="Japan"><?php echo htmlspecialchars($lang['sales_country_japan'] ?? 'Japan', ENT_QUOTES, 'UTF-8'); ?></option>
                                    <option value="USA"><?php echo htmlspecialchars($lang['sales_country_usa'] ?? 'USA', ENT_QUOTES, 'UTF-8'); ?></option>
                                    <option value="Other"><?php echo htmlspecialchars($lang['sales_country_other'] ?? 'Other', ENT_QUOTES, 'UTF-8'); ?></option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section class="sales_step">
                        <div class="sales_step_head">
                            <span class="sales_step_no">STEP 02</span>
                            <p class="sales_step_tit"><?php echo htmlspecialchars($lang['sales_step2_title'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                        </div>
                        <div class="sales_field">
                            <label><?php echo htmlspecialchars($lang['sales_form_category'] ?? '', ENT_QUOTES, 'UTF-8'); ?><span class="req">*</span></label>
                            <div class="sales_radio_wrap">
                                <label class="sales_radio"><input type="radio" name="inquiry_category" value="product_brand" required checked> <?php echo htmlspecialchars($lang['sales_cat_product_brand'] ?? '', ENT_QUOTES, 'UTF-8'); ?></label>
                                <label class="sales_radio"><input type="radio" name="inquiry_category" value="partnership"> <?php echo htmlspecialchars($lang['sales_cat_partnership'] ?? '', ENT_QUOTES, 'UTF-8'); ?></label>
                                <label class="sales_radio"><input type="radio" name="inquiry_category" value="product_sponsorship"> <?php echo htmlspecialchars($lang['sales_cat_product_sponsorship'] ?? '', ENT_QUOTES, 'UTF-8'); ?></label>
                                <label class="sales_radio"><input type="radio" name="inquiry_category" value="corporate_general"> <?php echo htmlspecialchars($lang['sales_cat_corporate_general'] ?? '', ENT_QUOTES, 'UTF-8'); ?></label>
                            </div>
                        </div>
                        <div class="sales_field">
                            <label><?php echo htmlspecialchars($lang['sales_form_content'] ?? '', ENT_QUOTES, 'UTF-8'); ?><span class="req">*</span></label>
                            <textarea class="sales_textarea" name="content" placeholder="<?php echo htmlspecialchars($lang['sales_form_content_ph'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required></textarea>
                        </div>
                        <div class="sales_file_row">
                            <div class="sales_field"><label><?php echo htmlspecialchars($lang['sales_form_attach'] ?? '', ENT_QUOTES, 'UTF-8'); ?><span class="req">*</span></label><input class="sales_input" type="text" id="sales_file_name" placeholder="<?php echo htmlspecialchars($lang['sales_form_attach_ph'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" readonly></div>
                            <button type="button" class="sales_file_btn" onclick="document.getElementById('sales_file').click();"><?php echo htmlspecialchars($lang['sales_form_file_btn'] ?? '', ENT_QUOTES, 'UTF-8'); ?></button>
                            <input type="file" id="sales_file" name="attach_file" style="display:none;" onchange="document.getElementById('sales_file_name').value=this.files.length?this.files[0].name:'';" required>
                        </div>
                    </section>

                    <section class="sales_step">
                        <div class="sales_step_head">
                            <span class="sales_step_no">STEP 03</span>
                            <p class="sales_step_tit"><?php echo htmlspecialchars($lang['sales_step3_title'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                        </div>
                        <div class="sales_policy_box">
                            <div class="sales_policy_top">
                                <label class="sales_policy_check">
                                    <input type="checkbox" name="agree_privacy" value="Y" required>
                                    <?php echo htmlspecialchars($lang['sales_privacy_agree'] ?? '', ENT_QUOTES, 'UTF-8'); ?> <span class="req"><?php echo htmlspecialchars($lang['sales_privacy_required'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
                                </label>
                                <span>⌃</span>
                            </div>
                            <div class="sales_policy_content">
                                <p><?php echo htmlspecialchars($lang['sales_privacy_p1'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                                <p><?php echo htmlspecialchars($lang['sales_privacy_p2'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                                <p><?php echo htmlspecialchars($lang['sales_privacy_p3'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                            </div>
                        </div>
                        <button type="submit" class="sales_submit_btn"><?php echo htmlspecialchars($lang['sales_submit'] ?? '', ENT_QUOTES, 'UTF-8'); ?></button>
                    </section>
                </div>
            </form>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
