<?php
// 1. 공통 설정 및 DB 연결 (C:\xampp\htdocs 기준으로 inc/db_conn.php 불러옴)
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
$db_path = $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';
if (file_exists($db_path)) {
    include_once $db_path;
} else {
    error_log('[ADMIN_LOGIN] DB connect file missing: ' . $db_path);
    die("에러: DB 연결 파일을 찾을 수 없습니다.");
}

// 세션 시작
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// 1) 관리자 테이블이 없으면 자동 생성
$create_admin_table_sql = "CREATE TABLE IF NOT EXISTS admin_members (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(100) NOT NULL,
    admin_pass VARCHAR(255) NOT NULL,
    admin_name VARCHAR(100) NOT NULL DEFAULT '관리자',
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_admin_id (admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
if (!mysqli_query($conn, $create_admin_table_sql)) {
    error_log('[ADMIN_LOGIN] create table failed: ' . mysqli_error($conn));
}

// 2) 기본 관리자(admin) 계정 보정 (비밀번호: FTP와 동일)
$default_admin_pass = 'rkskekfk1@';
$default_hash = mysqli_real_escape_string($conn, password_hash($default_admin_pass, PASSWORD_DEFAULT));
$seed_upsert_sql = "INSERT INTO admin_members (admin_id, admin_pass, admin_name)
                    VALUES ('admin', '$default_hash', '관리자')
                    ON DUPLICATE KEY UPDATE
                        admin_pass = VALUES(admin_pass),
                        admin_name = VALUES(admin_name)";
if (!mysqli_query($conn, $seed_upsert_sql)) {
    error_log('[ADMIN_LOGIN] seed/upsert admin failed: ' . mysqli_error($conn));
} else {
    error_log('[ADMIN_LOGIN] ensured admin account and synced password (id=admin)');
}

// 2. POST 데이터 받기 및 보안 처리
$admin_id = mysqli_real_escape_string($conn, $_POST['admin_id'] ?? '');
$admin_pass = $_POST['admin_pass'] ?? '';
error_log('[ADMIN_LOGIN] attempt id=' . $admin_id . ' ip=' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));

if (empty($admin_id) || empty($admin_pass)) {
    $_SESSION['login_error'] = "아이디와 비밀번호를 모두 입력해주세요.";
    header('Location: login.php');
    exit;
}

// 3. DB에서 관리자 정보 조회
$query = "SELECT * FROM admin_members WHERE admin_id = '$admin_id' LIMIT 1";
$result = mysqli_query($conn, $query);
if ($result === false) {
    error_log('[ADMIN_LOGIN] query failed: ' . mysqli_error($conn));
}

if ($result && mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    
    // 4. 비밀번호 검증
    // - 권장: password_hash로 저장된 해시 검증
    // - 레거시: 평문 비밀번호가 저장된 경우도 호환
    $stored_pass = $row['admin_pass'] ?? '';
    $is_valid_pass = false;

    if ($stored_pass !== '' && password_verify($admin_pass, $stored_pass)) {
        $is_valid_pass = true;
    } elseif ($stored_pass !== '' && hash_equals($stored_pass, $admin_pass)) {
        // 레거시 평문 계정 호환
        $is_valid_pass = true;
    }

    if ($is_valid_pass) {
        error_log('[ADMIN_LOGIN] success id=' . $admin_id);
        // --- 로그인 성공 ---
        // 기존 세션 ID를 새로 생성 (세션 하이재킹 방지)
        session_regenerate_id(true);
        
        // 세션에 관리자 정보 저장
        $_SESSION['is_admin'] = true;
        $_SESSION['admin_idx'] = $row['idx'];
        $_SESSION['admin_id'] = $row['admin_id'];
        $_SESSION['admin_name'] = $row['admin_name'];
        
        // 로그인 성공 후 연혁 관리 페이지로 이동
        header('Location: dashboard.php');
        exit;
    } else {
        error_log('[ADMIN_LOGIN] password mismatch id=' . $admin_id . ' stored_prefix=' . substr((string)$stored_pass, 0, 10));
        // --- 비밀번호 불일치 ---
        $_SESSION['login_error'] = "아이디 또는 비밀번호가 올바르지 않습니다.";
        header('Location: login.php');
        exit;
    }
} else {
    error_log('[ADMIN_LOGIN] id not found id=' . $admin_id);
    // --- 아이디가 존재하지 않음 ---
    $_SESSION['login_error'] = "아이디 또는 비밀번호가 올바르지 않습니다."; // 보안상 메시지 동일하게 처리
    header('Location: login.php');
    exit;
}
?>