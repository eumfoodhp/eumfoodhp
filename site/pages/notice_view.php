<?php
// 1. 공통 설정 및 DB 연결 (최상단 배치)
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

// 2. IDX 값 보안 처리
$idx = isset($_GET['idx']) ? mysqli_real_escape_string($conn, $_GET['idx']) : '';

// IDX가 없으면 리스트로 리다이렉트
if (!$idx) { 
    echo "<script>location.href='notice_list.php';</script>"; 
    exit; 
}

// 3. 조회수 중복 방지 쿠키 로직 (반드시 header.php 출력 전에 실행)
$view_cookie_name = "notice_view_" . $idx;

if (!isset($_COOKIE[$view_cookie_name])) {
    // 쿠키가 없을 때만 DB 조회수 업데이트
    $update_sql = "UPDATE notice SET view_count = view_count + 1 WHERE idx = '$idx'";
    mysqli_query($conn, $update_sql);
    
    // 24시간(86400초) 동안 유효한 쿠키 설정
    setcookie($view_cookie_name, "visited", time() + 86400, "/");
}

// 4. 헤더 로드 (이 시점부터 브라우저 출력이 시작됨)
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

// 5. 현재 언어 설정 및 다국어 컬럼 지정
$current_lang = $_SESSION['lang'] ?? 'ko';
$title_col = 'n_title_' . $current_lang;
$content_col = 'n_content_' . $current_lang;
$file_name_col = 'file_name_' . $current_lang;
$file_ori_col = 'file_ori_' . $current_lang;

// 6. 공지사항 데이터 조회
$sql = "SELECT 
            idx, 
            $title_col AS title, 
            $content_col AS content, 
            $file_name_col AS file_nm, 
            $file_ori_col AS file_ori, 
            view_count,
            reg_date 
        FROM notice 
        WHERE idx = '$idx'";

$res = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($res);

// 게시글이 없는 경우 예외 처리
if (!$row) { 
    echo "<script>alert('존재하지 않는 게시글입니다.'); history.back();</script>"; 
    exit; 
}
?>

