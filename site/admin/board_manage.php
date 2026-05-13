<?php
// 1. 보안 체크 및 DB 연결
include_once 'admin_header.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

$create_board_table_sql = "CREATE TABLE IF NOT EXISTS board (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    b_title_ko VARCHAR(255) NOT NULL,
    b_title_en VARCHAR(255) DEFAULT NULL,
    b_title_zh VARCHAR(255) DEFAULT NULL,
    b_content_ko TEXT,
    b_content_en TEXT,
    b_content_zh TEXT,
    asset_kind VARCHAR(20) DEFAULT NULL,
    file_name_ko VARCHAR(255) DEFAULT NULL,
    file_ori_ko VARCHAR(255) DEFAULT NULL,
    file_name_en VARCHAR(255) DEFAULT NULL,
    file_ori_en VARCHAR(255) DEFAULT NULL,
    file_name_zh VARCHAR(255) DEFAULT NULL,
    file_ori_zh VARCHAR(255) DEFAULT NULL,
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
if (!mysqli_query($conn, $create_board_table_sql)) {
    die('에러 발생: ' . mysqli_error($conn));
}

// ------------------------------------------------------------
// [페이징 로직 시작]
// ------------------------------------------------------------
$list_size = 10; // 한 페이지에 보여줄 게시글 수
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;

// 전체 게시글 수 조회
$count_query = "SELECT COUNT(*) FROM board";
$count_res = mysqli_query($conn, $count_query);
$total_records = mysqli_fetch_row($count_res)[0];

// 총 페이지 수 및 시작 레코드 계산
$total_page = ceil($total_records / $list_size);
$start_record = ($page - 1) * $list_size;

// 블록 페이징 (1~5페이지씩 묶음)
$block_size = 5;
$current_block = ceil($page / $block_size);
$start_page = ($current_block - 1) * $block_size + 1;
$end_page = $start_page + $block_size - 1;
if ($end_page > $total_page) $end_page = $total_page;
// ------------------------------------------------------------

