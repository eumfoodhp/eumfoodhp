<?php
// 1. 보안 체크 및 DB 연결
include_once 'admin_header.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

$create_board_table_sql = "CREATE TABLE IF NOT EXISTS board (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    b_title_ko VARCHAR(255) NOT NULL,
    b_title_en VARCHAR(255) DEFAULT NULL,
    b_title_zh VARCHAR(255) DEFAULT NULL,
    b_content_ko TEXT,
    b_content_en TEXT,
    b_content_zh TEXT,
    asset_kind VARCHAR(20) DEFAULT NULL,
    file_name_ko VARCHAR(255) DEFAULT NULL,
    file_ori_ko VARCHAR(255) DEFAULT NULL,
    file_name_en VARCHAR(255) DEFAULT NULL,
    file_ori_en VARCHAR(255) DEFAULT NULL,
    file_name_zh VARCHAR(255) DEFAULT NULL,
    file_ori_zh VARCHAR(255) DEFAULT NULL,
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
if (!mysqli_query($conn, $create_board_table_sql)) {
    die('에러 발생: ' . mysqli_error($conn));
}

// 2. 파라미터 확인 및 모드 설정
$idx = isset($_GET['idx']) ? mysqli_real_escape_string($conn, $_GET['idx']) : '';
$mode = $idx ? 'update' : 'insert';

// 초기값 설정 (에러 방지용)
$row = [
    'b_title_ko'=>'', 'b_title_en'=>'', 'b_title_zh'=>'', 
    'b_content_ko'=>'', 'b_content_en'=>'', 'b_content_zh'=>'', 
    'file_ori_name'=>'',
    'asset_kind' => 'brochure'
];

