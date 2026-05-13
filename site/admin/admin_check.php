<?php
// 세션이 시작되지 않았다면 시작
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// 관리자 세션이 없거나 true가 아니라면 로그인 페이지로 리다이렉트
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    echo "<script>
        alert('관리자 로그인이 필요합니다.');
        location.href = '/admin/login.php';
    </script>";
    exit;
}
?>