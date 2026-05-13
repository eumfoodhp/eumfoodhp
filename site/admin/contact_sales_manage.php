<?php
include_once 'admin_header.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

$create_table_sql = "CREATE TABLE IF NOT EXISTS sales_inquiry (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    position_name VARCHAR(150) NOT NULL,
    writer_name VARCHAR(100) NOT NULL,
    writer_email VARCHAR(150) NOT NULL,
    writer_phone VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    inquiry_category VARCHAR(120) NOT NULL,
    content TEXT NOT NULL,
    attach_file VARCHAR(255) DEFAULT NULL,
    attach_ori VARCHAR(255) DEFAULT NULL,
    answer_content TEXT DEFAULT NULL,
    answer_admin VARCHAR(100) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    answer_date DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
mysqli_query($conn, $create_table_sql);

$list_size = 10;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;

$search_type = isset($_GET['search_type']) ? $_GET['search_type'] : 'company_name';
$search_word = isset($_GET['search_word']) ? trim($_GET['search_word']) : '';
$status_filter = isset($_GET['status']) ? $_GET['status'] : '';

if (!in_array($search_type, ['company_name', 'writer_name', 'inquiry_category'])) $search_type = 'company_name';
if (!in_array($status_filter, ['', 'pending', 'done'])) $status_filter = '';

$where_parts = [];
if ($search_word !== '') {
    $search_word_esc = mysqli_real_escape_string($conn, $search_word);
    $where_parts[] = "{$search_type} LIKE '%{$search_word_esc}%'";
}
if ($status_filter !== '') {
    $status_esc = mysqli_real_escape_string($conn, $status_filter);
    $where_parts[] = "status = '{$status_esc}'";
}
$where_clause = $where_parts ? (" WHERE " . implode(' AND ', $where_parts)) : '';

$count_query = "SELECT COUNT(*) FROM sales_inquiry" . $where_clause;
$count_res = mysqli_query($conn, $count_query);
$total_records = $count_res ? (int)mysqli_fetch_row($count_res)[0] : 0;

$total_page = ($total_records > 0) ? (int)ceil($total_records / $list_size) : 1;
if ($page > $total_page) $page = $total_page;
$start_record = ($page - 1) * $list_size;

$block_size = 5;
$current_block = (int)ceil($page / $block_size);
$start_page = ($current_block - 1) * $block_size + 1;
$end_page = $start_page + $block_size - 1;
if ($end_page > $total_page) $end_page = $total_page;

