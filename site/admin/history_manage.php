<?php
// 1. 관리자 공통 헤더 로드
include_once 'admin_header.php';

// 2. DB 연결
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

// ------------------------------------------------------------
// [구간 판별 함수] - 사용자 페이지의 기준과 동일하게 설정
// ------------------------------------------------------------
function getHistoryPeriod($year) {
    $year = (int)$year;
    if ($year >= 2022) return "NOW ~ 2022";
    if ($year >= 2017) return "2021 ~ 2017";
    if ($year >= 2012) return "2016 ~ 2012";
    if ($year >= 2009) return "2011 ~ 2009";
    return "이전 기록";
}

// ------------------------------------------------------------
// [페이징 로직 시작]
// ------------------------------------------------------------
$list_size = 10; 
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;

$count_query = "SELECT COUNT(*) FROM history";
$count_res = mysqli_query($conn, $count_query);
$total_records = mysqli_fetch_row($count_res)[0];

$total_page = ceil($total_records / $list_size);
$start_record = ($page - 1) * $list_size;

$block_size = 5;
$current_block = ceil($page / $block_size);
$start_page = ($current_block - 1) * $block_size + 1;
$end_page = $start_page + $block_size - 1;
if ($end_page > $total_page) $end_page = $total_page;
// ------------------------------------------------------------

// 3. 연혁 데이터 조회
$query = "SELECT * FROM history ORDER BY h_year DESC, idx DESC LIMIT $start_record, $list_size";
$result = mysqli_query($conn, $query);
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>관리자 - 회사연혁 관리</title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .admin_content { padding: 50px 40px; max-width: 1400px; margin: 0 auto; }
        .admin_title_area { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .admin_title_area h2 { font-size: 28px; color: #222; margin: 0; font-weight: 700; }
        
        .btn_add { padding: 12px 25px; background: #FF5D27; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px; transition: 0.3s; }
        .btn_add:hover { background: #e65220; box-shadow: 0 4px 10px rgba(230, 82, 32, 0.2); }

        .admin_table { width: 100%; border-collapse: collapse; border-top: 2px solid #222; background: #fff; }
        .admin_table th { padding: 18px 15px; background: #f8f9fa; border-bottom: 1px solid #ddd; font-weight: 600; }
        .admin_table td { padding: 20px 15px; border-bottom: 1px solid #eee; text-align: center; color: #444; font-size: 15px; }
        
        .txt_left { text-align: left !important; line-height: 1.6; }
        
        /* 구간 표시 스타일 */
        .period_tag { display: block; font-size: 11px; color: #FF5D27; margin-top: 5px; font-weight: 600; }

        .lang_status { margin-top: 10px; display: flex; gap: 8px; font-size: 11px; }
        .lang_badge { padding: 2px 6px; border-radius: 4px; background: #f0f0f0; color: #aaa; border: 1px solid #e0e0e0; }
        .lang_badge.on { background: #fff4f0; color: #FF5D27; font-weight: 600; border: 1px solid #ffdec2; }

        .btn_edit { color: #007bff; text-decoration: none; margin-right: 15px; font-weight: 500; }
        .btn_del { color: #ed1c24; text-decoration: none; font-weight: 500; }
        .btn_edit:hover, .btn_del:hover { text-decoration: underline; }

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
        <h2>회사연혁 관리</h2>
        <a href="history_form.php" class="btn_add">+ 새 다국어 연혁 추가</a>
    </div>

    <table class="admin_table">
        <colgroup>
            <col style="width: 15%;">
            <col style="width: 70%;">
            <col style="width: 15%;">
        </colgroup>
        <thead>
            <tr>
                <th>연도 / 구간</th>
                <th>연혁 내용 (다국어 등록 현황)</th>
                <th>관리</th>
            </tr>
        </thead>
        <tbody>
            <?php if(mysqli_num_rows($result) > 0): ?>
                <?php while($row = mysqli_fetch_assoc($result)): ?>
                <tr>
                    <td>
                        <strong><?php echo $row['h_year']; ?>년</strong>
                        <!-- 연도별 구간 자동 표시 -->
                        <span class="period_tag"><?php echo getHistoryPeriod($row['h_year']); ?></span>
                    </td>
                    <td class="txt_left">
                        <div class="content_ko" style="font-weight: 500; color: #222;">
                            <?php echo nl2br(htmlspecialchars($row['h_content'])); ?>
                        </div>
                        
                        <div class="lang_status">
                            <span class="lang_badge on">한국어 완료</span>
                            <span class="lang_badge <?php echo !empty($row['h_content_en']) ? 'on' : ''; ?>">영어 <?php echo !empty($row['h_content_en']) ? '완료' : '미등록'; ?></span>
                            <span class="lang_badge <?php echo !empty($row['h_content_zh']) ? 'on' : ''; ?>">중국어 <?php echo !empty($row['h_content_zh']) ? '완료' : '미등록'; ?></span>
                        </div>
                    </td>
                    <td>
                        <a href="history_form.php?idx=<?php echo $row['idx']; ?>" class="btn_edit">수정</a>
                        <a href="history_db.php?mode=delete&idx=<?php echo $row['idx']; ?>" class="btn_del" onclick="return confirm('정말 삭제하시겠습니까?')">삭제</a>
                    </td>
                </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr>
                    <td colspan="3" style="padding: 100px 0; color: #999;">등록된 연혁이 없습니다.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

    <!-- 페이징 -->
    <?php if($total_records > 0): ?>
    <div class="pagination">
        <a href="?page=<?php echo ($page > 1) ? $page-1 : 1; ?>" class="<?php echo ($page <= 1) ? 'disabled' : ''; ?>">&lt;</a>

        <?php for($i=$start_page; $i<=$end_page; $i++): ?>
            <a href="?page=<?php echo $i; ?>" class="<?php echo ($i == $page) ? 'active' : ''; ?>"><?php echo $i; ?></a>
        <?php endfor; ?>

        <a href="?page=<?php echo ($page < $total_page) ? $page+1 : $total_page; ?>" class="<?php echo ($page >= $total_page) ? 'disabled' : ''; ?>">&gt;</a>
    </div>
    <?php endif; ?>
</div>

</body>
</html>