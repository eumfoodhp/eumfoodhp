<?php
include_once 'admin_header.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

$create_table_sql = "CREATE TABLE IF NOT EXISTS press (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    p_title_ko VARCHAR(255) NOT NULL,
    p_title_en VARCHAR(255) DEFAULT NULL,
    p_title_zh VARCHAR(255) DEFAULT NULL,
    p_content_ko TEXT,
    p_content_en TEXT,
    p_content_zh TEXT,
    file_name_ko VARCHAR(255) DEFAULT NULL,
    file_ori_ko VARCHAR(255) DEFAULT NULL,
    file_name_en VARCHAR(255) DEFAULT NULL,
    file_ori_en VARCHAR(255) DEFAULT NULL,
    file_name_zh VARCHAR(255) DEFAULT NULL,
    file_ori_zh VARCHAR(255) DEFAULT NULL,
    view_count INT NOT NULL DEFAULT 0,
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
mysqli_query($conn, $create_table_sql);

$idx = isset($_GET['idx']) ? mysqli_real_escape_string($conn, $_GET['idx']) : '';
$mode = $idx ? 'update' : 'insert';

$row = [
    'p_title_ko'=>'', 'p_title_en'=>'', 'p_title_zh'=>'',
    'p_content_ko'=>'', 'p_content_en'=>'', 'p_content_zh'=>'',
    'file_ori_ko'=>'', 'file_ori_en'=>'', 'file_ori_zh'=>''
];

if ($idx) {
    $sql = "SELECT * FROM press WHERE idx = '$idx'";
    $res = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($res);
    if (!$row) {
        echo "<script>alert('존재하지 않는 보도자료입니다.'); history.back();</script>";
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>관리자 - 보도자료 <?php echo $idx ? '수정' : '등록'; ?></title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .admin_content { padding: 40px; max-width: 1000px; margin: 0 auto; }
        .form_title { font-size: 24px; font-weight: 700; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #222; }
        .admin_form { background: #fff; border: 1px solid #ddd; padding: 30px; border-radius: 8px; }
        .form_group { margin-bottom: 25px; }
        .form_group label { display: block; font-weight: 600; margin-bottom: 10px; color: #333; }
        .form_group input[type="text"], .form_group textarea {
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
    <h2 class="form_title">보도자료 <?php echo $idx ? '수정' : '등록'; ?></h2>

    <form action="press_db.php" method="POST" enctype="multipart/form-data" class="admin_form">
        <input type="hidden" name="mode" value="<?php echo $mode; ?>">
        <input type="hidden" name="idx" value="<?php echo $idx; ?>">

        <div class="lang_section">
            <span class="lang_label">KOREAN (필수)</span>
            <div class="form_group">
                <label>제목</label>
                <input type="text" name="p_title_ko" value="<?php echo htmlspecialchars($row['p_title_ko']); ?>" required>
            </div>
            <div class="form_group">
                <label>내용</label>
                <textarea name="p_content_ko" required><?php echo $row['p_content_ko']; ?></textarea>
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
                <input type="text" name="p_title_en" value="<?php echo htmlspecialchars($row['p_title_en']); ?>">
            </div>
            <div class="form_group">
                <label>Content (EN)</label>
                <textarea name="p_content_en"><?php echo $row['p_content_en']; ?></textarea>
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
                <input type="text" name="p_title_zh" value="<?php echo htmlspecialchars($row['p_title_zh']); ?>">
            </div>
            <div class="form_group">
                <label>Content (ZH)</label>
                <textarea name="p_content_zh"><?php echo $row['p_content_zh']; ?></textarea>
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
            <button type="submit" class="btn_save">보도자료 저장</button>
            <a href="press_manage.php" class="btn_list">취소/목록</a>
        </div>
    </form>
</div>
</body>
</html>
