<?php
// 1. 공통 설정 및 DB 연결
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

// 현재 언어 설정 (기본값 ko)
$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'ko';
if (!in_array($current_lang, ['ko', 'en', 'zh'])) {
    $current_lang = 'ko';
}

// 2. 언어별 컬럼 지정
$title_col = 'n_title_' . $current_lang;
$file_name_col = 'file_name_' . $current_lang;
$file_ori_col = 'file_ori_' . $current_lang;

// 검색 조건
$search_type = isset($_GET['search_type']) ? $_GET['search_type'] : 'title';
$search_word = isset($_GET['search_word']) ? trim($_GET['search_word']) : '';

$search_columns = [
    'title' => $title_col
];

if (!isset($search_columns[$search_type])) {
    $search_type = 'title';
}

$where_clause = '';
if ($search_word !== '') {
    $search_word_esc = mysqli_real_escape_string($conn, $search_word);
    $where_clause = " WHERE " . $search_columns[$search_type] . " LIKE '%" . $search_word_esc . "%'";
}

// ------------------------------------------------------------
// [페이징 로직 시작]
// ------------------------------------------------------------
$list_size = 10; // 한 페이지에 보여줄 게시글 수
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;

// 전체 게시글 수 조회 (카운트)
$count_query = "SELECT COUNT(*) FROM notice" . $where_clause;
$count_res = mysqli_query($conn, $count_query);
$total_records = mysqli_fetch_row($count_res)[0];

// 총 페이지 수 계산
$total_page = ceil($total_records / $list_size);
$start_record = ($page - 1) * $list_size;

// 블록 페이징 설정 (예: 1~5페이지씩 묶음)
$block_size = 5;
$current_block = ceil($page / $block_size);
$start_page = ($current_block - 1) * $block_size + 1;
$end_page = $start_page + $block_size - 1;
if ($end_page > $total_page) $end_page = $total_page;
// ------------------------------------------------------------

// 3. 공지사항 데이터 조회 (중요공지 상단 고정 + 최신순 + 페이징 적용)
$query = "SELECT 
            idx, is_notice,
            $title_col AS title, 
            $file_name_col AS file_nm,
            $file_ori_col AS file_ori,
            view_count, reg_date 
          FROM notice
          $where_clause
          ORDER BY 
            (CASE WHEN is_notice = 'Y' THEN 1 ELSE 2 END) ASC, 
            reg_date DESC, 
            idx DESC 
          LIMIT $start_record, $list_size";

$result = mysqli_query($conn, $query);
?>