// 3. 수정 모드일 경우 기존 데이터 로드
if ($idx) {
    $sql = "SELECT * FROM board WHERE idx = '$idx'";
    $res = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($res);
    
    if (!$row) {
        echo "<script>alert('존재하지 않는 게시글입니다.'); history.back();</script>";
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>관리자 - 자료 <?php echo $idx ? '수정' : '등록'; ?></title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .admin_content { padding: 40px; max-width: 900px; margin: 0 auto; }
        .form_title { font-size: 24px; font-weight: 700; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #222; }
        
        .admin_form { background: #fff; border: 1px solid #ddd; padding: 30px; border-radius: 8px; }
        .form_group { margin-bottom: 25px; }
        .form_group label { display: block; font-weight: 600; margin-bottom: 10px; color: #333; }
        .form_group input[type="text"], 
        .form_group textarea { 
            width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 15px; box-sizing: border-box; 
        }
        .form_group textarea { height: 150px; line-height: 1.6; resize: vertical; }
        
        .file_info_box { background: #fdf2ee; border: 1px solid #ffdec2; padding: 15px; border-radius: 4px; margin-top: 10px; }
        .file_info_box p { margin: 0; font-size: 14px; color: #FF5D27; }
        .file_guide_box { background: #f6f8ff; border: 1px solid #d8e3ff; padding: 14px 16px; border-radius: 6px; margin: 10px 0 20px; }
        .file_guide_box p { margin: 0; font-size: 13px; line-height: 1.7; color: #345; }
        
        .btn_area { display: flex; gap: 10px; justify-content: center; margin-top: 40px; }
        .btn_save { padding: 15px 60px; background: #FF5D27; color: #fff; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn_save:hover { background: #e65220; }
        .btn_list { padding: 15px 60px; background: #eee; color: #333; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 600; text-align: center; }
        
        .kind_select { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 15px; box-sizing: border-box; background: #fff; }
    </style>
</head>
<body>

<div class="admin_content">
    <h2 class="form_title">자료실 자료 <?php echo $idx ? '수정' : '등록'; ?></h2>

    <form action="board_db.php" method="POST" enctype="multipart/form-data" class="admin_form">
        <input type="hidden" name="mode" value="<?php echo $mode; ?>">
        <input type="hidden" name="idx" value="<?php echo $idx; ?>">
        <input type="hidden" name="b_title_ko" value="<?php echo htmlspecialchars($row['b_title_ko']); ?>">
        <input type="hidden" name="b_title_en" value="<?php echo htmlspecialchars($row['b_title_en']); ?>">
        <input type="hidden" name="b_title_zh" value="<?php echo htmlspecialchars($row['b_title_zh']); ?>">
        <input type="hidden" name="b_content_ko" value="<?php echo htmlspecialchars($row['b_content_ko']); ?>">
        <input type="hidden" name="b_content_en" value="<?php echo htmlspecialchars($row['b_content_en']); ?>">
        <input type="hidden" name="b_content_zh" value="<?php echo htmlspecialchars($row['b_content_zh']); ?>">

        <div class="form_group">
            <label>자료 유형 (고정 업로드 규칙)</label>
            <select name="asset_kind" id="asset_kind" class="kind_select">
                <option value="brochure" <?php echo (($row['asset_kind'] ?? 'brochure') === 'brochure') ? 'selected' : ''; ?>>회사소개서 (국문 1 + 중문 1)</option>
                <option value="catalog" <?php echo (($row['asset_kind'] ?? '') === 'catalog') ? 'selected' : ''; ?>>카탈로그 (국문 1)</option>
                <option value="ci_logo" <?php echo (($row['asset_kind'] ?? '') === 'ci_logo') ? 'selected' : ''; ?>>CI로고 (AI 1 + PNG 1)</option>
            </select>
        </div>

<div class="form_group" style="margin-top:15px; padding-top:15px; border-top:1px dashed #ddd;">
    <label>첨부파일 등록 규칙</label>
    <div class="file_guide_box">
        <p>회사소개서: A=국문, C=중문</p>
        <p>카탈로그: A=국문만 사용</p>
        <p>CI로고: A=AI, B=PNG</p>
    </div>
</div>

<div class="form_group" style="margin-top:15px; padding-top:15px; border-top:1px dashed #ddd;">
    <label>📎 첨부파일 A <span id="label_a_hint">(국문/AI)</span></label>
    <input type="file" name="upfile_ko">
    <?php if(!empty($row['file_ori_ko'])): ?>
        <div class="file_info_box">
            <p>현재 파일: <strong><?php echo $row['file_ori_ko']; ?></strong></p>
        </div>
    <?php endif; ?>
</div>

<div class="form_group" style="margin-top:15px; padding-top:15px; border-top:1px dashed #ddd;">
    <label>📎 첨부파일 B <span id="label_b_hint">(PNG 전용)</span></label>
    <input type="file" name="upfile_en">
    <?php if(!empty($row['file_ori_en'])): ?>
        <div class="file_info_box">
            <p>현재 파일: <strong><?php echo $row['file_ori_en']; ?></strong></p>
        </div>
    <?php endif; ?>
</div>

<div class="form_group" style="margin-top:15px; padding-top:15px; border-top:1px dashed #ddd;">
    <label>📎 첨부파일 C <span id="label_c_hint">(중문 전용)</span></label>
    <input type="file" name="upfile_zh">
    <?php if(!empty($row['file_ori_zh'])): ?>
        <div class="file_info_box">
            <p>현재 파일: <strong><?php echo $row['file_ori_zh']; ?></strong></p>
        </div>
    <?php endif; ?>
</div>

        <div class="btn_area">
            <button type="submit" class="btn_save">저장하기</button>
            <a href="board_manage.php" class="btn_list">목록으로</a>
        </div>
    </form>
</div>

<script>
    (function () {
        const kindEl = document.getElementById('asset_kind');
        const aHint = document.getElementById('label_a_hint');
        const bHint = document.getElementById('label_b_hint');
        const cHint = document.getElementById('label_c_hint');
        if (!kindEl || !aHint || !bHint || !cHint) return;

        function updateHints() {
            const kind = kindEl.value;
            if (kind === 'brochure') {
                aHint.textContent = '(국문 필수)';
                bHint.textContent = '(미사용)';
                cHint.textContent = '(중문 필수)';
            } else if (kind === 'catalog') {
                aHint.textContent = '(국문 필수)';
                bHint.textContent = '(미사용)';
                cHint.textContent = '(미사용)';
            } else {
                aHint.textContent = '(AI 필수)';
                bHint.textContent = '(PNG 필수)';
                cHint.textContent = '(미사용)';
            }
        }

        kindEl.addEventListener('change', updateHints);
        updateHints();
    })();
</script>

</body>
</html>