$query = "SELECT * FROM sales_inquiry {$where_clause} ORDER BY reg_date DESC, idx DESC LIMIT {$start_record}, {$list_size}";
$result = mysqli_query($conn, $query);
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>관리자 - 영업문의 관리</title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .admin_content { padding: 50px 40px; max-width: 1600px; margin: 0 auto; }
        .admin_title_area { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .admin_title_area h2 { font-size: 28px; color: #222; font-weight: 700; }
        .filter_row { display: flex; gap: 10px; margin-bottom: 18px; }
        .filter_row select, .filter_row input { height: 40px; border: 1px solid #ddd; border-radius: 4px; padding: 0 12px; font-size: 14px; }
        .filter_row input { width: 280px; }
        .filter_row button { height: 40px; padding: 0 16px; border: 0; border-radius: 4px; background: #ff5d27; color: #fff; font-weight: 600; }
        .admin_table { width: 100%; border-collapse: collapse; border-top: 2px solid #222; background: #fff; }
        .admin_table th { padding: 14px 10px; background: #f8f9fa; border-bottom: 1px solid #ddd; font-weight: 600; font-size: 13px; }
        .admin_table td { padding: 14px 10px; border-bottom: 1px solid #eee; text-align: center; color: #444; font-size: 13px; }
        .txt_left { text-align: left !important; }
        .state_badge { display: inline-flex; min-width: 78px; height: 32px; border-radius: 9999px; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; }
        .state_badge.done { background: #fbeae7; color: #ff5d27; }
        .state_badge.pending { background: #f4f4f4; color: #767676; }
        .btn_edit { color: #2a7d2e; text-decoration: none; margin-right: 10px; }
        .btn_del { color: #ed1c24; text-decoration: none; }
        .no_data { padding: 80px 0 !important; color: #999; }
        .pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 30px; }
        .pagination a, .pagination span { display: inline-flex; min-width: 34px; height: 34px; align-items: center; justify-content: center; border: 1px solid #ddd; text-decoration: none; color: #666; font-size: 13px; background: #fff; }
        .pagination .active { background: #ff5d27; color: #fff; border-color: #ff5d27; }
        .pagination .disabled { color: #ccc; background: #f9f9f9; }
    </style>
</head>
<body>
<div class="admin_content">
    <div class="admin_title_area"><h2>영업문의 관리</h2></div>

    <form method="get" class="filter_row">
        <select name="status">
            <option value="" <?php echo ($status_filter === '') ? 'selected' : ''; ?>>전체 상태</option>
            <option value="pending" <?php echo ($status_filter === 'pending') ? 'selected' : ''; ?>>답변대기</option>
            <option value="done" <?php echo ($status_filter === 'done') ? 'selected' : ''; ?>>답변완료</option>
        </select>
        <select name="search_type">
            <option value="company_name" <?php echo ($search_type === 'company_name') ? 'selected' : ''; ?>>회사명</option>
            <option value="writer_name" <?php echo ($search_type === 'writer_name') ? 'selected' : ''; ?>>담당자명</option>
            <option value="inquiry_category" <?php echo ($search_type === 'inquiry_category') ? 'selected' : ''; ?>>문의유형</option>
        </select>
        <input type="text" name="search_word" value="<?php echo htmlspecialchars($search_word); ?>" placeholder="검색어 입력">
        <button type="submit">검색</button>
    </form>

    <table class="admin_table">
        <colgroup>
            <col style="width:5%;"><col style="width:12%;"><col style="width:9%;"><col style="width:8%;"><col style="width:13%;">
            <col style="width:10%;"><col style="width:8%;"><col style="width:13%;"><col style="width:8%;"><col style="width:14%;">
        </colgroup>
        <thead>
            <tr>
                <th>No</th><th>회사명</th><th>직무</th><th>담당자명</th><th>이메일</th>
                <th>연락처</th><th>국가</th><th>문의유형</th><th>상태</th><th>관리</th>
            </tr>
        </thead>
        <tbody>
        <?php if ($result && mysqli_num_rows($result) > 0): ?>
            <?php while($row = mysqli_fetch_assoc($result)): ?>
            <tr>
                <td><?php echo $row['idx']; ?></td>
                <td class="txt_left"><?php echo htmlspecialchars($row['company_name']); ?></td>
                <td><?php echo htmlspecialchars($row['position_name']); ?></td>
                <td><?php echo htmlspecialchars($row['writer_name']); ?></td>
                <td><?php echo htmlspecialchars($row['writer_email']); ?></td>
                <td><?php echo htmlspecialchars($row['writer_phone']); ?></td>
                <td><?php echo htmlspecialchars($row['country']); ?></td>
                <td><?php echo htmlspecialchars($row['inquiry_category']); ?></td>
                <td><span class="state_badge <?php echo ($row['status'] === 'done') ? 'done' : 'pending'; ?>"><?php echo ($row['status'] === 'done') ? '답변완료' : '답변대기'; ?></span></td>
                <td>
                    <a href="contact_sales_form.php?idx=<?php echo $row['idx']; ?>" class="btn_edit">문의확인/답변</a>
                    <a href="contact_sales_db.php?mode=delete&idx=<?php echo $row['idx']; ?>" class="btn_del" onclick="return confirm('정말 삭제하시겠습니까?')">삭제</a>
                </td>
            </tr>
            <?php endwhile; ?>
        <?php else: ?>
            <tr><td colspan="10" class="no_data">등록된 영업문의가 없습니다.</td></tr>
        <?php endif; ?>
        </tbody>
    </table>

    <?php if($total_records > 0): ?>
    <div class="pagination">
        <?php if($page > 1): ?>
            <a href="?page=<?php echo $page-1; ?>&status=<?php echo urlencode($status_filter); ?>&search_type=<?php echo urlencode($search_type); ?>&search_word=<?php echo urlencode($search_word); ?>">&lt;</a>
        <?php else: ?><span class="disabled">&lt;</span><?php endif; ?>
        <?php for($i = $start_page; $i <= $end_page; $i++): ?>
            <?php if($i == $page): ?><span class="active"><?php echo $i; ?></span>
            <?php else: ?><a href="?page=<?php echo $i; ?>&status=<?php echo urlencode($status_filter); ?>&search_type=<?php echo urlencode($search_type); ?>&search_word=<?php echo urlencode($search_word); ?>"><?php echo $i; ?></a><?php endif; ?>
        <?php endfor; ?>
        <?php if($page < $total_page): ?>
            <a href="?page=<?php echo $page+1; ?>&status=<?php echo urlencode($status_filter); ?>&search_type=<?php echo urlencode($search_type); ?>&search_word=<?php echo urlencode($search_word); ?>">&gt;</a>
        <?php else: ?><span class="disabled">&gt;</span><?php endif; ?>
    </div>
    <?php endif; ?>
</div>
</body>
</html>
