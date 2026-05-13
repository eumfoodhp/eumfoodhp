<?php
include_once 'admin_header.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

$create_table_sql = "CREATE TABLE IF NOT EXISTS inquiry (
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
mysqli_query($conn, $create_table_sql);

$idx = isset($_GET['idx']) ? (int)$_GET['idx'] : 0;
if ($idx < 1) {
    echo "<script>alert('잘못된 접근입니다.'); location.href='contact_manage.php';</script>";
    exit;
}

$res = mysqli_query($conn, "SELECT * FROM inquiry WHERE idx = '{$idx}'");
$row = $res ? mysqli_fetch_assoc($res) : null;
if (!$row) {
    echo "<script>alert('존재하지 않는 문의입니다.'); location.href='contact_manage.php';</script>";
    exit;
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>관리자 - 1:1 문의 답변/수정</title>
    <link rel="stylesheet" href="/css/admin.css">
    <style>
        .admin_content { padding: 40px; max-width: 1100px; margin: 0 auto; }
        .form_title { font-size: 24px; font-weight: 700; margin-bottom: 24px; padding-bottom: 10px; border-bottom: 2px solid #222; }
        .admin_form { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 30px; }
        .group { margin-bottom: 20px; }
        .group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
        .group input, .group textarea {
            width: 100%; border: 1px solid #ccc; border-radius: 4px; padding: 12px; font-size: 14px; box-sizing: border-box;
        }
        .group textarea { min-height: 130px; line-height: 1.7; resize: vertical; }
        .answer_box { background: #fff8f5; border: 1px solid #ffd9c7; border-radius: 8px; padding: 20px; margin-top: 30px; }
        .btns { display: flex; justify-content: center; gap: 10px; margin-top: 30px; }
        .btn_save, .btn_list {
            min-width: 140px; height: 48px; border-radius: 4px; text-decoration: none;
            display: inline-flex; align-items: center; justify-content: center; font-weight: 600;
        }
        .btn_save { border: 0; background: #ff5d27; color: #fff; }
        .btn_list { background: #eee; color: #333; }
    </style>
</head>
<body>
<div class="admin_content">
    <h2 class="form_title">1:1 문의 답변/수정</h2>

    <form action="contact_db.php" method="post" class="admin_form">
        <input type="hidden" name="mode" value="update">
        <input type="hidden" name="idx" value="<?php echo $row['idx']; ?>">

        <div class="group">
            <label>제목</label>
            <input type="text" name="subject" value="<?php echo htmlspecialchars($row['subject']); ?>" required>
        </div>

        <div class="group">
            <label>작성자</label>
            <input type="text" name="writer_name" value="<?php echo htmlspecialchars($row['writer_name']); ?>" required>
        </div>

        <div class="group">
            <label>연락처</label>
            <input type="text" name="writer_phone" value="<?php echo htmlspecialchars($row['writer_phone']); ?>">
        </div>

        <div class="group">
            <label>이메일</label>
            <input type="text" name="writer_email" value="<?php echo htmlspecialchars($row['writer_email']); ?>">
        </div>

        <div class="group">
            <label>문의 내용</label>
            <textarea name="content" required><?php echo htmlspecialchars($row['content']); ?></textarea>
        </div>

        <div class="answer_box">
            <div class="group" style="margin-bottom: 14px;">
                <label>답변 담당자</label>
                <input type="text" name="answer_admin" value="<?php echo htmlspecialchars($row['answer_admin'] ?: ($_SESSION['admin_name'] ?? '')); ?>">
            </div>
            <div class="group" style="margin-bottom: 0;">
                <label>답변 내용 (입력 시 답변완료 처리)</label>
                <textarea name="answer_content"><?php echo htmlspecialchars($row['answer_content']); ?></textarea>
            </div>
        </div>

        <div class="btns">
            <button type="submit" class="btn_save">저장하기</button>
            <a href="contact_manage.php" class="btn_list">목록으로</a>
        </div>
    </form>
</div>
</body>
</html>
