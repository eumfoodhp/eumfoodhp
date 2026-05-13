<?php
// 1. 보안 체크 및 DB 연결
include_once 'admin_check.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

// notice 테이블이 없으면 자동 생성
$create_notice_table_sql = "CREATE TABLE IF NOT EXISTS notice (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    is_notice CHAR(1) NOT NULL DEFAULT 'N',
    n_title_ko VARCHAR(255) NOT NULL,
    n_title_en VARCHAR(255) DEFAULT NULL,
    n_title_zh VARCHAR(255) DEFAULT NULL,
    n_content_ko TEXT,
    n_content_en TEXT,
    n_content_zh TEXT,
    file_name_ko VARCHAR(255) DEFAULT NULL,
    file_ori_ko VARCHAR(255) DEFAULT NULL,
    file_name_en VARCHAR(255) DEFAULT NULL,
    file_ori_en VARCHAR(255) DEFAULT NULL,
    file_name_zh VARCHAR(255) DEFAULT NULL,
    file_ori_zh VARCHAR(255) DEFAULT NULL,
    view_count INT NOT NULL DEFAULT 0,
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
if (!mysqli_query($conn, $create_notice_table_sql)) {
    echo "에러 발생: " . mysqli_error($conn);
    exit;
}

// 2. 파라미터 수집
$mode = $_REQUEST['mode'] ?? '';
$idx = mysqli_real_escape_string($conn, $_REQUEST['idx'] ?? '');

// 중요 공지 체크박스 처리 (체크 안 하면 N, 체크하면 Y)
$is_notice = isset($_POST['is_notice']) && $_POST['is_notice'] == 'Y' ? 'Y' : 'N';

// 텍스트 데이터 수집 (제목 및 본문 다국어)
$n_title_ko = mysqli_real_escape_string($conn, $_POST['n_title_ko'] ?? '');
$n_title_en = mysqli_real_escape_string($conn, $_POST['n_title_en'] ?? '');
$n_title_zh = mysqli_real_escape_string($conn, $_POST['n_title_zh'] ?? '');

$n_content_ko = mysqli_real_escape_string($conn, $_POST['n_content_ko'] ?? '');
$n_content_en = mysqli_real_escape_string($conn, $_POST['n_content_en'] ?? '');
$n_content_zh = mysqli_real_escape_string($conn, $_POST['n_content_zh'] ?? '');

// 파일 업로드 경로 설정
$upload_dir = $_SERVER['DOCUMENT_ROOT'] . "/upload/notice/";
if(!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

// 3. 등록(insert) 및 수정(update) 처리
if ($mode == 'insert' || $mode == 'update') {
    
    $langs = ['ko', 'en', 'zh'];
    $file_sql_parts = []; // 수정 시 파일 업데이트용 쿼리 조각들
    $file_vars = []; // 등록 시 사용할 파일명 변수들

    foreach ($langs as $lang) {
        $input_name = "upfile_" . $lang;
        $new_name = "";
        $ori_name = "";

        // 파일이 업로드 되었는지 확인
        if (isset($_FILES[$input_name]) && $_FILES[$input_name]['name']) {
            
            // [수정 모드] 기존 파일이 있다면 서버에서 삭제
            if ($mode == 'update' && !empty($idx)) {
                $prev_res = mysqli_query($conn, "SELECT file_name_$lang FROM notice WHERE idx = '$idx'");
                $prev_row = mysqli_fetch_assoc($prev_res);
                if ($prev_row["file_name_$lang"]) {
                    @unlink($upload_dir . $prev_row["file_name_$lang"]);
                }
            }

            $ori_name = mysqli_real_escape_string($conn, $_FILES[$input_name]['name']);
            $ext = pathinfo($ori_name, PATHINFO_EXTENSION);
            $new_name = time() . "_notice_" . $lang . "_" . rand(1000, 9999) . "." . $ext;
            
            if (move_uploaded_file($_FILES[$input_name]['tmp_name'], $upload_dir . $new_name)) {
                $file_sql_parts[] = "file_name_$lang = '$new_name'";
                $file_sql_parts[] = "file_ori_$lang = '$ori_name'";
                $file_vars[$lang] = ['new' => $new_name, 'ori' => $ori_name];
            }
        } else {
            $file_vars[$lang] = ['new' => '', 'ori' => ''];
        }
    }

    if ($mode == 'insert') {
        // --- 데이터 등록 ---
        $sql = "INSERT INTO notice (
                    is_notice,
                    n_title_ko, n_title_en, n_title_zh, 
                    n_content_ko, n_content_en, n_content_zh, 
                    file_name_ko, file_ori_ko, 
                    file_name_en, file_ori_en, 
                    file_name_zh, file_ori_zh, 
                    reg_date
                ) VALUES (
                    '$is_notice',
                    '$n_title_ko', '$n_title_en', '$n_title_zh', 
                    '$n_content_ko', '$n_content_en', '$n_content_zh', 
                    '{$file_vars['ko']['new']}', '{$file_vars['ko']['ori']}',
                    '{$file_vars['en']['new']}', '{$file_vars['en']['ori']}',
                    '{$file_vars['zh']['new']}', '{$file_vars['zh']['ori']}',
                    NOW()
                )";
        $msg = "공지사항이 등록되었습니다.";

    } else if ($mode == 'update') {
        // --- 데이터 수정 ---
        $file_update_sql = "";
        if (!empty($file_sql_parts)) {
            $file_update_sql = ", " . implode(", ", $file_sql_parts);
        }

        $sql = "UPDATE notice SET 
                    is_notice = '$is_notice',
                    n_title_ko = '$n_title_ko', 
                    n_title_en = '$n_title_en', 
                    n_title_zh = '$n_title_zh',
                    n_content_ko = '$n_content_ko', 
                    n_content_en = '$n_content_en', 
                    n_content_zh = '$n_content_zh'
                    $file_update_sql 
                WHERE idx = '$idx'";
        $msg = "공지사항이 수정되었습니다.";
    }

} else if ($mode == 'delete') {
    // --- 데이터 삭제 ---
    if (empty($idx)) {
        echo "<script>alert('삭제할 데이터가 지정되지 않았습니다.'); history.back();</script>";
        exit;
    }

    // 서버의 모든 언어별 파일 삭제
    $res = mysqli_query($conn, "SELECT file_name_ko, file_name_en, file_name_zh FROM notice WHERE idx = '$idx'");
    $row = mysqli_fetch_assoc($res);
    
    if($row) {
        if($row['file_name_ko']) @unlink($upload_dir . $row['file_name_ko']);
        if($row['file_name_en']) @unlink($upload_dir . $row['file_name_en']);
        if($row['file_name_zh']) @unlink($upload_dir . $row['file_name_zh']);
    }

    $sql = "DELETE FROM notice WHERE idx = '$idx'";
    $msg = "공지사항이 삭제되었습니다.";

} else {
    echo "<script>alert('잘못된 접근입니다.'); location.href='notice_manage.php';</script>";
    exit;
}

// 4. 실행 및 리다이렉트
if (mysqli_query($conn, $sql)) {
    echo "<script>
            alert('$msg');
            location.href = 'notice_manage.php';
          </script>";
} else {
    echo "에러 발생: " . mysqli_error($conn);
}

mysqli_close($conn);
?>