<link rel="stylesheet" href="/css/sub.css">
<style>
    /* 자료실(board_view) 디자인과 동일하게 세팅 */
    .view_container { max-width: 1200px; margin: 80px auto; padding: 0 20px; }
    
    .view_header { border-bottom: 1px solid #eee; padding-bottom: 30px; margin-bottom: 40px; }
    .view_header h3 { font-size: 32px; font-weight: 700; color: #222; margin-bottom: 20px; line-height: 1.4; }
    
    .view_info { display: flex; gap: 20px; color: #767676; font-size: 15px; }
    
    .view_content { min-height: 300px; line-height: 1.8; font-size: 16px; color: #444; margin-bottom: 60px; word-break: break-all; }
    
    /* 자료실 특유의 회색 파일 섹션 */
    .file_down_section { background: #f8f9fa; padding: 20px 30px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 60px; border: 1px solid #eee; }
    .file_down_section .file_name_group { display: flex; align-items: center; gap: 12px; font-weight: 500; color: #333; }
    .file_down_section .file_icon { width: 20px; font-size: 20px; }
    
    .btn_download { 
        color: #FF5D27; font-weight: 700; text-decoration: none; font-size: 14px; 
        padding: 8px 16px; border: 1px solid #FF5D27; border-radius: 4px; transition: 0.3s;
    }
    .btn_download:hover { background: #FF5D27; color: #fff; }
    
    /* 하단 버튼 영역 */
    .btn_wrap { text-align: center; border-top: 1px solid #eee; padding-top: 40px; }
    .btn_list { display: inline-block; padding: 15px 60px; background: #FF5D27; color: #fff; border-radius: 4px; text-decoration: none; font-weight: 600; transition: 0.3s; }
    .btn_list:hover { background: #e65220; }

    /* 브레드크럼 및 비주얼 보정 */
    .sub_visual_section { padding: 60px 0; text-align: center; }

    @media (max-width: 735px) {
        .sub_visual_section { padding: 32px 0 20px; }
        .sub_page_title { font-size: 28px !important; margin-top: 12px !important; }
        .sub_page_desc { font-size: 13px !important; }

        .view_container { margin: 32px auto; padding: 0 16px; }
        .view_header { padding-bottom: 20px; margin-bottom: 28px; }
        .view_header h3 { font-size: 20px; line-height: 30px; margin-bottom: 12px; }
        .view_info { flex-wrap: wrap; gap: 6px 14px; font-size: 13px; }
        .view_content { font-size: 15px; line-height: 1.7; margin-bottom: 32px; }
        .file_down_section { flex-direction: column; align-items: flex-start; gap: 12px; padding: 16px 18px; }
        .btn_wrap { padding-top: 24px; }
        .btn_list { padding: 12px 40px; font-size: 14px; }
    }

    @media (max-width: 400px) {
        .view_header h3 { font-size: 17px; line-height: 26px; }
        .view_content { font-size: 14px; }
        .btn_list { padding: 10px 30px; font-size: 13px; }
    }
</style>

<main id="sub_contents">
    <section class="sub_visual_section">
        <div class="sub_inner">
             <nav class="breadcrumb" style="display:flex; justify-content:center; align-items:center; gap:10px; margin-bottom:15px;">
                 <img src="/images/sub/home.png" alt="home" style="width:16px; vertical-align:middle;"> 
                 <i class="dot" style="display:inline-block; width:3px; height:3px; background:#ccc; border-radius:50%; margin:0 10px; vertical-align:middle;"></i>
                 <span style="font-size:14px; color:#666; vertical-align:middle;">
                    <?php echo ($current_lang == 'ko') ? '공지사항' : 'Notice'; ?>
                 </span>
             </nav>
             <h2 class="sub_page_title" style="font-size:48px; font-weight:800; color:#222; margin-top:20px;">
                <?php echo ($current_lang == 'ko') ? '공지사항' : 'Notice'; ?>
             </h2>
             <p class="sub_page_desc" style="color:#666; margin-top:10px;">
                <?php echo ($current_lang == 'ko') ? '㈜이음푸드시스템의 새로운 소식과 안내를 전해드립니다.' : 'We deliver the latest news and guides from Eum Food System Co., Ltd.'; ?>
             </p>
        </div>
    </section>

    <div class="view_container">
        <div class="view_header">
            <h3><?php echo htmlspecialchars($row['title'] ?? ''); ?></h3>
            <div class="view_info">
                <span>작성자 | ㈜이음푸드시스템</span>
                <span>게시일 | <?php echo date('Y.m.d', strtotime($row['reg_date'])); ?></span>
                <span>조회수 | <?php echo number_format($row['view_count']); ?></span>
            </div>
        </div>

        <div class="view_content">
            <?php 
                if(!empty($row['content'])) {
                    echo nl2br($row['content']); 
                } else {
                    echo "<p style='color:#ccc;'>No content available.</p>";
                }
            ?>
        </div>

        <?php if(!empty($row['file_nm'])): ?>
        <div class="file_down_section">
            <div class="file_name_group">
                <span class="file_icon">📁</span>
                <span class="file_text"><?php echo $row['file_ori']; ?></span>
            </div>
            <a href="/inc/download.php?file=<?php echo urlencode($row['file_nm']); ?>&ori=<?php echo urlencode($row['file_ori']); ?>" class="btn_download">
                DOWNLOAD
            </a>
        </div>
        <?php endif; ?>

        <div class="btn_wrap">
            <a href="notice_list.php" class="btn_list">
                <?php 
                    if($current_lang == 'ko') echo '목록으로';
                    else if($current_lang == 'en') echo 'LIST';
                    else echo '返回列表';
                ?>
            </a>
        </div>
    </div>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>