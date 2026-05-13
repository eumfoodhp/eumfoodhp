<?php
// 1. 보안 체크 및 DB 연결
include_once 'admin_check.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

// 2. 수정 모드인지 확인
$idx = isset($_GET['idx']) ? mysqli_real_escape_string($conn, $_GET['idx']) : '';
$mode = $idx ? 'update' : 'insert';

// 초기값 설정
$h_year = date('Y');
$h_content = '';
$h_content_en = '';
$h_content_zh = '';

// 3. 수정 모드일 경우 기존 데이터 불러오기
if ($idx) {
    $sql = "SELECT * FROM history WHERE idx = '$idx'";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);

    if ($row) {
        $h_year = $row['h_year'];
        $h_content = $row['h_content'];
        $h_content_en = $row['h_content_en'];
        $h_content_zh = $row['h_content_zh'];
    } else {
        echo "<script>alert('존재하지 않는 데이터입니다.'); history.back();</script>";
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>관리자 - 연혁 <?php echo $idx ? '수정' : '등록'; ?></title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .admin_content { padding: 40px; max-width: 800px; margin: 0 auto; }
        .form_title { font-size: 28px; font-weight: 700; margin-bottom: 30px; border-bottom: 2px solid #222; padding-bottom: 15px; }
        
        .admin_form { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 8px; }
        .form_group { margin-bottom: 25px; }
        .form_group label { display: block; font-weight: 600; margin-bottom: 10px; color: #333; }
        .form_group input[type="text"], 
        .form_group textarea { 
            width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; box-sizing: border-box; 
        }
        .form_group textarea { height: 100px; line-height: 1.6; resize: vertical; }
        
        /* 구간 안내 텍스트 스타일 */
        #period_guide { display: inline-block; margin-top: 8px; font-size: 14px; color: #FF5D27; font-weight: 600; }

        .btn_area { display: flex; gap: 10px; justify-content: center; margin-top: 40px; }
        .btn_submit { padding: 15px 40px; background: #FF5D27; color: #fff; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn_submit:hover { background: #e65220; }
        .btn_cancel { padding: 15px 40px; background: #eee; color: #333; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; text-decoration: none; text-align: center; line-height: 1; }
        .btn_cancel:hover { background: #ddd; }
    </style>
</head>
<body>

<div class="admin_content">
    <h2 class="form_title">연혁 <?php echo $idx ? '수정' : '추가'; ?></h2>

    <form action="history_db.php" method="POST" class="admin_form">
        <input type="hidden" name="mode" value="<?php echo $mode; ?>">
        <input type="hidden" name="idx" value="<?php echo $idx; ?>">

        <div class="form_group">
            <label>연도</label>
            <input type="text" name="h_year" id="h_year" value="<?php echo $h_year; ?>" placeholder="예: 2026" required>
            <!-- 입력한 연도에 따라 어떤 구간에 포함되는지 실시간 가이드 표시 -->
            <span id="period_guide"></span>
        </div>
        
        <div class="form_group">
            <label>내용 (한국어)</label>
            <textarea name="h_content" required><?php echo $h_content; ?></textarea>
        </div>
        
        <div class="form_group">
            <label>내용 (영어)</label>
            <textarea name="h_content_en" placeholder="English description"><?php echo $h_content_en; ?></textarea>
        </div>
        
        <div class="form_group">
            <label>내용 (중국어)</label>
            <textarea name="h_content_zh" placeholder="Chinese description"><?php echo $h_content_zh; ?></textarea>
        </div>
        
        <div class="btn_area">
            <button type="submit" class="btn_submit">연혁 <?php echo $idx ? '수정' : '등록'; ?></button>
            <a href="history_manage.php" class="btn_cancel">취소</a>
        </div>
    </form>
</div>

<script>
// 연도 입력 시 구간 가이드를 업데이트하는 스크립트
const yearInput = document.getElementById('h_year');
const guideSpan = document.getElementById('period_guide');

function updatePeriodGuide() {
    const year = parseInt(yearInput.value);
    let period = "";

    if (isNaN(year)) {
        period = "";
    } else if (year >= 2022) {
        period = "분류: NOW ~ 2022 구간에 표시됩니다.";
    } else if (year >= 2017) {
        period = "분류: 2021 ~ 2017 구간에 표시됩니다.";
    } else if (year >= 2012) {
        period = "분류: 2016 ~ 2012 구간에 표시됩니다.";
    } else if (year >= 2009) {
        period = "분류: 2011 ~ 2009 구간에 표시됩니다.";
    } else {
        period = "분류: 이전 연혁으로 분류됩니다.";
    }
    
    guideSpan.innerText = period;
}

// 초기 실행 및 입력 시마다 실행
yearInput.addEventListener('input', updatePeriodGuide);
updatePeriodGuide();
</script>

</body>
</html>