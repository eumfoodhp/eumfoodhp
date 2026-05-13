<?php
include_once 'admin_check.php';
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
if (!mysqli_query($conn, $create_table_sql)) {
    echo "에러 발생: " . mysqli_error($conn);
    exit;
}

$mode = $_REQUEST['mode'] ?? '';
$idx = mysqli_real_escape_string($conn, $_REQUEST['idx'] ?? '');

$p_title_ko = mysqli_real_escape_string($conn, $_POST['p_title_ko'] ?? '');
$p_title_en = mysqli_real_escape_string($conn, $_POST['p_title_en'] ?? '');
$p_title_zh = mysqli_real_escape_string($conn, $_POST['p_title_zh'] ?? '');

$p_content_ko = mysqli_real_escape_string($conn, $_POST['p_content_ko'] ?? '');
$p_content_en = mysqli_real_escape_string($conn, $_POST['p_content_en'] ?? '');
$p_content_zh = mysqli_real_escape_string($conn, $_POST['p_content_zh'] ?? '');

$upload_dir = $_SERVER['DOCUMENT_ROOT'] . "/upload/press/";
if(!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

if ($mode == 'insert' || $mode == 'update') {
    $langs = ['ko', 'en', 'zh'];
    $file_data = [];

    foreach ($langs as $lang) {
        $input_name = "upfile_" . $lang;
        $file_data[$lang] = ['new' => '', 'ori' => ''];

        if (isset($_FILES[$input_name]) && $_FILES[$input_name]['name']) {
            if ($mode == 'update' && !empty($idx)) {
                $prev_res = mysqli_query($conn, "SELECT file_name_$lang FROM press WHERE idx = '$idx'");
                $prev_row = mysqli_fetch_assoc($prev_res);
                if ($prev_row && $prev_row["file_name_$lang"]) {
                    @unlink($upload_dir . $prev_row["file_name_$lang"]);
                }
            }

            $ori_name = mysqli_real_escape_string($conn, $_FILES[$input_name]['name']);
            $ext = pathinfo($ori_name, PATHINFO_EXTENSION);
            $new_name = time() . "_press_" . $lang . "_" . rand(1000, 9999) . "." . $ext;

            if (move_uploaded_file($_FILES[$input_name]['tmp_name'], $upload_dir . $new_name)) {
                $file_data[$lang]['new'] = $new_name;
                $file_data[$lang]['ori'] = $ori_name;
            }
        }
    }

    if ($mode == 'insert') {
        $sql = "INSERT INTO press (
                    p_title_ko, p_title_en, p_title_zh,
                    p_content_ko, p_content_en, p_content_zh,
                    file_name_ko, file_ori_ko,
                    file_name_en, file_ori_en,
                    file_name_zh, file_ori_zh,
                    reg_date
                ) VALUES (
                    '$p_title_ko', '$p_title_en', '$p_title_zh',
                    '$p_content_ko', '$p_content_en', '$p_content_zh',
                    '{$file_data['ko']['new']}', '{$file_data['ko']['ori']}',
                    '{$file_data['en']['new']}', '{$file_data['en']['ori']}',
                    '{$file_data['zh']['new']}', '{$file_data['zh']['ori']}',
                    NOW()
                )";
        $msg = "보도자료가 등록되었습니다.";
    } else {
        $file_update_sql = "";
        foreach ($langs as $lang) {
            if ($file_data[$lang]['new']) {
                $file_update_sql .= ", file_name_$lang = '{$file_data[$lang]['new']}', file_ori_$lang = '{$file_data[$lang]['ori']}'";
            }
        }

        $sql = "UPDATE press SET
                    p_title_ko = '$p_title_ko',
                    p_title_en = '$p_title_en',
                    p_title_zh = '$p_title_zh',
                    p_content_ko = '$p_content_ko',
                    p_content_en = '$p_content_en',
                    p_content_zh = '$p_content_zh'
                    $file_update_sql
                WHERE idx = '$idx'";
        $msg = "보도자료가 수정되었습니다.";
    }

} else if ($mode == 'delete') {
    if (empty($idx)) {
        echo "<script>alert('삭제할 데이터가 지정되지 않았습니다.'); history.back();</script>";
        exit;
    }

    $res = mysqli_query($conn, "SELECT file_name_ko, file_name_en, file_name_zh FROM press WHERE idx = '$idx'");
    $row = mysqli_fetch_assoc($res);

    if($row) {
        if($row['file_name_ko']) @unlink($upload_dir . $row['file_name_ko']);
        if($row['file_name_en']) @unlink($upload_dir . $row['file_name_en']);
        if($row['file_name_zh']) @unlink($upload_dir . $row['file_name_zh']);
    }

    $sql = "DELETE FROM press WHERE idx = '$idx'";
    $msg = "보도자료가 삭제되었습니다.";
} else {
    echo "<script>alert('잘못된 접근입니다.'); location.href='press_manage.php';</script>";
    exit;
}

if (mysqli_query($conn, $sql)) {
    echo "<script>
            alert('$msg');
            location.href = 'press_manage.php';
          </script>";
} else {
    echo "에러 발생: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
