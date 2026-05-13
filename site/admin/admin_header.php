<?php
// admin/admin_header.php
include_once 'admin_check.php'; 
?>
<header class="admin_global_header">
    <div class="admin_header_inner">
        <h1 class="admin_logo">
            <a href="dashboard.php">
                <img src="/images/common/logo.png" alt="㈜이음푸드시스템 관리자">
                <span>Admin</span>
            </a>
        </h1>
        
        <nav class="admin_gnb">
            <ul>
                <li><a href="dashboard.php">대시보드</a></li>
                <li><a href="history_manage.php">연혁관리</a></li>
                <li><a href="notice_manage.php">공지사항관리</a></li>
                <li><a href="press_manage.php">보도자료관리</a></li>
                <li><a href="board_manage.php">자료실관리</a></li>
                <li><a href="contact_manage.php">문의관리</a></li>
                <li><a href="contact_sales_manage.php">영업문의관리</a></li>
            </ul>
        </nav>

        <div class="admin_info">
            <strong><?php echo $_SESSION['admin_name']; ?></strong>님
            <a href="logout.php" class="admin_logout_btn">로그아웃</a>
        </div>
    </div>
</header>

<style>
    /* 1. Reset Styles - 헤더 로드 시 전체 페이지 초기화 */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
        font-family: 'Pretendard', sans-serif; 
        font-size: 15px; 
        background-color: #f9f9f9; 
        color: #333; 
        line-height: 1.5; 
    }
    ul, li { list-style: none; }
    a { text-decoration: none; color: inherit; }
    table { width: 100%; border-collapse: collapse; }

    /* 2. 관리자 전용 헤더 스타일 */
    .admin_global_header { 
        width: 100%; 
        background: #222; 
        color: #fff; 
        padding: 0 40px; 
        position: sticky; /* 상단 고정 */
        top: 0;
        z-index: 1000;
    }
    .admin_header_inner { 
        max-width: 1400px; 
        margin: 0 auto; 
        height: 70px; 
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
    }
    
    .admin_logo { display: flex; align-items: center; gap: 10px; }
    .admin_logo a { display: flex; align-items: center; gap: 10px; }
    .admin_logo img { height: 30px; filter: brightness(0) invert(1); } 
    .admin_logo span { 
        background: #FF5D27; 
        padding: 2px 8px; 
        border-radius: 4px; 
        font-size: 12px; 
        font-weight: 700; 
        text-transform: uppercase; 
    }

    .admin_gnb ul { display: flex; gap: 30px; }
    .admin_gnb a { color: #ccc; font-size: 15px; font-weight: 500; transition: 0.3s; }
    .admin_gnb a:hover { color: #fff; }

    .admin_info { display: flex; align-items: center; gap: 20px; font-size: 14px; }
    .admin_logout_btn { 
        background: #444; 
        color: #fff; 
        padding: 6px 14px; 
        border-radius: 4px; 
        font-weight: 600;
        transition: 0.3s; 
    }
    .admin_logout_btn:hover { background: #ed1c24; }

    /* 공통 유틸리티 클래스 */
    .txt_center { text-align: center !important; }
    .txt_left { text-align: left !important; }
</style>