<link rel="stylesheet" href="/css/sub.css">
<style>
    .notice_board_section {
        padding: 120px 0 140px;
    }

    .notice_section_title {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 40px;
        width: 100%;
    }

    .notice_section_title .label {
        font-size: 18px;
        line-height: 28px;
        font-weight: 500;
        letter-spacing: -0.45px;
        color: #ff5d27;
    }

    .notice_section_title .title {
        font-size: 42px;
        line-height: 60px;
        font-weight: 700;
        letter-spacing: -1.05px;
        color: #222;
    }

    .notice_board_wrap {
        display: flex;
        flex-direction: column;
        gap: 60px;
        width: 100%;
    }

    .notice_board_top {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 16px;
    }

    .notice_total {
        display: flex;
        align-items: center;
        gap: 4px;
        margin: 0;
        font-size: 20px;
        line-height: 30px;
        letter-spacing: -0.5px;
        color: #767676;
        font-weight: 500;
    }

    .notice_total span {
        color: #ff5d27;
    }

    .notice_search_form {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notice_select,
    .notice_search_input {
        height: 44px;
        border: 1px solid #e5e5ec;
        border-radius: 4px;
        padding: 0 20px;
        font-size: 16px;
        line-height: 26px;
        color: #505050;
        outline: none;
        background: #fff;
    }

    .notice_select {
        width: 160px;
        cursor: pointer;
    }

    .notice_search_group {
        position: relative;
        width: 360px;
    }

    .notice_search_input {
        width: 100%;
        padding-right: 46px;
    }

    .notice_search_btn {
        position: absolute;
        top: 50%;
        right: 14px;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        border: 0;
        background: transparent;
        color: #505050;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
    }

    .notice_list_wrap {
        border-top: 1px solid #222;
    }

    .notice_item {
        min-height: 120px;
        border-bottom: 1px solid #e5e5ec;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 30px;
    }

    .notice_item_main {
        min-width: 0;
        flex: 1;
        display: flex;
        align-items: center;
        gap: 40px;
    }

    .notice_no {
        margin: 0;
        font-size: 16px;
        line-height: 26px;
        letter-spacing: -0.4px;
        color: #767676;
        font-weight: 500;
        white-space: nowrap;
    }

    .notice_subject {
        font-size: 20px;
        line-height: 30px;
        letter-spacing: -0.5px;
        color: #222;
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .notice_subject:hover {
        color: #ff5d27;
    }

    .notice_item_meta {
        display: flex;
        align-items: center;
        gap: 30px;
        flex-shrink: 0;
    }

    .notice_download {
        width: 112px;
        height: 44px;
        border-radius: 4px;
        background: #f6f7fb;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-size: 14px;
        line-height: 22px;
        letter-spacing: -0.35px;
        color: #767676;
        text-decoration: none;
        font-weight: 500;
    }

    .notice_date {
        margin: 0;
        min-width: 96px;
        text-align: right;
        font-size: 16px;
        line-height: 26px;
        letter-spacing: -0.4px;
        color: #767676;
        font-weight: 300;
    }

    .notice_empty {
        border-bottom: 1px solid #e5e5ec;
        color: #999;
        font-size: 16px;
        line-height: 26px;
        text-align: center;
        padding: 140px 20px;
    }

    .notice_pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
    }

    .notice_pagination a,
    .notice_pagination span {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-size: 14px;
        line-height: 22px;
        letter-spacing: -0.35px;
        color: #767676;
        font-weight: 500;
    }

    .notice_pagination .active {
        background: #ff5d27;
        color: #fff;
    }

    .notice_pagination .page_next {
        color: #999;
        font-size: 20px;
    }

    @media (max-width: 1024px) {
        .notice_board_top {
            flex-direction: column;
            align-items: stretch;
        }

        .notice_search_form {
            justify-content: flex-end;
        }
    }

    @media (max-width: 992px) {
        .notice_section_title .title {
            font-size: 34px;
            line-height: 46px;
        }

        .notice_item {
            flex-direction: column;
            align-items: flex-start;
            padding: 24px 0;
        }

        .notice_item_main {
            width: 100%;
            gap: 16px;
        }

        .notice_item_meta {
            width: 100%;
            justify-content: space-between;
            gap: 12px;
        }

        .notice_subject {
            font-size: 18px;
            line-height: 28px;
            white-space: normal;
        }
    }

    @media (max-width: 768px) {
        .notice_board_section {
            padding: 80px 0 100px;
        }

        .notice_search_form {
            flex-direction: column;
            align-items: stretch;
        }

        .notice_select,
        .notice_search_group {
            width: 100%;
        }
    }

    @media (max-width: 735px) {
        .notice_board_section { padding: 40px 0 56px; }
        .notice_board_wrap { gap: 32px; }

        .notice_section_title { margin-bottom: 20px; }
        .notice_section_title .label { font-size: 14px; line-height: 22px; }
        .notice_section_title .title { font-size: 26px; line-height: 36px; letter-spacing: -0.6px; }

        .notice_board_top { gap: 12px; }
        .notice_total { font-size: 16px; line-height: 24px; }

        .notice_select,
        .notice_search_input { height: 40px; font-size: 14px; padding: 0 14px; }
        .notice_search_input { padding-right: 40px; }

        .notice_item { min-height: 0; padding: 16px 0; gap: 8px; }
        .notice_item_main { gap: 10px; }
        .notice_no { font-size: 13px; line-height: 20px; }
        .notice_subject { font-size: 15px; line-height: 22px; white-space: normal; }
        .notice_item_meta { gap: 8px; }
        .notice_download { width: 88px; height: 34px; font-size: 12px; }
        .notice_date { font-size: 13px; line-height: 20px; min-width: 76px; }

        .notice_empty { padding: 80px 16px; font-size: 14px; }
    }

    @media (max-width: 400px) {
        .notice_section_title .title { font-size: 22px; line-height: 30px; }
        .notice_subject { font-size: 14px; line-height: 20px; }
        .notice_no { display: none; }
    }
</style>

<main id="sub_contents" class="newsroom_page notice_list_page">
<section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_news']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_notice']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_notice']; ?></h2>
                    <p class="sub_page_desc">
                        <?php 
                            if($current_lang == 'ko') echo '㈜이음푸드시스템의 새로운 소식과 안내를 전해드립니다.';
                            else if($current_lang == 'en') echo 'We deliver the latest news and guides from Eum Food System Co., Ltd.';
                            else echo '为您传递（株）EUMFOOD SYSTEM 的最新消息和指南。';
                        ?>
                    </p>
                </div>
            </div>
            
            <!-- 공지사항 전용 히어로 이미지 및 탭 메뉴 -->
            <div class="sub_visual_img" style="background-image: url('/images/sub/notice-hero.png');">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <!-- 뉴스룸 카테고리 탭 -->
                        <a href="/pages/notice_list.php" class="sub_tab_item active"><?php echo $lang['sub_notice']; ?></a>
                        <a href="/pages/news_press.php" class="sub_tab_item"><?php echo $lang['sub_news_press']; ?></a>
                        <a href="/pages/board_list.php" class="sub_tab_item"><?php echo $lang['sub_board']; ?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="notice_board_section">
        <div class="sub_inner">
            <div class="notice_section_title">
                <span class="label">NOTICE</span>
                <h3 class="title">
                    <?php
                        if ($current_lang == 'ko') echo '새로운 소식';
                        else if ($current_lang == 'en') echo 'Latest News';
                        else echo '最新消息';
                    ?>
                </h3>
            </div>

            <div class="notice_board_wrap">
                <div class="notice_board_top">
                    <p class="notice_total">Total <span><?php echo number_format($total_records); ?></span></p>
                    <form method="get" class="notice_search_form">
                        <select name="search_type" class="notice_select">
                            <option value="title" <?php echo ($search_type === 'title') ? 'selected' : ''; ?>>
                                <?php echo ($current_lang == 'ko') ? '제목' : (($current_lang == 'en') ? 'Title' : '标题'); ?>
                            </option>
                        </select>
                        <div class="notice_search_group">
                            <input
                                type="text"
                                name="search_word"
                                class="notice_search_input"
                                value="<?php echo htmlspecialchars($search_word); ?>"
                                placeholder="<?php echo ($current_lang == 'ko') ? '검색어를 입력해주세요' : (($current_lang == 'en') ? 'Please enter a keyword' : '请输入关键词'); ?>"
                            >
                            <button type="submit" class="notice_search_btn" aria-label="search">⌕</button>
                        </div>
                    </form>
                </div>

                <div class="notice_list_wrap">
                    <?php if(mysqli_num_rows($result) > 0): ?>
                        <?php $display_no = $total_records - $start_record; ?>
                        <?php while($row = mysqli_fetch_assoc($result)): ?>
                            <article class="notice_item">
                                <div class="notice_item_main">
                                    <p class="notice_no">No.<?php echo ($row['is_notice'] == 'Y') ? $row['idx'] : $display_no; ?></p>
                                    <a href="notice_view.php?idx=<?php echo $row['idx']; ?>" class="notice_subject">
                                        <?php echo htmlspecialchars($row['title'] ?? ''); ?>
                                    </a>
                                </div>
                                <div class="notice_item_meta">
                                    <?php if(!empty($row['file_nm']) && !empty($row['file_ori'])): ?>
                                        <a
                                            href="/inc/download.php?file=<?php echo urlencode($row['file_nm']); ?>&ori=<?php echo urlencode($row['file_ori']); ?>"
                                            class="notice_download"
                                        >
                                            <?php echo ($current_lang == 'ko') ? '다운로드' : (($current_lang == 'en') ? 'Download' : '下载'); ?> ⭳
                                        </a>
                                    <?php endif; ?>
                                    <p class="notice_date"><?php echo date('Y.m.d', strtotime($row['reg_date'])); ?></p>
                                </div>
                            </article>
                            <?php $display_no--; ?>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <p class="notice_empty">
                            <?php echo ($current_lang == 'ko') ? '등록된 공지사항이 없습니다.' : (($current_lang == 'en') ? 'No notices found.' : '暂无公告。'); ?>
                        </p>
                    <?php endif; ?>
                </div>

                <?php if($total_records > 0): ?>
                <?php
                    $query_base = [];
                    if ($search_type !== '') $query_base['search_type'] = $search_type;
                    if ($search_word !== '') $query_base['search_word'] = $search_word;
                ?>
                <div class="notice_pagination">
                    <?php for($i = $start_page; $i <= $end_page; $i++): ?>
                        <?php $query_base['page'] = $i; ?>
                        <?php if($i == $page): ?>
                            <span class="active"><?php echo $i; ?></span>
                        <?php else: ?>
                            <a href="?<?php echo http_build_query($query_base); ?>"><?php echo $i; ?></a>
                        <?php endif; ?>
                    <?php endfor; ?>

                    <?php if($end_page < $total_page): ?>
                        <span>...</span>
                        <?php $query_base['page'] = $total_page; ?>
                        <a href="?<?php echo http_build_query($query_base); ?>"><?php echo $total_page; ?></a>
                    <?php endif; ?>

                    <?php if($page < $total_page): ?>
                        <?php $query_base['page'] = $page + 1; ?>
                        <a href="?<?php echo http_build_query($query_base); ?>" class="page_next" aria-label="next page">›</a>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>