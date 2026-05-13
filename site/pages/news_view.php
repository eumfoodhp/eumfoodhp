<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

$idx = isset($_GET['idx']) ? mysqli_real_escape_string($conn, $_GET['idx']) : '';
if (!$idx) {
    echo "<script>location.href='news_press.php';</script>";
    exit;
}

$create_table_sql = "CREATE TABLE IF NOT EXISTS press (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    p_title_ko VARCHAR(255) NOT NULL,
    p_title_en VARCHAR(255) DEFAULT NULL,
    p_title_zh VARCHAR(255) DEFAULT NULL,
    p_content_ko TEXT,
    p_content_en TEXT,
    p_content_zh TEXT,
    file_name_ko VARCHAR(255) DEFAULT NULL,
    file_ori_ko VARCHAR(255) DEFAULT NULL,
    file_name_en VARCHAR(255) DEFAULT NULL,
    file_ori_en VARCHAR(255) DEFAULT NULL,
    file_name_zh VARCHAR(255) DEFAULT NULL,
    file_ori_zh VARCHAR(255) DEFAULT NULL,
    view_count INT NOT NULL DEFAULT 0,
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
mysqli_query($conn, $create_table_sql);

$view_cookie_name = "news_view_" . $idx;
if (!isset($_COOKIE[$view_cookie_name])) {
    mysqli_query($conn, "UPDATE press SET view_count = view_count + 1 WHERE idx = '$idx'");
    setcookie($view_cookie_name, "visited", time() + 86400, "/");
}

include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'ko';
if (!in_array($current_lang, ['ko', 'en', 'zh'])) {
    $current_lang = 'ko';
}

$title_col = 'p_title_' . $current_lang;
$content_col = 'p_content_' . $current_lang;
$file_name_col = 'file_name_' . $current_lang;
$file_ori_col = 'file_ori_' . $current_lang;

$sql = "SELECT
            idx,
            $title_col AS title,
            $content_col AS content,
            $file_name_col AS file_nm,
            $file_ori_col AS file_ori,
            view_count,
            reg_date
        FROM press
        WHERE idx = '$idx'";
$res = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($res);

if (!$row) {
    echo "<script>alert('존재하지 않는 보도자료입니다.'); location.href='news_press.php';</script>";
    exit;
}
?>

<link rel="stylesheet" href="/css/sub.css">
<style>
    .news_view_section { padding: 120px 0 140px; }
    .news_view_container { width: 100%; max-width: 1200px; margin: 0 auto; }
    .news_view_header { border-bottom: 1px solid #e5e5ec; padding-bottom: 32px; margin-bottom: 48px; }
    .news_view_title { margin: 0 0 20px; color: #222; font-size: 36px; line-height: 50px; letter-spacing: -0.9px; font-weight: 700; word-break: keep-all; }
    .news_view_info { display: flex; gap: 20px; color: #767676; font-size: 15px; line-height: 24px; }
    .news_view_content { min-height: 320px; color: #444; font-size: 16px; line-height: 1.9; letter-spacing: -0.2px; margin-bottom: 60px; word-break: break-word; }

    .news_file_section {
        background: #f8f9fa; border: 1px solid #eee; border-radius: 8px;
        padding: 20px 30px; margin-bottom: 60px;
        display: flex; align-items: center; justify-content: space-between; gap: 20px;
    }
    .news_file_name { display: flex; align-items: center; gap: 12px; color: #333; font-weight: 500; }
    .news_file_btn {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 9px 16px; border: 1px solid #ff5d27; border-radius: 4px;
        color: #ff5d27; font-size: 14px; font-weight: 700; text-decoration: none;
        transition: all 0.2s ease;
    }
    .news_file_btn:hover { background: #ff5d27; color: #fff; }

    .news_btn_wrap { border-top: 1px solid #eee; padding-top: 40px; text-align: center; }
    .news_btn_list {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 160px; height: 52px; border-radius: 4px;
        background: #ff5d27; color: #fff; text-decoration: none; font-weight: 600;
    }

    @media (max-width: 768px) {
        .news_view_section { padding: 80px 0 100px; }
        .news_view_title { font-size: 28px; line-height: 40px; }
        .news_view_info { flex-direction: column; gap: 6px; }
        .news_file_section { flex-direction: column; align-items: flex-start; }
    }
</style>

<main id="sub_contents">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_news']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_news_press']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_news_press']; ?></h2>
                    <p class="sub_page_desc">
                        <?php
                            if ($current_lang == 'ko') echo '㈜이음푸드시스템의 보도자료와 언론 소식을 전해드립니다.';
                            else if ($current_lang == 'en') echo 'Discover press releases and media updates from Eum Food System Co., Ltd.';
                            else echo '为您提供易音食品系统有限公司的新闻稿与媒体资讯。';
                        ?>
                    </p>
                </div>
            </div>

            <div class="sub_visual_img" style="background-image: url('/images/sub/notice-hero.png');">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/notice_list.php" class="sub_tab_item"><?php echo $lang['sub_notice']; ?></a>
                        <a href="/pages/news_press.php" class="sub_tab_item active"><?php echo $lang['sub_news_press']; ?></a>
                        <a href="/pages/board_list.php" class="sub_tab_item"><?php echo $lang['sub_board']; ?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="news_view_section">
        <div class="sub_inner">
            <div class="news_view_container">
                <div class="news_view_header">
                    <h3 class="news_view_title"><?php echo htmlspecialchars($row['title'] ?? ''); ?></h3>
                    <div class="news_view_info">
                        <span><?php echo ($current_lang == 'ko') ? '작성자 | ㈜이음푸드시스템' : (($current_lang == 'en') ? 'Writer | Eum Food System Co., Ltd.' : '作者 | 易音食品系统有限公司'); ?></span>
                        <span><?php echo ($current_lang == 'ko') ? '게시일' : (($current_lang == 'en') ? 'Date' : '发布日期'); ?> | <?php echo date('Y.m.d', strtotime($row['reg_date'])); ?></span>
                        <span><?php echo ($current_lang == 'ko') ? '조회수' : (($current_lang == 'en') ? 'Views' : '浏览数'); ?> | <?php echo number_format($row['view_count']); ?></span>
                    </div>
                </div>

                <div class="news_view_content">
                    <?php
                        if (!empty($row['content'])) {
                            echo nl2br($row['content']);
                        } else {
                            echo ($current_lang == 'ko') ? '<p style="color:#999;">내용이 없습니다.</p>' : (($current_lang == 'en') ? '<p style="color:#999;">No content available.</p>' : '<p style="color:#999;">暂无内容。</p>');
                        }
                    ?>
                </div>

                <?php if (!empty($row['file_nm'])): ?>
                    <div class="news_file_section">
                        <div class="news_file_name">
                            <span>📁</span>
                            <span><?php echo htmlspecialchars($row['file_ori'] ?? ''); ?></span>
                        </div>
                        <a href="/inc/download.php?file=<?php echo urlencode($row['file_nm']); ?>&ori=<?php echo urlencode($row['file_ori']); ?>" class="news_file_btn">DOWNLOAD</a>
                    </div>
                <?php endif; ?>

                <div class="news_btn_wrap">
                    <a href="/pages/news_press.php" class="news_btn_list">
                        <?php
                            if ($current_lang == 'ko') echo '목록으로';
                            else if ($current_lang == 'en') echo 'LIST';
                            else echo '返回列表';
                        ?>
                    </a>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
