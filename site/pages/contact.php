<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'ko';
if (!in_array($current_lang, ['ko', 'en', 'zh'])) $current_lang = 'ko';

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

$sort = isset($_GET['sort']) ? $_GET['sort'] : 'latest';
$search_type = isset($_GET['search_type']) ? $_GET['search_type'] : 'subject';
$search_word = isset($_GET['search_word']) ? trim($_GET['search_word']) : '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;
$list_size = 8;

if (!in_array($sort, ['latest', 'oldest'])) $sort = 'latest';
if (!in_array($search_type, ['subject', 'writer'])) $search_type = 'subject';

$where = '';
if ($search_word !== '') {
    $search_word_esc = mysqli_real_escape_string($conn, $search_word);
    $search_col = ($search_type === 'writer') ? 'writer_name' : 'subject';
    $where = " WHERE {$search_col} LIKE '%{$search_word_esc}%'";
}

$count_query = "SELECT COUNT(*) FROM inquiry" . $where;
$count_res = mysqli_query($conn, $count_query);
$total_records = $count_res ? (int)mysqli_fetch_row($count_res)[0] : 0;

$total_page = ($total_records > 0) ? (int)ceil($total_records / $list_size) : 1;
if ($page > $total_page) $page = $total_page;
$start_record = ($page - 1) * $list_size;

$order_sql = ($sort === 'oldest') ? 'ORDER BY reg_date ASC, idx ASC' : 'ORDER BY reg_date DESC, idx DESC';
$query = "SELECT idx, subject, writer_name, status, reg_date
          FROM inquiry
          {$where}
          {$order_sql}
          LIMIT {$start_record}, {$list_size}";
$result = mysqli_query($conn, $query);

$block_size = 5;
$current_block = (int)ceil($page / $block_size);
$start_page = ($current_block - 1) * $block_size + 1;
$end_page = $start_page + $block_size - 1;
if ($end_page > $total_page) $end_page = $total_page;

function mask_name($name) {
    $name = trim($name);
    if ($name === '') return '-';
    if (function_exists('mb_substr')) {
        $first = mb_substr($name, 0, 1, 'UTF-8');
        return $first . '**';
    }
    return substr($name, 0, 1) . '**';
}
?>

