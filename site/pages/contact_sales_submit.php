<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
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

$company_name = mysqli_real_escape_string($conn, trim($_POST['company_name'] ?? ''));
$position_name = mysqli_real_escape_string($conn, trim($_POST['position_name'] ?? ''));
$writer_name = mysqli_real_escape_string($conn, trim($_POST['writer_name'] ?? ''));
$writer_email = mysqli_real_escape_string($conn, trim($_POST['writer_email'] ?? ''));
$writer_phone = mysqli_real_escape_string($conn, trim($_POST['writer_phone'] ?? ''));
$country = mysqli_real_escape_string($conn, trim($_POST['country'] ?? ''));
$inquiry_category_raw = trim($_POST['inquiry_category'] ?? '');
$content = mysqli_real_escape_string($conn, trim($_POST['content'] ?? ''));
$agree_privacy = $_POST['agree_privacy'] ?? '';

$category_slug_to_ko = [
    'product_brand' => '제품/브랜드 관련 문의',
    'partnership' => '제휴/협업 문의',
    'product_sponsorship' => '제품 협찬문의',
    'corporate_general' => '기업 일반 문의',
];
$allowed_ko_categories = array_values($category_slug_to_ko);

if (isset($category_slug_to_ko[$inquiry_category_raw])) {
    $inquiry_category = mysqli_real_escape_string($conn, $category_slug_to_ko[$inquiry_category_raw]);
} elseif (in_array($inquiry_category_raw, $allowed_ko_categories, true)) {
    $inquiry_category = mysqli_real_escape_string($conn, $inquiry_category_raw);
} else {
    $inquiry_category = '';
}

if ($company_name === '' || $position_name === '' || $writer_name === '' || $writer_email === '' || $writer_phone === '' || $country === '' || $inquiry_category === '' || $content === '' || $agree_privacy !== 'Y') {
    $alert_required = $lang['sales_alert_required'] ?? '필수 항목을 입력해 주세요.';
    echo '<script>alert(' . json_encode($alert_required, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE) . '); history.back();</script>';
    exit;
}

$upload_dir = $_SERVER['DOCUMENT_ROOT'] . "/upload/contact_sales/";
if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

$attach_new = '';
$attach_ori = '';
if (isset($_FILES['attach_file']) && !empty($_FILES['attach_file']['name'])) {
    $attach_ori = mysqli_real_escape_string($conn, $_FILES['attach_file']['name']);
    $ext = pathinfo($attach_ori, PATHINFO_EXTENSION);
    $attach_new = time() . "_sales_" . rand(1000, 9999) . "." . $ext;
    move_uploaded_file($_FILES['attach_file']['tmp_name'], $upload_dir . $attach_new);
}

$sql = "INSERT INTO sales_inquiry
        (company_name, position_name, writer_name, writer_email, writer_phone, country, inquiry_category, content, attach_file, attach_ori, status, reg_date)
        VALUES
        ('$company_name', '$position_name', '$writer_name', '$writer_email', '$writer_phone', '$country', '$inquiry_category', '$content', '$attach_new', '$attach_ori', 'pending', NOW())";

if (mysqli_query($conn, $sql)) {
    $alert_ok = $lang['sales_alert_success'] ?? '영업문의가 등록되었습니다.';
    echo '<script>alert(' . json_encode($alert_ok, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE) . "); location.href='/pages/contact_sales.php';</script>";
} else {
    echo "에러 발생: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
