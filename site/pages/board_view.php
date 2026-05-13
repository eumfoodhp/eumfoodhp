<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';

// 인덱스 보안 처리
$idx = isset($_GET['idx']) ? mysqli_real_escape_string($conn, $_GET['idx']) : '';
if (!$idx) { echo "<script>location.href='board_list.php';</script>"; exit; }

// 현재 언어 설정 확인
$current_lang = $_SESSION['lang'] ?? 'ko';

// 다국어 제목/본문/파일 컬럼명 동적 지정
$title_col = 'b_title_' . $current_lang;
$content_col = 'b_content_' . $current_lang;
$file_name_col = 'file_name_' . $current_lang;
$file_ori_col = 'file_ori_' . $current_lang;

// 쿼리에 모든 언어 파일을 가져오도록 하거나, 현재 언어 파일만 별칭(Alias)으로 가져옴
$sql = "SELECT 
            idx, 
            $title_col AS title, 
            $content_col AS content, 
            $file_name_col AS file_nm, 
            $file_ori_col AS file_ori, 
            reg_date 
        FROM board 
        WHERE idx = '$idx'";

$res = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($res);

if (!$row) { echo "<script>alert('존재하지 않는 게시글입니다.'); history.back();</script>"; exit; }
?>

<link rel="stylesheet" href="/css/sub.css">
<style>
    .view_container { max-width: 1200px; margin: 80px auto; padding: 0 20px; }
    .view_header { border-bottom: 1px solid #eee; padding-bottom: 30px; margin-bottom: 40px; }
    .view_header h3 { font-size: 32px; font-weight: 700; color: #222; margin-bottom: 20px; line-height: 1.4; }
    .view_info { display: flex; gap: 20px; color: #767676; font-size: 15px; }
    .view_content { min-height: 300px; line-height: 1.8; font-size: 16px; color: #444; margin-bottom: 60px; word-break: break-all; }
    
    .file_down_section { background: #f8f9fa; padding: 20px 30px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 60px; border: 1px solid #eee; }
    .file_down_section .file_name_group { display: flex; align-items: center; gap: 12px; font-weight: 500; color: #333; }
    .file_down_section .file_icon { width: 20px; }
    
    .btn_download { 
        color: #FF5D27; font-weight: 700; text-decoration: none; font-size: 14px; 
        padding: 8px 16px; border: 1px solid #FF5D27; border-radius: 4px; transition: 0.3s;
    }
    .btn_download:hover { background: #FF5D27; color: #fff; }
    
    .btn_wrap { text-align: center; border-top: 1px solid #eee; padding-top: 40px; }
    .btn_list { display: inline-block; padding: 15px 60px; background: #FF5D27; color: #fff; border-radius: 4px; text-decoration: none; font-weight: 600; transition: 0.3s; }
    .btn_list:hover { background: #e65220; }

    /* 브레드크럼 등 레이아웃 보정 */
    .sub_visual_section { padding: 60px 0; }

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
        <div class="sub_inner" style="text-align:center;">
             <nav class="breadcrumb" style="justify-content:center;">
                 <img src="/images/sub/home.png" class="home_icon" alt="home"> 
                 <i class="dot"></i> 
                 <span><?php echo ($current_lang == 'ko') ? '자료실' : 'Archive'; ?></span>
             </nav>
             <h2 class="sub_page_title" style="font-size:48px; margin-top:20px; font-weight:800;">
                <?php echo ($current_lang == 'ko') ? '자료실' : 'Archive'; ?>
             </h2>
             <p class="sub_page_desc" style="color:#666; margin-top:10px;">
                <?php echo ($current_lang == 'ko') ? '진정성 있는 소통으로 모두가 함께 성장하는 기업이 되겠습니다.' : 'We will become a company that grows together through sincere communication.'; ?>
             </p>
        </div>
    </section>

    <div class="view_container">
        <div class="view_header">
            <h3><?php echo htmlspecialchars($row['title']); ?></h3>
            <div class="view_info">
                <span>작성자 | ㈜이음푸드시스템</span>
                <span>게시일 | <?php echo date('Y.m.d', strtotime($row['reg_date'])); ?></span>
            </div>
        </div>

        <div class="view_content">
            <?php 
                // 본문 내용이 있을 경우 출력, 없을 경우 안내 문구
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
            <a href="board_list.php" class="btn_list">
                <?php echo ($current_lang == 'ko') ? '목록으로' : 'Back to List'; ?>
            </a>
        </div>
    </div>
</main>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>