<link rel="stylesheet" href="/css/sub.css">
<style>
    .contact_inquiry_section { padding: 120px 0 140px; }
    .contact_inquiry_wrap { width: 100%; display: flex; flex-direction: column; gap: 40px; }
    .contact_title_group { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .contact_title_group .label { color: #ff5d27; font-size: 18px; line-height: 28px; letter-spacing: -0.45px; font-weight: 500; }
    .contact_title_group .title { color: #222; font-size: 42px; line-height: 60px; letter-spacing: -1.05px; font-weight: 700; }

    .contact_filter_row { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
    .contact_filters { display: flex; gap: 12px; align-items: center; }
    .contact_select, .contact_search_input {
        height: 44px; border: 1px solid #e5e5ec; border-radius: 4px; background: #fff;
        padding: 0 20px; color: #505050; font-size: 16px; line-height: 26px;
    }
    .contact_select { width: 160px; }
    .contact_search_group { width: 360px; position: relative; }
    .contact_search_input { width: 100%; padding-right: 44px; }
    .contact_search_btn {
        position: absolute; top: 50%; right: 12px; transform: translateY(-50%);
        width: 24px; height: 24px; border: 0; background: transparent; color: #505050; font-size: 16px;
    }
    .contact_write_btn {
        width: 123px; height: 44px; border-radius: 4px; background: #ff5d27;
        color: #fff; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
        font-size: 14px; line-height: 22px; letter-spacing: -0.35px; font-weight: 500;
    }

    .inquiry_table_wrap { width: 100%; border-top: 1px solid #e5e5ec; }
    .inquiry_table_head, .inquiry_table_row {
        width: 100%; display: grid; grid-template-columns: 120px 1fr 240px 240px 240px; align-items: center;
        border-bottom: 1px solid #e5e5ec;
    }
    .inquiry_table_head > div {
        height: 74px; background: #f6f7fb; display: flex; align-items: center; justify-content: center;
        color: #767676; font-size: 16px; line-height: 26px; letter-spacing: -0.4px; font-weight: 500;
    }
    .inquiry_table_head > div:first-child { border-top-left-radius: 16px; }
    .inquiry_table_head > div:last-child { border-top-right-radius: 16px; }

    .inquiry_table_row > div {
        min-height: 90px; padding: 16px; display: flex; align-items: center; justify-content: center;
        color: #767676; font-size: 16px; line-height: 26px; letter-spacing: -0.4px; font-weight: 300;
    }
    .inquiry_table_row .td_subject { justify-content: flex-start; }
    .inquiry_table_row .subject_link {
        color: #222; text-decoration: none; font-size: 20px; line-height: 30px; letter-spacing: -0.5px; font-weight: 500;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; width: 100%;
    }
    .inquiry_state {
        min-width: 86px; height: 46px; border-radius: 9999px;
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 14px; line-height: 22px; letter-spacing: -0.35px; font-weight: 500;
    }
    .inquiry_state.done { background: #fbeae7; color: #ff5d27; }
    .inquiry_state.pending { background: #f4f4f4; color: #767676; }

    .inquiry_empty {
        border-bottom: 1px solid #e5e5ec; text-align: center; color: #999;
        font-size: 16px; line-height: 26px; padding: 120px 20px;
    }

    .inquiry_pagination { display: flex; align-items: center; justify-content: center; gap: 4px; }
    .inquiry_pagination a, .inquiry_pagination span {
        width: 40px; height: 40px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center;
        text-decoration: none; color: #767676; font-size: 14px; line-height: 22px; letter-spacing: -0.35px; font-weight: 500;
    }
    .inquiry_pagination .active { background: #ff5d27; color: #fff; }
    .inquiry_pagination .page_next { font-size: 20px; color: #999; }

    @media (max-width: 1280px) {
        .inquiry_table_head, .inquiry_table_row { grid-template-columns: 100px 1fr 150px 150px 150px; }
        .inquiry_table_row .subject_link { font-size: 18px; line-height: 28px; }
    }
    @media (max-width: 1024px) {
        .contact_filter_row { flex-direction: column; align-items: stretch; }
        .contact_filters { flex-wrap: wrap; }
        .contact_write_btn { align-self: flex-end; }
        .inquiry_table_wrap { overflow-x: auto; }
        .inquiry_table_inner { min-width: 900px; }
    }
    @media (max-width: 768px) {
        .contact_inquiry_section { padding: 80px 0 100px; }
        .contact_title_group .title { font-size: 34px; line-height: 46px; }
        .contact_filters { flex-direction: column; align-items: stretch; }
        .contact_select, .contact_search_group { width: 100%; }
    }

    @media (max-width: 735px) {
        .contact_inquiry_section { padding: 40px 0 56px; }
        .contact_inquiry_wrap { gap: 28px; }
        .contact_title_group .label { font-size: 14px; }
        .contact_title_group .title { font-size: 26px; line-height: 36px; }

        .contact_filter_row { gap: 10px; }
        .contact_select, .contact_search_input { height: 40px; font-size: 14px; padding: 0 12px; }
        .contact_search_input { padding-right: 38px; }
        .contact_write_btn { width: 100%; height: 40px; }

        /* 테이블 → 카드형 전환 */
        .inquiry_table_wrap { overflow-x: visible; }
        .inquiry_table_inner { min-width: 0; }
        .inquiry_table_head { display: none; }
        .inquiry_table_row {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 16px 0;
            border-bottom: 1px solid #e5e5ec;
        }
        .inquiry_table_row > div {
            min-height: 0;
            padding: 0;
            justify-content: flex-start;
            font-size: 13px;
            line-height: 20px;
        }
        .inquiry_table_row .td_subject { order: -1; }
        .inquiry_table_row .subject_link {
            font-size: 16px;
            line-height: 24px;
            white-space: normal;
        }
        .inquiry_state { min-width: 72px; height: 30px; font-size: 12px; }

        .inquiry_empty { padding: 60px 16px; font-size: 14px; }
    }

    @media (max-width: 400px) {
        .contact_title_group .title { font-size: 22px; line-height: 30px; }
        .inquiry_table_row .subject_link { font-size: 14px; }
    }
</style>

<main id="sub_contents" class="contact_page contact_inquiry_page">
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
                    <p class="sub_page_desc">
                        <?php
                            if ($current_lang == 'ko') echo $lang['contact_hero_desc'];
                            else if ($current_lang == 'en') echo 'Please leave your inquiry and we will get back to you.';
                            else echo '请留下您的咨询内容，我们会尽快回复。';
                        ?>
                    </p>
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

    <section class="contact_inquiry_section">
        <div class="sub_inner">
            <div class="contact_inquiry_wrap">
                <div class="contact_title_group">
                    <span class="label"><?php echo ($current_lang == 'ko') ? $lang['contact_section_label'] : 'Meaning of a passage'; ?></span>
                    <h3 class="title"><?php echo $lang['sub_inquiry_1to1']; ?></h3>
                </div>

                <div class="contact_filter_row">
                    <form method="get" class="contact_filters">
                        <select name="sort" class="contact_select">
                            <option value="latest" <?php echo ($sort === 'latest') ? 'selected' : ''; ?>><?php echo ($current_lang == 'ko') ? $lang['contact_sort_latest'] : 'Latest'; ?></option>
                            <option value="oldest" <?php echo ($sort === 'oldest') ? 'selected' : ''; ?>><?php echo ($current_lang == 'ko') ? $lang['contact_sort_oldest'] : 'Oldest'; ?></option>
                        </select>
                        <select name="search_type" class="contact_select">
                            <option value="subject" <?php echo ($search_type === 'subject') ? 'selected' : ''; ?>><?php echo ($current_lang == 'ko') ? $lang['contact_search_subject'] : 'Title'; ?></option>
                            <option value="writer" <?php echo ($search_type === 'writer') ? 'selected' : ''; ?>><?php echo ($current_lang == 'ko') ? $lang['contact_search_writer'] : 'Writer'; ?></option>
                        </select>
                        <div class="contact_search_group">
                            <input type="text" name="search_word" class="contact_search_input" value="<?php echo htmlspecialchars($search_word); ?>" placeholder="<?php echo ($current_lang == 'ko') ? $lang['contact_search_placeholder'] : 'Please enter a keyword'; ?>">
                            <button type="submit" class="contact_search_btn" aria-label="search">⌕</button>
                        </div>
                    </form>
                    <a href="/pages/contact_write.php" class="contact_write_btn"><?php echo ($current_lang == 'ko') ? $lang['contact_write'] : 'Write'; ?></a>
                </div>

                <div class="inquiry_table_wrap">
                    <div class="inquiry_table_inner">
                        <div class="inquiry_table_head">
                            <div><?php echo ($current_lang == 'ko') ? $lang['contact_col_no'] : 'NO'; ?></div>
                            <div><?php echo ($current_lang == 'ko') ? $lang['contact_col_title'] : 'Title'; ?></div>
                            <div><?php echo ($current_lang == 'ko') ? $lang['contact_col_writer'] : 'Writer'; ?></div>
                            <div><?php echo ($current_lang == 'ko') ? $lang['contact_col_date'] : 'Date'; ?></div>
                            <div><?php echo ($current_lang == 'ko') ? $lang['contact_col_state'] : 'Status'; ?></div>
                        </div>

                        <?php if ($result && mysqli_num_rows($result) > 0): ?>
                            <?php $display_no = $total_records - $start_record; ?>
                            <?php while($row = mysqli_fetch_assoc($result)): ?>
                                <div class="inquiry_table_row">
                                    <div>No.<?php echo $display_no; ?></div>
                                    <div class="td_subject">
                                        <a href="/pages/contact_view.php?idx=<?php echo $row['idx']; ?>" class="subject_link"><?php echo htmlspecialchars($row['subject']); ?></a>
                                    </div>
                                    <div><?php echo htmlspecialchars(mask_name($row['writer_name'])); ?></div>
                                    <div><?php echo date('Y.m.d', strtotime($row['reg_date'])); ?></div>
                                    <div>
                                        <span class="inquiry_state <?php echo ($row['status'] === 'done') ? 'done' : 'pending'; ?>">
                                            <?php echo ($row['status'] === 'done') ? (($current_lang == 'ko') ? $lang['contact_state_done'] : 'Answered') : (($current_lang == 'ko') ? $lang['contact_state_pending'] : 'Pending'); ?>
                                        </span>
                                    </div>
                                </div>
                                <?php $display_no--; ?>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <div class="inquiry_empty">
                                <?php echo ($current_lang == 'ko') ? $lang['contact_empty'] : 'No inquiries found.'; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <?php if ($total_records > 0): ?>
                    <?php
                        $query_base = [];
                        if ($sort) $query_base['sort'] = $sort;
                        if ($search_type) $query_base['search_type'] = $search_type;
                        if ($search_word !== '') $query_base['search_word'] = $search_word;
                    ?>
                    <div class="inquiry_pagination">
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
                            <a href="?<?php echo http_build_query($query_base); ?>" class="page_next">›</a>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>