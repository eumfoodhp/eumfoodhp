<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'ko';
if (!in_array($current_lang, ['ko', 'en', 'zh'])) {
    $current_lang = 'ko';
}

$title_col = 'b_title_' . $current_lang;
$content_col = 'b_content_' . $current_lang;

$query = "SELECT
            idx,
            $title_col AS title,
            $content_col AS content,
            file_name_ko, file_ori_ko,
            file_name_en, file_ori_en,
            file_name_zh, file_ori_zh
          FROM board
          ORDER BY idx DESC
          LIMIT 3";
$result = mysqli_query($conn, $query);
$download_rows = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $download_rows[] = $row;
    }
}

$fallback_cards = [
    [
        'label' => ($current_lang == 'ko') ? ($lang['board_card_1_label'] ?? 'Brochure') : 'Brochure',
        'title' => ($current_lang == 'ko') ? ($lang['board_card_1_title'] ?? '회사소개서') : (($current_lang == 'en') ? 'Company Brochure' : '公司介绍书'),
        'desc'  => ($current_lang == 'ko') ? ($lang['board_card_1_desc'] ?? '') : (($current_lang == 'en') ? 'Download our company brochure and check key information at a glance.' : '下载公司介绍资料，快速查看核心信息。')
    ],
    [
        'label' => ($current_lang == 'ko') ? ($lang['board_card_2_label'] ?? 'Catalog') : 'Catalog',
        'title' => ($current_lang == 'ko') ? ($lang['board_card_2_title'] ?? 'E-카탈로그') : (($current_lang == 'en') ? 'E-Catalog' : '电子目录'),
        'desc'  => ($current_lang == 'ko') ? ($lang['board_card_2_desc'] ?? '') : (($current_lang == 'en') ? 'Access and download our product and service catalog anytime.' : '可随时下载并查看产品与服务目录。')
    ],
    [
        'label' => ($current_lang == 'ko') ? ($lang['board_card_3_label'] ?? 'Logo') : 'Logo',
        'title' => ($current_lang == 'ko') ? ($lang['board_card_3_title'] ?? 'CI로고') : (($current_lang == 'en') ? 'CI Logo' : 'CI 标志'),
        'desc'  => ($current_lang == 'ko') ? ($lang['board_card_3_desc'] ?? '') : (($current_lang == 'en') ? 'Download brand logo assets in each language quickly.' : '快速下载各语言版本品牌标志文件。')
    ]
];
?>

<link rel="stylesheet" href="/css/sub.css">
<style>
    .download_cards_section { padding: 120px 0 140px; }
    .download_cards_wrap { width: 100%; display: flex; flex-direction: column; gap: 28px; }

    .download_card {
        width: 100%;
        background: #f6f7fb;
        border-radius: 20px;
        padding: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 40px;
    }

    .download_card_left {
        display: flex;
        align-items: center;
        gap: 80px;
        min-width: 0;
        flex: 1;
    }

    .download_card_head {
        width: 420px;
        min-width: 280px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .download_label {
        color: #ff5d27;
        font-size: 18px;
        line-height: 28px;
        letter-spacing: -0.45px;
        font-weight: 500;
    }

    .download_title {
        color: #222;
        font-size: 42px;
        line-height: 52px;
        letter-spacing: -0.9px;
        font-weight: 700;
        margin: 0;
    }

    .download_desc {
        color: #767676;
        font-size: 16px;
        line-height: 26px;
        letter-spacing: -0.4px;
        font-weight: 300;
        margin: 0;
        word-break: keep-all;
        text-align: left;
        flex: 1;
    }

    .download_card_right {
        width: 290px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-shrink: 0;
    }

    .download_lang_group {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
    }

    .download_lang_btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 58px;
        height: 32px;
        border: 1px solid #e5e5ec;
        border-radius: 4px;
        color: #767676;
        font-size: 12px;
        font-weight: 600;
        line-height: 1;
        background: #fff;
        text-decoration: none;
    }

    .download_lang_btn .icon {
        font-size: 12px;
        line-height: 1;
    }

    .download_lang_btn:hover {
        border-color: #ff5d27;
        color: #ff5d27;
    }

    .download_lang_btn.disabled {
        opacity: 0.45;
        pointer-events: none;
    }

    @media (max-width: 1280px) {
        .download_card { padding: 40px; }
        .download_card_left { gap: 40px; }
        .download_title { font-size: 34px; line-height: 44px; }
    }

    @media (max-width: 1024px) {
        .download_card {
            flex-direction: column;
            align-items: flex-start;
        }
        .download_card_left {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
        }
        .download_card_head { width: 100%; min-width: 0; }
        .download_card_right { width: 100%; align-items: flex-start; }
        .download_lang_group { justify-content: flex-start; }
    }

    @media (max-width: 735px) {
        .download_cards_section { padding: 40px 0 56px; }
        .download_cards_wrap { gap: 16px; }
        .download_card { padding: 24px; border-radius: 14px; gap: 16px; }
        .download_card_left { gap: 10px; }
        .download_label { font-size: 14px; line-height: 22px; }
        .download_title { font-size: 26px; line-height: 34px; letter-spacing: -0.6px; }
        .download_desc { font-size: 14px; line-height: 22px; }
        .download_lang_btn { width: 52px; height: 30px; font-size: 11px; }
    }

    @media (max-width: 400px) {
        .download_card { padding: 18px; border-radius: 10px; }
        .download_title { font-size: 22px; line-height: 30px; }
        .download_desc { font-size: 13px; }
    }
