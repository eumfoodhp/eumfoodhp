<?php
include_once 'admin_check.php';
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
if (!mysqli_query($conn, $create_table_sql)) {
    echo "에러 발생: " . mysqli_error($conn);
    exit;
}

$mode = $_REQUEST['mode'] ?? '';
$idx = (int)($_REQUEST['idx'] ?? 0);

if ($mode === 'delete') {
    if ($idx < 1) {
        echo "<script>alert('잘못된 접근입니다.'); location.href='contact_sales_manage.php';</script>";
        exit;
    }
    $res = mysqli_query($conn, "SELECT attach_file FROM sales_inquiry WHERE idx = '{$idx}'");
    $row = $res ? mysqli_fetch_assoc($res) : null;
    if ($row && !empty($row['attach_file'])) {
        @unlink($_SERVER['DOCUMENT_ROOT'] . "/upload/contact_sales/" . $row['attach_file']);
    }
    $sql = "DELETE FROM sales_inquiry WHERE idx = '{$idx}'";
    $msg = '영업문의가 삭제되었습니다.';
} else if ($mode === 'update') {
    if ($idx < 1) {
        echo "<script>alert('잘못된 접근입니다.'); location.href='contact_sales_manage.php';</script>";
        exit;
    }
    $company_name = mysqli_real_escape_string($conn, trim($_POST['company_name'] ?? ''));
    $position_name = mysqli_real_escape_string($conn, trim($_POST['position_name'] ?? ''));
    $writer_name = mysqli_real_escape_string($conn, trim($_POST['writer_name'] ?? ''));
    $writer_email = mysqli_real_escape_string($conn, trim($_POST['writer_email'] ?? ''));
    $writer_phone = mysqli_real_escape_string($conn, trim($_POST['writer_phone'] ?? ''));
    $country = mysqli_real_escape_string($conn, trim($_POST['country'] ?? ''));
    $inquiry_category = mysqli_real_escape_string($conn, trim($_POST['inquiry_category'] ?? ''));
    $content = mysqli_real_escape_string($conn, trim($_POST['content'] ?? ''));
    $answer_admin = mysqli_real_escape_string($conn, trim($_POST['answer_admin'] ?? ''));
    $answer_content = mysqli_real_escape_string($conn, trim($_POST['answer_content'] ?? ''));

    if ($company_name === '' || $position_name === '' || $writer_name === '' || $writer_email === '' || $writer_phone === '' || $country === '' || $inquiry_category === '' || $content === '') {
        echo "<script>alert('필수 항목을 입력해 주세요.'); history.back();</script>";
        exit;
    }

    $status = ($answer_content !== '') ? 'done' : 'pending';
    $answer_date_sql = ($answer_content !== '') ? "NOW()" : "NULL";

    $sql = "UPDATE sales_inquiry SET
                company_name = '{$company_name}',
                position_name = '{$position_name}',
                writer_name = '{$writer_name}',
                writer_email = '{$writer_email}',
                writer_phone = '{$writer_phone}',
                country = '{$country}',
                inquiry_category = '{$inquiry_category}',
                content = '{$content}',
                answer_admin = '{$answer_admin}',
                answer_content = '{$answer_content}',
                status = '{$status}',
                answer_date = {$answer_date_sql},
                updated_at = NOW()
            WHERE idx = '{$idx}'";
    $msg = '영업문의가 수정되었습니다.';
} else {
    echo "<script>alert('잘못된 접근입니다.'); location.href='contact_sales_manage.php';</script>";
    exit;
}

if (mysqli_query($conn, $sql)) {
    echo "<script>alert('{$msg}'); location.href='contact_sales_manage.php';</script>";
} else {
    echo "에러 발생: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
