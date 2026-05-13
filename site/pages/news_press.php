<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'ko';
if (!in_array($current_lang, ['ko', 'en', 'zh'])) {
    $current_lang = 'ko';
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

$title_col = 'p_title_' . $current_lang;
$content_col = 'p_content_' . $current_lang;
$file_name_col = 'file_name_' . $current_lang;

$search_type = isset($_GET['search_type']) ? $_GET['search_type'] : 'title';
$search_word = isset($_GET['search_word']) ? trim($_GET['search_word']) : '';

$search_columns = [
    'title' => $title_col
];
if (!isset($search_columns[$search_type])) {
    $search_type = 'title';
}

$where_parts = ["1=1"];
if ($search_word !== '') {
    $search_word_esc = mysqli_real_escape_string($conn, $search_word);
    $where_parts[] = $search_columns[$search_type] . " LIKE '%" . $search_word_esc . "%'";
}
$where_clause = ' WHERE ' . implode(' AND ', $where_parts);

$list_size = 9;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;

$count_query = "SELECT COUNT(*) FROM press" . $where_clause;
$count_res = mysqli_query($conn, $count_query);
$total_records = (int)mysqli_fetch_row($count_res)[0];

$total_page = ($total_records > 0) ? (int)ceil($total_records / $list_size) : 1;
if ($page > $total_page) $page = $total_page;
$start_record = ($page - 1) * $list_size;

$block_size = 5;
$current_block = (int)ceil($page / $block_size);
$start_page = ($current_block - 1) * $block_size + 1;
$end_page = $start_page + $block_size - 1;
if ($end_page > $total_page) $end_page = $total_page;

$featured_query = "SELECT
    idx,
    $title_col AS title,
    $content_col AS content,
    $file_name_col AS file_nm,
    reg_date
FROM press
$where_clause
ORDER BY reg_date DESC, idx DESC
LIMIT 5";
$featured_res = mysqli_query($conn, $featured_query);
$featured_rows = [];
while ($f = mysqli_fetch_assoc($featured_res)) {
    $featured_rows[] = $f;
}

$hero_total = count($featured_rows);
$hero = isset($_GET['hero']) ? (int)$_GET['hero'] : 1;
if ($hero < 1) $hero = 1;
if ($hero_total > 0 && $hero > $hero_total) $hero = $hero_total;
$hero_item = ($hero_total > 0) ? $featured_rows[$hero - 1] : null;

$list_query = "SELECT
    idx,
    $title_col AS title,
    $content_col AS content,
    $file_name_col AS file_nm,
    reg_date
FROM press
$where_clause
ORDER BY reg_date DESC, idx DESC
LIMIT $start_record, $list_size";
$result = mysqli_query($conn, $list_query);

function press_image_url($file_nm) {
    if (empty($file_nm)) return '';
    $ext = strtolower(pathinfo($file_nm, PATHINFO_EXTENSION));
    $image_ext = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    if (!in_array($ext, $image_ext)) return '';
    return '/upload/press/' . rawurlencode($file_nm);
}

function press_excerpt($text, $length = 90) {
    $plain = trim(strip_tags($text ?? ''));
    if ($plain === '') return '';
    if (function_exists('mb_strimwidth')) {
        return mb_strimwidth($plain, 0, $length, '...', 'UTF-8');
    }
    return (strlen($plain) > $length) ? substr($plain, 0, $length) . '...' : $plain;
}
?>

<link rel="stylesheet" href="/css/sub.css">
<style>
    .press_section { padding: 120px 0 140px; }
    .press_wrap { width: 100%; display: flex; flex-direction: column; gap: 80px; }

    .press_title_group { width: 100%; display: flex; flex-direction: column; gap: 8px; }
    .press_title_group .label { color: #ff5d27; font-size: 18px; line-height: 28px; letter-spacing: -0.45px; font-weight: 500; }
    .press_title_group .title { color: #222; font-size: 42px; line-height: 60px; letter-spacing: -1.05px; font-weight: 700; }

    .press_featured { display: flex; gap: 56px; align-items: center; width: 100%; }
    .press_featured_visual {
        width: 776px; height: 458px; border-radius: 20px; flex-shrink: 0;
        background: #f0f0f0 center center / cover no-repeat;
        overflow: hidden;
    }
    .press_featured_info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; gap: 60px; }
    .press_featured_text { display: flex; flex-direction: column; gap: 28px; }
    .press_badge { display: inline-flex; align-items: center; gap: 6px; color: #ff5d27; font-size: 18px; line-height: 28px; letter-spacing: -0.45px; font-weight: 500; }
    .press_badge::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: #ff5d27; }
    .press_featured_title { color: #222; font-size: 24px; line-height: 34px; letter-spacing: -0.6px; font-weight: 500; margin: 0; word-break: keep-all; }
    .press_featured_title_link { text-decoration: none; color: inherit; }
    .press_featured_title_link:hover .press_featured_title { color: #ff5d27; }
    .press_featured_date { color: #767676; font-size: 16px; line-height: 26px; letter-spacing: -0.4px; font-weight: 300; margin: 0; }
    .press_featured_nav { width: 100%; display: flex; align-items: center; justify-content: space-between; }
    .press_counter { display: flex; gap: 4px; align-items: center; font-size: 18px; line-height: 28px; letter-spacing: -0.45px; font-weight: 500; }
    .press_counter .current { color: #222; }
    .press_counter .sep, .press_counter .total { color: #767676; }
    .press_arrow_group { display: flex; gap: 12px; align-items: center; }
    .press_arrow {
        width: 52px; height: 52px; border-radius: 999px; text-decoration: none;
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 24px; line-height: 1; border: 0;
    }
    .press_arrow.prev { background: #f4f4f4; color: #b7b7b7; }
    .press_arrow.next { background: #ff5d27; color: #fff; }
    .press_arrow.disabled { pointer-events: none; opacity: 0.5; }

    .press_list_area { width: 100%; display: flex; flex-direction: column; gap: 60px; }
    .press_list_top { width: 100%; display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
    .press_total { margin: 0; color: #767676; font-size: 20px; line-height: 30px; letter-spacing: -0.5px; font-weight: 500; }
    .press_total span { color: #ff5d27; }
    .press_search_form { display: flex; gap: 12px; align-items: center; }
    .press_select, .press_search_input {
        height: 52px; border: 1px solid #e5e5ec; border-radius: 4px; background: #fff;
        padding: 0 20px; font-size: 14px; line-height: 22px; color: #505050;
    }
    .press_select { width: 160px; }
    .press_search_group { width: 360px; position: relative; }
    .press_search_input { width: 100%; padding-right: 46px; }
    .press_search_btn {
        position: absolute; top: 50%; right: 14px; transform: translateY(-50%);
        width: 24px; height: 24px; border: 0; background: transparent; cursor: pointer;
        color: #505050; font-size: 16px;
    }

    .press_grid { width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 48px 28px; }
    .press_card { text-decoration: none; color: inherit; display: flex; flex-direction: column; }
    .press_card_img {
        width: 100%; height: 300px; border-radius: 16px 16px 0 0;
        background: #f0f0f0 center center / cover no-repeat;
    }
    .press_card_body {
        border: 1px solid #e5e5ec; border-top: 0; border-radius: 0 0 16px 16px;
        padding: 28px; display: flex; flex-direction: column; gap: 20px;
    }
    .press_card_head { display: flex; flex-direction: column; gap: 12px; }
    .press_card_badge {
        color: #ff5d27; font-size: 14px; line-height: 22px; letter-spacing: -0.35px; font-weight: 500;
        display: inline-flex; align-items: center; gap: 4px;
    }
    .press_card_badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #ff5d27; }
    .press_card_title {
        margin: 0; color: #222; font-size: 20px; line-height: 30px; letter-spacing: -0.5px; font-weight: 500;
        height: 60px; overflow: hidden;
    }
    .press_card_date { margin: 0; color: #767676; font-size: 16px; line-height: 26px; letter-spacing: -0.4px; font-weight: 300; }
    .press_empty {
        width: 100%; border-top: 1px solid #e5e5ec; border-bottom: 1px solid #e5e5ec;
        padding: 140px 20px; text-align: center; color: #999;
        font-size: 16px; line-height: 26px;
    }

    .press_pagination { display: flex; align-items: center; justify-content: center; gap: 4px; }
    .press_pagination a, .press_pagination span {
        width: 40px; height: 40px; border-radius: 4px;
        display: inline-flex; align-items: center; justify-content: center;
        text-decoration: none; color: #767676; font-size: 14px; line-height: 22px; letter-spacing: -0.35px; font-weight: 500;
    }
    .press_pagination .active { background: #ff5d27; color: #fff; }
    .press_pagination .page_next { font-size: 20px; color: #999; }

    @media (max-width: 1280px) {
        .press_featured { flex-direction: column; align-items: flex-start; }
        .press_featured_visual { width: 100%; height: min(52vw, 458px); }
        .press_featured_info { width: 100%; }
    }
    @media (max-width: 1024px) {
        .press_list_top { flex-direction: column; align-items: stretch; }
        .press_search_form { justify-content: flex-end; }
        .press_grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 768px) {
        .press_section { padding: 80px 0 100px; }
        .press_title_group .title { font-size: 34px; line-height: 46px; }
        .press_search_form { flex-direction: column; align-items: stretch; }
        .press_select, .press_search_group { width: 100%; }
        .press_grid { grid-template-columns: 1fr; }
        .press_card_img { height: 220px; }
    }

    @media (max-width: 735px) {
        .press_section { padding: 40px 0 56px; }
        .press_wrap { gap: 40px; }
        .press_title_group .label { font-size: 14px; line-height: 22px; }
        .press_title_group .title { font-size: 26px; line-height: 36px; letter-spacing: -0.6px; }

        /* 피처드 */
        .press_featured { gap: 20px; }
        .press_featured_visual { height: 200px; border-radius: 12px; }
        .press_featured_info { gap: 20px; }
        .press_featured_text { gap: 16px; }
        .press_badge { font-size: 14px; line-height: 22px; }
        .press_featured_title { font-size: 17px; line-height: 26px; }
        .press_featured_date { font-size: 13px; line-height: 20px; }
        .press_counter { font-size: 15px; }
        .press_arrow { width: 40px; height: 40px; font-size: 20px; }
        .press_arrow_group { gap: 8px; }

        /* 리스트 */
        .press_list_area { gap: 28px; }
        .press_list_top { gap: 12px; }
        .press_total { font-size: 16px; }
        .press_select, .press_search_input { height: 40px; font-size: 14px; }

        /* 카드 */
        .press_grid { gap: 20px; }
        .press_card_img { height: 180px; border-radius: 12px 12px 0 0; }
        .press_card_body { padding: 18px; gap: 10px; }
        .press_card_title { font-size: 15px; line-height: 22px; height: auto; }
        .press_card_date { font-size: 13px; }

        .press_empty { padding: 80px 16px; font-size: 14px; }
    }

    @media (max-width: 400px) {
        .press_featured_visual { height: 160px; }
        .press_featured_title { font-size: 15px; }
        .press_card_img { height: 140px; }
        .press_card_body { padding: 14px; }
        .press_card_title { font-size: 14px; }
    }
</style>

<main id="sub_contents" class="newsroom_page press_list_page">
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

    <section class="press_section">
        <div class="sub_inner">
            <div class="press_wrap">
                <div class="press_title_group">
                    <span class="label"><?php echo ($current_lang == 'ko') ? ($lang['press_release_label_ko'] ?? 'PRESS RELEASE') : 'PRESS RELEASE'; ?></span>
                    <h3 class="title"><?php echo ($current_lang == 'ko') ? ($lang['sub_news_press'] ?? '보도자료') : (($current_lang == 'en') ? 'Press Release' : '新闻稿'); ?></h3>
                </div>

                <?php
                    $hero_img = '';
                    if ($hero_item) $hero_img = press_image_url($hero_item['file_nm']);

                    $base_qs = [];
                    if ($search_type !== '') $base_qs['search_type'] = $search_type;
                    if ($search_word !== '') $base_qs['search_word'] = $search_word;
                    if ($page > 1) $base_qs['page'] = $page;
                ?>

                <div class="press_featured">
                    <?php if ($hero_item): ?>
                        <a href="/pages/news_view.php?idx=<?php echo $hero_item['idx']; ?>" class="press_featured_visual" style="<?php echo $hero_img ? "background-image:url('{$hero_img}');" : ''; ?>"></a>
                    <?php else: ?>
                        <div class="press_featured_visual" style="<?php echo $hero_img ? "background-image:url('{$hero_img}');" : ''; ?>"></div>
                    <?php endif; ?>
                    <div class="press_featured_info">
                        <div class="press_featured_text">
                            <span class="press_badge">NEWS</span>
                            <?php if ($hero_item): ?>
                                <a href="/pages/news_view.php?idx=<?php echo $hero_item['idx']; ?>" class="press_featured_title_link">
                                    <h4 class="press_featured_title"><?php echo htmlspecialchars($hero_item['title'] ?? ''); ?></h4>
                                </a>
                            <?php else: ?>
                                <h4 class="press_featured_title">
                                    <?php echo ($current_lang == 'ko') ? ($lang['press_empty_ko'] ?? '등록된 보도자료가 없습니다.') : (($current_lang == 'en') ? 'No press releases found.' : '暂无新闻稿。'); ?>
                                </h4>
                            <?php endif; ?>
                            <p class="press_featured_date"><?php echo $hero_item ? date('Y.m.d', strtotime($hero_item['reg_date'])) : '-'; ?></p>
                        </div>

                        <div class="press_featured_nav">
                            <div class="press_counter">
                                <span class="current"><?php echo ($hero_total > 0) ? $hero : 0; ?></span>
                                <span class="sep">/</span>
                                <span class="total"><?php echo $hero_total; ?></span>
                            </div>
                            <div class="press_arrow_group">
                                <?php $prev_hero = $hero - 1; ?>
                                <?php if ($hero_total > 0 && $prev_hero >= 1): ?>
                                    <?php $prev_qs = $base_qs; $prev_qs['hero'] = $prev_hero; ?>
                                    <a href="?<?php echo http_build_query($prev_qs); ?>" class="press_arrow prev" aria-label="previous">‹</a>
                                <?php else: ?>
                                    <span class="press_arrow prev disabled">‹</span>
                                <?php endif; ?>

                                <?php $next_hero = $hero + 1; ?>
                                <?php if ($hero_total > 0 && $next_hero <= $hero_total): ?>
                                    <?php $next_qs = $base_qs; $next_qs['hero'] = $next_hero; ?>
                                    <a href="?<?php echo http_build_query($next_qs); ?>" class="press_arrow next" aria-label="next">›</a>
                                <?php else: ?>
                                    <span class="press_arrow next disabled">›</span>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="press_list_area">
                    <div class="press_list_top">
                        <p class="press_total">Total <span><?php echo number_format($total_records); ?></span></p>
                        <form method="get" class="press_search_form">
                            <select name="search_type" class="press_select">
                                <option value="title" <?php echo ($search_type === 'title') ? 'selected' : ''; ?>>
                                    <?php echo ($current_lang == 'ko') ? '제목' : (($current_lang == 'en') ? 'Title' : '标题'); ?>
                                </option>
                            </select>
                            <div class="press_search_group">
                                <input
                                    type="text"
                                    name="search_word"
                                    class="press_search_input"
                                    value="<?php echo htmlspecialchars($search_word); ?>"
                                    placeholder="<?php echo ($current_lang == 'ko') ? ($lang['press_search_placeholder_ko'] ?? '검색어를 입력해주세요') : (($current_lang == 'en') ? 'Please enter a keyword' : '请输入关键词'); ?>"
                                >
                                <button type="submit" class="press_search_btn" aria-label="search">⌕</button>
                            </div>
                        </form>
                    </div>

                    <?php if (mysqli_num_rows($result) > 0): ?>
                        <div class="press_grid">
                            <?php while ($row = mysqli_fetch_assoc($result)): ?>
                                <?php $card_img = press_image_url($row['file_nm']); ?>
                                <a href="/pages/news_view.php?idx=<?php echo $row['idx']; ?>" class="press_card">
                                    <div class="press_card_img" style="<?php echo $card_img ? "background-image:url('{$card_img}');" : ''; ?>"></div>
                                    <div class="press_card_body">
                                        <div class="press_card_head">
                                            <span class="press_card_badge">NEWS</span>
                                            <h5 class="press_card_title"><?php echo htmlspecialchars(press_excerpt($row['title'] ?? '', 72)); ?></h5>
                                        </div>
                                        <p class="press_card_date"><?php echo date('Y.m.d', strtotime($row['reg_date'])); ?></p>
                                    </div>
                                </a>
                            <?php endwhile; ?>
                        </div>
                    <?php else: ?>
                        <div class="press_empty">
                            <?php echo ($current_lang == 'ko') ? ($lang['press_empty_ko'] ?? '등록된 보도자료가 없습니다.') : (($current_lang == 'en') ? 'No press releases found.' : '暂无新闻稿。'); ?>
                        </div>
                    <?php endif; ?>

                    <?php if ($total_records > 0): ?>
                        <div class="press_pagination">
                            <?php
                                $query_base = [];
                                if ($search_type !== '') $query_base['search_type'] = $search_type;
                                if ($search_word !== '') $query_base['search_word'] = $search_word;
                                if ($hero > 1) $query_base['hero'] = $hero;
                            ?>
                            <?php for ($i = $start_page; $i <= $end_page; $i++): ?>
                                <?php $query_base['page'] = $i; ?>
                                <?php if ($i == $page): ?>
                                    <span class="active"><?php echo $i; ?></span>
                                <?php else: ?>
                                    <a href="?<?php echo http_build_query($query_base); ?>"><?php echo $i; ?></a>
                                <?php endif; ?>
                            <?php endfor; ?>

                            <?php if ($end_page < $total_page): ?>
                                <span>...</span>
                                <?php $query_base['page'] = $total_page; ?>
                                <a href="?<?php echo http_build_query($query_base); ?>"><?php echo $total_page; ?></a>
                            <?php endif; ?>

                            <?php if ($page < $total_page): ?>
                                <?php $query_base['page'] = $page + 1; ?>
                                <a href="?<?php echo http_build_query($query_base); ?>" class="page_next" aria-label="next page">›</a>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>
