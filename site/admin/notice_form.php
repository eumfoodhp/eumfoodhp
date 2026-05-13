<?php
// 1. 보안 체크 및 DB 연결
include_once 'admin_header.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

// 2. 파라미터 확인 및 모드 설정
$idx = isset($_GET['idx']) ? mysqli_real_escape_string($conn, $_GET['idx']) : '';
$mode = $idx ? 'update' : 'insert';

// 초기값 설정 (에러 방지용)
$row = [
    'is_notice'=>'N',
    'n_title_ko'=>'', 'n_title_en'=>'', 'n_title_zh'=>'', 
    'n_content_ko'=>'', 'n_content_en'=>'', 'n_content_zh'=>'', 
    'file_ori_ko'=>'', 'file_ori_en'=>'', 'file_ori_zh'=>''
];

// 3. 수정 모드일 경우 기존 데이터 로드
if ($idx) {
    $sql = "SELECT * FROM notice WHERE idx = '$idx'";
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
    <title>관리자 - 공지사항 <?php echo $idx ? '수정' : '등록'; ?></title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .admin_content { padding: 40px; max-width: 1000px; margin: 0 auto; }
        .form_title { font-size: 24px; font-weight: 700; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #222; }
        
        .admin_form { background: #fff; border: 1px solid #ddd; padding: 30px; border-radius: 8px; }
        .form_group { margin-bottom: 25px; }
        .form_group label { display: block; font-weight: 600; margin-bottom: 10px; color: #333; }
        
        /* 중요공지 체크박스 스타일 */
        .notice_check_wrap { background: #fff5f2; padding: 15px 20px; border-radius: 6px; border: 1px solid #ffdec2; margin-bottom: 30px; display: flex; align-items: center; gap: 10px; }
        .notice_check_wrap input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
        .notice_check_wrap span { font-weight: 700; color: #FF5D27; cursor: pointer; }

        .form_group input[type="text"], 
        .form_group textarea { 
            width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 15px; box-sizing: border-box; 
        }
        .form_group textarea { height: 150px; line-height: 1.6; resize: vertical; }
        
        .lang_section { padding: 25px; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 30px; background: #fafafa; }
        .lang_label { display: inline-block; padding: 4px 10px; background: #333; color: #fff; font-size: 12px; border-radius: 3px; margin-bottom: 20px; font-weight: 600; }
        
        .file_info_box { background: #eee; padding: 10px; border-radius: 4px; margin-top: 10px; font-size: 13px; color: #666; }
        
        .btn_area { display: flex; gap: 10px; justify-content: center; margin-top: 40px; }
        .btn_save { padding: 15px 60px; background: #FF5D27; color: #fff; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn_save:hover { background: #e65220; }
        .btn_list { padding: 15px 60px; background: #eee; color: #333; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 600; text-align: center; }
    </style>
</head>
<body>

<div class="admin_content">
    <h2 class="form_title">공지사항 <?php echo $idx ? '수정' : '등록'; ?></h2>

    <form action="notice_db.php" method="POST" enctype="multipart/form-data" class="admin_form">
        <input type="hidden" name="mode" value="<?php echo $mode; ?>">
        <input type="hidden" name="idx" value="<?php echo $idx; ?>">

        <div class="notice_check_wrap">
            <input type="checkbox" name="is_notice" id="is_notice" value="Y" <?php echo ($row['is_notice'] == 'Y') ? 'checked' : ''; ?>>
            <label for="is_notice"><span>체크 시 공지사항(상단 고정), 해제 시 보도자료로 노출됩니다.</span></label>
        </div>

        <div class="lang_section">
            <span class="lang_label">KOREAN (필수)</span>
            <div class="form_group">
                <label>제목</label>
                <input type="text" name="n_title_ko" value="<?php echo htmlspecialchars($row['n_title_ko']); ?>" required>
            </div>
            <div class="form_group">
                <label>내용</label>
                <textarea name="n_content_ko" required><?php echo $row['n_content_ko']; ?></textarea>
            </div>
            <div class="form_group">
                <label>📎 첨부파일 (KO)</label>
                <input type="file" name="upfile_ko">
                <?php if($row['file_ori_ko']): ?>
                    <div class="file_info_box">현재 파일: <strong><?php echo $row['file_ori_ko']; ?></strong></div>
                <?php endif; ?>
            </div>
        </div>

        <div class="lang_section">
            <span class="lang_label">ENGLISH</span>
            <div class="form_group">
                <label>Title (EN)</label>
                <input type="text" name="n_title_en" value="<?php echo htmlspecialchars($row['n_title_en']); ?>">
            </div>
            <div class="form_group">
                <label>Content (EN)</label>
                <textarea name="n_content_en"><?php echo $row['n_content_en']; ?></textarea>
            </div>
            <div class="form_group">
                <label>📎 첨부파일 (EN)</label>
                <input type="file" name="upfile_en">
                <?php if($row['file_ori_en']): ?>
                    <div class="file_info_box">현재 파일: <strong><?php echo $row['file_ori_en']; ?></strong></div>
                <?php endif; ?>
            </div>
        </div>

        <div class="lang_section">
            <span class="lang_label">CHINESE</span>
            <div class="form_group">
                <label>Title (ZH)</label>
                <input type="text" name="n_title_zh" value="<?php echo htmlspecialchars($row['n_title_zh']); ?>">
            </div>
            <div class="form_group">
                <label>Content (ZH)</label>
                <textarea name="n_content_zh"><?php echo $row['n_content_zh']; ?></textarea>
            </div>
            <div class="form_group">
                <label>📎 첨부파일 (ZH)</label>
                <input type="file" name="upfile_zh">
                <?php if($row['file_ori_zh']): ?>
                    <div class="file_info_box">현재 파일: <strong><?php echo $row['file_ori_zh']; ?></strong></div>
                <?php endif; ?>
            </div>
        </div>

        <div class="btn_area">
            <button type="submit" class="btn_save">공지사항 저장</button>
            <a href="notice_manage.php" class="btn_list">취소/목록</a>
        </div>
    </form>
</div>

</body>
</html>