</style>

<main id="sub_contents" class="newsroom_page board_list_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_news']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_board']; ?></span>
                </nav>
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_board']; ?></h2>
                    <p class="sub_page_desc">
                        <?php
                            if($current_lang == 'ko') echo '㈜이음푸드시스템의 브로슈어와 카탈로그를 다운로드할 수 있습니다.';
                            else if($current_lang == 'en') echo 'Download brochures and catalogs from Eum Food System Co., Ltd.';
                            else echo '可下载易音食品系统有限公司的介绍资料与目录。';
                        ?>
                    </p>
                </div>
            </div>

            <div class="sub_visual_img" style="background-image: url('/images/sub/notice-hero.png');">
                <div class="sub_tab_container">
                    <div class="sub_tab_inner">
                        <a href="/pages/notice_list.php" class="sub_tab_item"><?php echo $lang['sub_notice']; ?></a>
                        <a href="/pages/news_press.php" class="sub_tab_item"><?php echo $lang['sub_news_press']; ?></a>
                        <a href="/pages/board_list.php" class="sub_tab_item active"><?php echo $lang['sub_board']; ?></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="download_cards_section">
        <div class="sub_inner">
            <div class="download_cards_wrap">
                <?php for ($i = 0; $i < 3; $i++): ?>
                    <?php $row = $download_rows[$i] ?? []; ?>
                    <?php $meta = $fallback_cards[$i]; ?>
                    <?php
                        $title = $meta['title'];
                        $desc = $meta['desc'];

                        $file_ko = $row['file_name_ko'] ?? '';
                        $ori_ko = $row['file_ori_ko'] ?? '';
                        $file_en = $row['file_name_en'] ?? '';
                        $ori_en = $row['file_ori_en'] ?? '';
                        $file_zh = $row['file_name_zh'] ?? '';
                        $ori_zh = $row['file_ori_zh'] ?? '';
                    ?>
                    <article class="download_card">
                        <div class="download_card_left">
                            <div class="download_card_head">
                                <span class="download_label"><?php echo htmlspecialchars($meta['label']); ?></span>
                                <h3 class="download_title"><?php echo htmlspecialchars($title); ?></h3>
                            </div>
                            <p class="download_desc"><?php echo htmlspecialchars($desc); ?></p>
                        </div>
                        <div class="download_card_right">
                            <div class="download_lang_group">
                                <?php if ($i === 0): ?>
                                    <?php if (!empty($file_ko)): ?>
                                        <a href="/inc/download.php?file=<?php echo urlencode($file_ko); ?>&ori=<?php echo urlencode($ori_ko); ?>" class="download_lang_btn">국문 <span class="icon">&darr;</span></a>
                                    <?php else: ?>
                                        <span class="download_lang_btn disabled">국문 <span class="icon">&darr;</span></span>
                                    <?php endif; ?>

                                    <?php if (!empty($file_zh)): ?>
                                        <a href="/inc/download.php?file=<?php echo urlencode($file_zh); ?>&ori=<?php echo urlencode($ori_zh); ?>" class="download_lang_btn">중문 <span class="icon">&darr;</span></a>
                                    <?php else: ?>
                                        <span class="download_lang_btn disabled">중문 <span class="icon">&darr;</span></span>
                                    <?php endif; ?>
                                <?php elseif ($i === 1): ?>
                                    <?php if (!empty($file_ko)): ?>
                                        <a href="/inc/download.php?file=<?php echo urlencode($file_ko); ?>&ori=<?php echo urlencode($ori_ko); ?>" class="download_lang_btn">국문 <span class="icon">&darr;</span></a>
                                    <?php else: ?>
                                        <span class="download_lang_btn disabled">국문 <span class="icon">&darr;</span></span>
                                    <?php endif; ?>
                                <?php else: ?>
                                    <?php if (!empty($file_ko)): ?>
                                        <a href="/inc/download.php?file=<?php echo urlencode($file_ko); ?>&ori=<?php echo urlencode($ori_ko); ?>" class="download_lang_btn">AI <span class="icon">&darr;</span></a>
                                    <?php else: ?>
                                        <span class="download_lang_btn disabled">AI <span class="icon">&darr;</span></span>
                                    <?php endif; ?>

                                    <?php
                                        $png_file = '';
                                        $png_ori = '';
                                        if (!empty($file_en)) {
                                            $png_file = $file_en;
                                            $png_ori = $ori_en;
                                        } elseif (!empty($file_zh)) {
                                            $png_file = $file_zh;
                                            $png_ori = $ori_zh;
                                        }
                                    ?>
                                    <?php if (!empty($png_file)): ?>
                                        <a href="/inc/download.php?file=<?php echo urlencode($png_file); ?>&ori=<?php echo urlencode($png_ori); ?>" class="download_lang_btn">PNG <span class="icon">&darr;</span></a>
                                    <?php else: ?>
                                        <span class="download_lang_btn disabled">PNG <span class="icon">&darr;</span></span>
                                    <?php endif; ?>
                                <?php endif; ?>
                            </div>
                        </div>
                    </article>
                <?php endfor; ?>
            </div>
        </div>
    </section>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>