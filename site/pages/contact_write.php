<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'ko';
if (!in_array($current_lang, ['ko', 'en', 'zh'])) $current_lang = 'ko';
?>

<link rel="stylesheet" href="/css/sub.css">
<style>
    .contact_write_section { padding: 120px 0 140px; }
    .contact_write_box {
        width: 100%; max-width: 1000px; margin: 0 auto;
        border: 1px solid #e5e5ec; border-radius: 20px; background: #fff;
        padding: 40px;
    }
    .write_row { margin-bottom: 20px; }
    .write_row label { display: block; margin-bottom: 8px; color: #222; font-size: 16px; font-weight: 500; }
    .write_input, .write_textarea {
        width: 100%; border: 1px solid #ddd; border-radius: 4px; padding: 12px 14px;
        font-size: 16px; line-height: 24px; color: #222; background: #fff;
    }
    .write_textarea { min-height: 220px; resize: vertical; }
    .write_grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .write_btns { display: flex; justify-content: center; gap: 10px; margin-top: 30px; }
    .btn_submit, .btn_cancel {
        min-width: 140px; height: 48px; border-radius: 4px; text-decoration: none;
        display: inline-flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600;
    }
    .btn_submit { background: #ff5d27; color: #fff; border: 0; }
    .btn_cancel { background: #f4f4f4; color: #767676; }
    @media (max-width: 768px) {
        .contact_write_section { padding: 80px 0 100px; }
        .contact_write_box { padding: 24px; }
        .write_grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 735px) {
        .contact_write_section { padding: 40px 0 56px; }
        .contact_write_box { padding: 20px 16px; border-radius: 14px; }
        .write_row label { font-size: 14px; margin-bottom: 6px; }
        .write_input, .write_textarea { font-size: 14px; padding: 10px 12px; }
        .write_textarea { min-height: 160px; }
        .write_btns { gap: 8px; margin-top: 20px; }
        .btn_submit, .btn_cancel { min-width: 120px; height: 44px; font-size: 14px; }
    }

    @media (max-width: 400px) {
        .contact_write_box { padding: 16px 12px; }
        .btn_submit, .btn_cancel { min-width: 100px; height: 40px; font-size: 13px; }
    }
</style>

<main id="sub_contents" class="contact_page contact_write_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_support']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_inquiry_1to1']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_inquiry_1to1']; ?></h2>
                    <p class="sub_page_desc"><?php echo ($current_lang == 'ko') ? $lang['contact_write_desc'] : 'Write your inquiry.'; ?></p>
                </div>
            </div>
            <div class="sub_visual_img" style="background-image: url('/images/sub/contact.png');">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/contact.php" class="sub_tab_item active"><?php echo $lang['sub_inquiry_1to1']; ?></a>
                        <a href="/pages/contact_sales.php" class="sub_tab_item"><?php echo $lang['sub_inquiry_sales']; ?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="contact_write_section">
        <div class="sub_inner">
            <form action="/pages/contact_write_db.php" method="post" class="contact_write_box">
                <div class="write_row">
                    <label><?php echo ($current_lang == 'ko') ? $lang['contact_label_subject'] : 'Title'; ?></label>
                    <input type="text" name="subject" class="write_input" required>
                </div>

                <div class="write_grid">
                    <div class="write_row">
                        <label><?php echo ($current_lang == 'ko') ? $lang['contact_label_writer'] : 'Writer'; ?></label>
                        <input type="text" name="writer_name" class="write_input" required>
                    </div>
                    <div class="write_row">
                        <label><?php echo ($current_lang == 'ko') ? $lang['contact_label_phone'] : 'Phone'; ?></label>
                        <input type="text" name="writer_phone" class="write_input">
                    </div>
                </div>

                <div class="write_row">
                    <label>Email</label>
                    <input type="email" name="writer_email" class="write_input">
                </div>

                <div class="write_row">
                    <label><?php echo ($current_lang == 'ko') ? $lang['contact_label_content'] : 'Content'; ?></label>
                    <textarea name="content" class="write_textarea" required></textarea>
                </div>

                <div class="write_btns">
                    <button type="submit" class="btn_submit"><?php echo ($current_lang == 'ko') ? $lang['contact_submit'] : 'Submit'; ?></button>
                    <a href="/pages/contact.php" class="btn_cancel"><?php echo ($current_lang == 'ko') ? $lang['contact_cancel'] : 'Cancel'; ?></a>
                </div>
            </form>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