// 2. 자료실 데이터 조회 (LIMIT 적용)
$query = "SELECT * FROM board ORDER BY idx DESC LIMIT $start_record, $list_size";
$result = mysqli_query($conn, $query);
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>관리자 - 자료실 관리</title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .admin_content { padding: 50px 40px; max-width: 1400px; margin: 0 auto; }
        .admin_title_area { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .admin_title_area h2 { font-size: 28px; color: #222; font-weight: 700; }
        
        .btn_add { padding: 12px 25px; background: #FF5D27; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; transition: 0.3s; }
        .btn_add:hover { background: #e65220; }

        .admin_table { width: 100%; border-collapse: collapse; border-top: 2px solid #222; background: #fff; }
        .admin_table th { padding: 18px 15px; background: #f8f9fa; border-bottom: 1px solid #ddd; font-weight: 600; }
        .admin_table td { padding: 20px 15px; border-bottom: 1px solid #eee; text-align: center; color: #444; }
        
        .txt_left { text-align: left !important; }
        
        /* 파일 배지 (언어별 체크를 위해 개별 표시) */
        .file_status { display: flex; gap: 5px; justify-content: center; }
        .file_badge { padding: 2px 6px; background: #f0f0f0; border-radius: 4px; font-size: 11px; color: #999; border: 1px solid #eee; }
        .file_badge.on { background: #e7f3ff; color: #007bff; border: 1px solid #b3d7ff; font-weight: 600; }

        .lang_status { margin-top: 8px; display: flex; gap: 5px; font-size: 11px; }
        .lang_dot { padding: 2px 5px; background: #eee; border-radius: 3px; color: #999; }
        .lang_dot.on { background: #333; color: #fff; }

        .btn_edit { color: #007bff; text-decoration: none; margin-right: 15px; }
        .btn_del { color: #ed1c24; text-decoration: none; }
        .no_data { padding: 100px 0 !important; color: #999; }

        /* 페이징 스타일 */
        .pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 40px; }
        .pagination a, .pagination span { 
            display: flex; align-items: center; justify-content: center;
            min-width: 35px; height: 35px; border: 1px solid #ddd; 
            color: #666; text-decoration: none; font-size: 14px; transition: 0.3s; background: #fff;
        }
        .pagination a:hover { border-color: #FF5D27; color: #FF5D27; }
        .pagination .active { background: #FF5D27; color: #fff; border-color: #FF5D27; font-weight: 700; }
        .pagination .disabled { color: #ccc; cursor: default; background: #f9f9f9; }
    </style>
</head>
<body>

<div class="admin_content">
    <div class="admin_title_area">
        <h2>자료실 관리</h2>
        <a href="board_form.php" class="btn_add">+ 새 자료 등록</a>
    </div>

    <table class="admin_table">
        <colgroup>
            <col style="width: 7%;">
            <col style="width: 38%;">
            <col style="width: 12%;">
            <col style="width: 18%;">
            <col style="width: 12%;">
            <col style="width: 13%;">
        </colgroup>
        <thead>
            <tr>
                <th>No</th>
                <th>제목 (다국어 현황)</th>
                <th>자료유형</th>
                <th>첨부파일 (슬롯 A/B/C)</th>
                <th>등록일</th>
                <th>관리</th>
            </tr>
        </thead>
        <tbody>
            <?php if(mysqli_num_rows($result) > 0): ?>
                <?php while($row = mysqli_fetch_assoc($result)): ?>
                <tr>
                    <td><?php echo $row['idx']; ?></td>
                    <td class="txt_left">
                        <strong><?php echo htmlspecialchars($row['b_title_ko']); ?></strong>
                        <div class="lang_status">
                            <span class="lang_dot on">KO</span>
                            <span class="lang_dot <?php echo !empty($row['b_title_en']) ? 'on' : ''; ?>">EN</span>
                            <span class="lang_dot <?php echo !empty($row['b_title_zh']) ? 'on' : ''; ?>">ZH</span>
                        </div>
                    </td>
                    <td>
                        <?php
                            $kind = $row['asset_kind'] ?? '';
                            if ($kind === 'brochure') echo '회사소개서';
                            else if ($kind === 'catalog') echo '카탈로그';
                            else if ($kind === 'ci_logo') echo 'CI로고';
                            else echo '-';
                        ?>
                    </td>
                    <td>
                        <div class="file_status">
                            <span class="file_badge <?php echo !empty($row['file_name_ko']) ? 'on' : ''; ?>">A</span>
                            <span class="file_badge <?php echo !empty($row['file_name_en']) ? 'on' : ''; ?>">B</span>
                            <span class="file_badge <?php echo !empty($row['file_name_zh']) ? 'on' : ''; ?>">C</span>
                        </div>
                    </td>
                    <td><?php echo date('Y-m-d', strtotime($row['reg_date'])); ?></td>
                    <td>
                        <a href="board_form.php?idx=<?php echo $row['idx']; ?>" class="btn_edit">수정</a>
                        <a href="board_db.php?mode=delete&idx=<?php echo $row['idx']; ?>" class="btn_del" onclick="return confirm('정말 삭제하시겠습니까? 파일도 함께 삭제됩니다.')">삭제</a>
                    </td>
                </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr>
                    <td colspan="6" class="no_data">등록된 자료가 없습니다.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

    <?php if($total_records > 0): ?>
    <div class="pagination">
        <?php if($page > 1): ?>
            <a href="?page=<?php echo $page-1; ?>">&lt;</a>
        <?php else: ?>
            <span class="disabled">&lt;</span>
        <?php endif; ?>

        <?php for($i=$start_page; $i<=$end_page; $i++): ?>
            <?php if($i == $page): ?>
                <span class="active"><?php echo $i; ?></span>
            <?php else: ?>
                <a href="?page=<?php echo $i; ?>"><?php echo $i; ?></a>
            <?php endif; ?>
        <?php endfor; ?>

        <?php if($page < $total_page): ?>
            <a href="?page=<?php echo $page+1; ?>">&gt;</a>
        <?php else: ?>
            <span class="disabled">&gt;</span>
        <?php endif; ?>
    </div>
    <?php endif; ?>
    </div>

</body>
</html>