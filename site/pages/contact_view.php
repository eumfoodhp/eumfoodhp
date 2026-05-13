<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'ko';
if (!in_array($current_lang, ['ko', 'en', 'zh'])) $current_lang = 'ko';

$idx = isset($_GET['idx']) ? (int)$_GET['idx'] : 0;
if ($idx < 1) {
    echo "<script>location.href='/pages/contact.php';</script>";
    exit;
}

$create_table_sql = "CREATE TABLE IF NOT EXISTS inquiry (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    writer_name VARCHAR(100) NOT NULL,
    writer_phone VARCHAR(50) DEFAULT NULL,
    writer_email VARCHAR(150) DEFAULT NULL,
    answer_content TEXT DEFAULT NULL,
    answer_admin VARCHAR(100) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    answer_date DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
mysqli_query($conn, $create_table_sql);

$res = mysqli_query($conn, "SELECT * FROM inquiry WHERE idx = '{$idx}'");
$row = $res ? mysqli_fetch_assoc($res) : null;
if (!$row) {
    echo "<script>alert('존재하지 않는 문의입니다.'); location.href='/pages/contact.php';</script>";
    exit;
}
?>

<link rel="stylesheet" href="/css/sub.css">
<style>
    .contact_view_section { padding: 120px 0 140px; }
    .contact_view_box { width: 100%; max-width: 1200px; margin: 0 auto; }
    .view_head { border-bottom: 1px solid #e5e5ec; padding-bottom: 24px; margin-bottom: 30px; }
    .view_head h3 { margin: 0 0 12px; font-size: 34px; line-height: 46px; color: #222; font-weight: 700; letter-spacing: -0.85px; }
    .view_meta { display: flex; gap: 18px; color: #767676; font-size: 15px; }
    .view_body, .view_answer { border: 1px solid #e5e5ec; border-radius: 12px; padding: 28px; margin-bottom: 20px; }
    .view_body { min-height: 220px; color: #444; line-height: 1.9; }
    .view_answer_title { margin: 0 0 12px; color: #ff5d27; font-size: 18px; line-height: 28px; font-weight: 600; }
    .view_answer_text { margin: 0; color: #444; line-height: 1.9; min-height: 80px; }
    .view_btns { display: flex; justify-content: center; margin-top: 30px; }
    .view_list_btn {
        min-width: 160px; height: 52px; border-radius: 4px; text-decoration: none;
        display: inline-flex; align-items: center; justify-content: center; background: #ff5d27; color: #fff; font-weight: 600;
    }
    @media (max-width: 768px) {
        .contact_view_section { padding: 80px 0 100px; }
        .view_head h3 { font-size: 28px; line-height: 40px; }
        .view_meta { flex-direction: column; gap: 6px; }
    }

    @media (max-width: 735px) {
        .contact_view_section { padding: 40px 0 56px; }
        .view_head { padding-bottom: 18px; margin-bottom: 20px; }
        .view_head h3 { font-size: 20px; line-height: 30px; margin-bottom: 10px; letter-spacing: -0.4px; }
        .view_meta { font-size: 13px; gap: 4px; }
        .view_body, .view_answer { padding: 18px; border-radius: 8px; font-size: 14px; line-height: 1.8; }
        .view_answer_title { font-size: 15px; line-height: 24px; margin-bottom: 8px; }
        .view_answer_text { font-size: 14px; min-height: 60px; }
        .view_btns { margin-top: 20px; }
        .view_list_btn { min-width: 130px; height: 44px; font-size: 14px; }
    }

    @media (max-width: 400px) {
        .view_head h3 { font-size: 17px; line-height: 26px; }
        .view_body, .view_answer { padding: 14px; font-size: 13px; }
    }
</style>

<main id="sub_contents" class="contact_page contact_view_page">
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
                    <p class="sub_page_desc"><?php echo ($current_lang == 'ko') ? $lang['contact_detail_desc'] : 'Inquiry Detail'; ?></p>
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

    <section class="contact_view_section">
        <div class="sub_inner">
            <div class="contact_view_box">
                <div class="view_head">
                    <h3><?php echo htmlspecialchars($row['subject']); ?></h3>
                    <div class="view_meta">
                        <span><?php echo ($current_lang == 'ko') ? $lang['contact_col_writer'] : 'Writer'; ?> | <?php echo htmlspecialchars($row['writer_name']); ?></span>
                        <span><?php echo ($current_lang == 'ko') ? $lang['contact_col_date'] : 'Date'; ?> | <?php echo date('Y.m.d', strtotime($row['reg_date'])); ?></span>
                        <span><?php echo ($current_lang == 'ko') ? $lang['contact_col_state'] : 'Status'; ?> | <?php echo ($row['status'] === 'done') ? (($current_lang == 'ko') ? $lang['contact_state_done'] : 'Answered') : (($current_lang == 'ko') ? $lang['contact_state_pending'] : 'Pending'); ?></span>
                    </div>
                </div>

                <div class="view_body"><?php echo nl2br(htmlspecialchars($row['content'])); ?></div>

                <div class="view_answer">
                    <h4 class="view_answer_title"><?php echo ($current_lang == 'ko') ? $lang['contact_answer_title'] : 'Answer'; ?></h4>
                    <p class="view_answer_text">
                        <?php
                            if (!empty(trim($row['answer_content'] ?? ''))) {
                                echo nl2br(htmlspecialchars($row['answer_content']));
                            } else {
                                echo ($current_lang == 'ko') ? $lang['contact_answer_empty'] : 'No answer yet.';
                            }
                        ?>
                    </p>
                </div>

                <div class="view_btns">
                    <a href="/pages/contact.php" class="view_list_btn"><?php echo ($current_lang == 'ko') ? $lang['contact_back_list'] : 'Back to List'; ?></a>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
