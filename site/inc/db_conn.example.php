<?php
// 실제 사용 시 이 파일을 db_conn.php로 복사한 후 값을 채우세요.
// db_conn.php 는 .gitignore에 등록되어 있으므로 커밋되지 않습니다.

$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: '';
$pass = getenv('DB_PASS') ?: '';
$db   = getenv('DB_NAME') ?: '';

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("DB 연결 실패: " . mysqli_connect_error());
}

mysqli_set_charset($conn, "utf8mb4");
