<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

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

$subject = mysqli_real_escape_string($conn, trim($_POST['subject'] ?? ''));
$content = mysqli_real_escape_string($conn, trim($_POST['content'] ?? ''));
$writer_name = mysqli_real_escape_string($conn, trim($_POST['writer_name'] ?? ''));
$writer_phone = mysqli_real_escape_string($conn, trim($_POST['writer_phone'] ?? ''));
$writer_email = mysqli_real_escape_string($conn, trim($_POST['writer_email'] ?? ''));

if ($subject === '' || $content === '' || $writer_name === '') {
    echo "<script>alert('필수 항목을 입력해 주세요.'); history.back();</script>";
    exit;
}

$sql = "INSERT INTO inquiry
        (subject, content, writer_name, writer_phone, writer_email, status, reg_date)
        VALUES
        ('$subject', '$content', '$writer_name', '$writer_phone', '$writer_email', 'pending', NOW())";

if (mysqli_query($conn, $sql)) {
    echo "<script>alert('문의가 등록되었습니다.'); location.href='/pages/contact.php';</script>";
} else {
    echo "에러 발생: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
