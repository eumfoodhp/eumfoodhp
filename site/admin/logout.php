<?php
// 1. 세션 시작
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// 2. 모든 세션 변수 해제
$_SESSION = array();

// 3. 세션 쿠키 삭제 (권장 보안 조치)
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 4. 세션 파괴
session_destroy();

// 5. 로그인 페이지로 리다이렉트
echo "<script>
    alert('로그아웃 되었습니다.');
    location.href = 'login.php';
</script>";
exit;
?>