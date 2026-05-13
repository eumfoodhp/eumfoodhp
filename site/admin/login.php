<?php
// 세션 시작 (로그인 상태 체크 또는 에러 메시지 표시용)
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// 이미 로그인된 상태라면 관리자 메인으로 이동
if (isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true) {
    header('Location: history_manage.php');
    exit;
}

// 에러 메시지가 있으면 가져오고 세션에서 삭제
$error_msg = $_SESSION['login_error'] ?? '';
unset($_SESSION['login_error']);
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>㈜이음푸드시스템 - 관리자 로그인</title>
    <link rel="stylesheet" href="/css/admin.css"> <style>
        /* 간단한 로그인 페이지 전용 스타일 */
        body { background-color: #f4f7f6; font-family: 'Pretendard', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .login_container { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
        .logo_area { margin-bottom: 30px; }
        .logo_area img { width: 150px; }
        .login_title { font-size: 24px; font-weight: 700; color: #222; margin-bottom: 30px; }
        .form_group { margin-bottom: 20px; text-align: left; }
        .form_group label { display: block; font-size: 14px; color: #666; margin-bottom: 8px; font-weight: 500; }
        .form_group input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; box-sizing: border-box; transition: border-color 0.3s; }
        .form_group input:focus { border-color: #FF5D27; outline: none; }
        .error_msg { color: #ed1c24; font-size: 14px; margin-bottom: 20px; text-align: left; min-height: 20px; }
        .btn_login { width: 100%; padding: 15px; background-color: #FF5D27; color: #fff; border: none; border-radius: 6px; font-size: 18px; font-weight: 600; cursor: pointer; transition: background-color 0.3s; }
        .btn_login:hover { background-color: #e65220; }
        .back_home { display: inline-block; margin-top: 25px; color: #767676; text-decoration: none; font-size: 14px; transition: color 0.3s; }
        .back_home:hover { color: #222; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="login_container">
        <h1 class="logo_area">
            <a href="/index.php">
                <img src="/images/common/logo.png" alt="㈜이음푸드시스템 로고">
            </a>
        </h1>
        <h2 class="login_title">관리자 로그인</h2>
        
        <form action="login_db.php" method="post">
            <div class="form_group">
                <label for="admin_id">아이디</label>
                <input type="text" id="admin_id" name="admin_id" required placeholder="아이디를 입력하세요">
            </div>
            <div class="form_group">
                <label for="admin_pass">비밀번호</label>
                <input type="password" id="admin_pass" name="admin_pass" required placeholder="비밀번호를 입력하세요">
            </div>
            
            <div class="error_msg"><?php echo htmlspecialchars($error_msg); ?></div>
            
            <button type="submit" class="btn_login">로그인</button>
        </form>
        
        <a href="/index.php" class="back_home">← 사용자 홈페이지로 돌아가기</a>
    </div>
</body>
</html>