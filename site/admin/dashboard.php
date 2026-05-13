<?php
// 1. 관리자 공통 헤더 로드 (내부에 admin_check.php 보안 체크 포함됨)
include_once 'admin_header.php';

// 2. DB 연결
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

// 문의 테이블이 없으면 생성
$create_inquiry_table_sql = "CREATE TABLE IF NOT EXISTS inquiry (
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
mysqli_query($conn, $create_inquiry_table_sql);

// 영업문의 테이블이 없으면 생성
$create_sales_inquiry_table_sql = "CREATE TABLE IF NOT EXISTS sales_inquiry (
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
mysqli_query($conn, $create_sales_inquiry_table_sql);

// 3. 요약 정보 조회를 위한 카운트 쿼리

// [카운트] 회사연혁
$history_count = 0;
$h_res = mysqli_query($conn, "SELECT COUNT(*) FROM history");
if ($h_res) {
    $history_count = mysqli_fetch_row($h_res)[0];
}

// [카운트] 자료실
$board_count = 0;
$b_res = mysqli_query($conn, "SELECT COUNT(*) FROM board");
if ($b_res) {
    $board_count = mysqli_fetch_row($b_res)[0];
}

// [카운트] 공지사항 (notice 테이블 생성 후 정상 작동)
$notice_count = 0;
$n_res = mysqli_query($conn, "SELECT COUNT(*) FROM notice");
if ($n_res) {
    $notice_count = mysqli_fetch_row($n_res)[0];
}

// [카운트] 보도자료
$press_count = 0;
$p_res = mysqli_query($conn, "SELECT COUNT(*) FROM press");
if ($p_res) {
    $press_count = mysqli_fetch_row($p_res)[0];
}

// [카운트] 1:1 문의
$contact_count = 0;
$c_res = mysqli_query($conn, "SELECT COUNT(*) FROM inquiry");
if ($c_res) {
    $contact_count = mysqli_fetch_row($c_res)[0];
}

// [카운트] 영업문의
$sales_contact_count = 0;
$sc_res = mysqli_query($conn, "SELECT COUNT(*) FROM sales_inquiry");
if ($sc_res) {
    $sales_contact_count = mysqli_fetch_row($sc_res)[0];
}
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>㈜이음푸드시스템 관리자 대시보드</title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        /* 대시보드 전용 레이아웃 */
        .dashboard_container { padding: 60px 40px; max-width: 1200px; margin: 0 auto; }
        
        .welcome_msg { margin-bottom: 50px; text-align: left; }
        .welcome_msg h2 { font-size: 32px; color: #222; margin-bottom: 15px; font-weight: 700; }
        .welcome_msg p { font-size: 16px; color: #666; }
        .welcome_msg strong { color: #FF5D27; }

        /* 메뉴 카드 그리드 (3열로 확장) */
        .menu_grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; }
        
        .menu_card { 
            background: #fff; border: 1px solid #eee; border-radius: 15px; padding: 50px 40px; 
            text-decoration: none; transition: all 0.3s ease; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            display: flex; flex-direction: column; align-items: center; text-align: center;
        }
        
        .menu_card:hover { 
            transform: translateY(-10px); 
            border-color: #FF5D27; 
            box-shadow: 0 10px 30px rgba(255, 93, 39, 0.1); 
        }

        .menu_card .icon { font-size: 48px; margin-bottom: 25px; display: block; }
        .menu_card h3 { font-size: 24px; color: #222; margin-bottom: 15px; font-weight: 600; }
        .menu_card p { color: #767676; font-size: 15px; line-height: 1.6; margin-bottom: 20px; min-height: 48px; }
        
        /* 통계 수치 */
        .menu_card .count_badge { 
            background: #fff5f2; color: #FF5D27; padding: 8px 20px; 
            border-radius: 30px; font-weight: 700; font-size: 14px; 
        }
    </style>
</head>
<body>

<div class="dashboard_container">
    <div class="welcome_msg">
        <h2>안녕하세요, <strong><?php echo $_SESSION['admin_name']; ?></strong>님!</h2>
        <p>㈜이음푸드시스템 관리자 대시보드입니다. 원하시는 관리 항목을 선택해 주세요.</p>
    </div>

    <div class="menu_grid">
        <a href="notice_manage.php" class="menu_card">
            <span class="icon">📢</span>
            <h3>공지사항 관리</h3>
            <p>중요 알림 및 필독 공지사항을<br>다국어로 등록하고 상단에 고정합니다.</p>
            <div class="count_badge">현재 등록 수: <?php echo $notice_count; ?>건</div>
        </a>

        <a href="press_manage.php" class="menu_card">
            <span class="icon">📰</span>
            <h3>보도자료 관리</h3>
            <p>보도자료를 다국어(한/영/중)로 등록하고<br>뉴스룸 보도자료 페이지와 연동합니다.</p>
            <div class="count_badge">현재 등록 수: <?php echo $press_count; ?>건</div>
        </a>

        <a href="board_manage.php" class="menu_card">
            <span class="icon">📂</span>
            <h3>자료실 관리</h3>
            <p>다국어 자료실의 게시글과 첨부파일을<br>효율적으로 업로드하고 관리합니다.</p>
            <div class="count_badge">현재 등록 수: <?php echo $board_count; ?>건</div>
        </a>

        <a href="history_manage.php" class="menu_card">
            <span class="icon">🏢</span>
            <h3>회사연혁 관리</h3>
            <p>홈페이지의 연혁 데이터를 실시간으로<br>추가, 수정 및 삭제할 수 있습니다.</p>
            <div class="count_badge">현재 등록 수: <?php echo $history_count; ?>건</div>
        </a>

        <a href="contact_manage.php" class="menu_card">
            <span class="icon">💬</span>
            <h3>1:1 문의 관리</h3>
            <p>고객 문의를 확인하고 답변 등록,<br>수정 및 삭제를 처리합니다.</p>
            <div class="count_badge">현재 등록 수: <?php echo $contact_count; ?>건</div>
        </a>

        <a href="contact_sales_manage.php" class="menu_card">
            <span class="icon">🤝</span>
            <h3>영업문의 관리</h3>
            <p>영업 제휴 문의를 확인하고 답변 등록,<br>수정 및 삭제를 처리합니다.</p>
            <div class="count_badge">현재 등록 수: <?php echo $sales_contact_count; ?>건</div>
        </a>
    </div>
</div>

</body>
</html>