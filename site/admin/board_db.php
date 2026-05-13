<?php
// 1. 보안 체크 및 DB 연결
include_once 'admin_check.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

// board 테이블이 없으면 자동 생성
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
    echo "에러 발생: " . mysqli_error($conn);
    exit;
}

// 자료 유형 컬럼 보정
$asset_kind_col = mysqli_query($conn, "SHOW COLUMNS FROM board LIKE 'asset_kind'");
if (!$asset_kind_col || mysqli_num_rows($asset_kind_col) === 0) {
    @mysqli_query($conn, "ALTER TABLE board ADD COLUMN asset_kind VARCHAR(20) NULL AFTER b_content_zh");
}

// 2. 파라미터 수집
$mode = $_REQUEST['mode'] ?? '';
$idx = mysqli_real_escape_string($conn, $_REQUEST['idx'] ?? '');

// 텍스트 데이터 수집 (제목 및 본문 다국어)
$b_title_ko = mysqli_real_escape_string($conn, $_POST['b_title_ko'] ?? '');
$b_title_en = mysqli_real_escape_string($conn, $_POST['b_title_en'] ?? '');
$b_title_zh = mysqli_real_escape_string($conn, $_POST['b_title_zh'] ?? '');

$b_content_ko = mysqli_real_escape_string($conn, $_POST['b_content_ko'] ?? '');
$b_content_en = mysqli_real_escape_string($conn, $_POST['b_content_en'] ?? '');
$b_content_zh = mysqli_real_escape_string($conn, $_POST['b_content_zh'] ?? '');
$asset_kind_raw = $_POST['asset_kind'] ?? '';
$allowed_kinds = ['brochure', 'catalog', 'ci_logo'];
$asset_kind = in_array($asset_kind_raw, $allowed_kinds, true) ? $asset_kind_raw : 'brochure';

// 입력폼 단순화를 위해 제목/내용은 자료 유형 기준 기본값으로 자동 보정
$kind_titles = [
    'brochure' => ['ko' => '회사소개서', 'en' => 'Company Brochure', 'zh' => '公司介绍'],
    'catalog' => ['ko' => 'E-카탈로그', 'en' => 'E-Catalog', 'zh' => '电子目录'],
    'ci_logo' => ['ko' => 'CI로고', 'en' => 'CI Logo', 'zh' => 'CI 标志'],
];
$kind_descs = [
    'brochure' => ['ko' => '회사소개서 다운로드 자료', 'en' => 'Company brochure download file', 'zh' => '公司介绍下载资料'],
    'catalog' => ['ko' => '카탈로그 다운로드 자료', 'en' => 'Catalog download file', 'zh' => '产品目录下载资料'],
    'ci_logo' => ['ko' => 'CI 로고 다운로드 자료', 'en' => 'CI logo download file', 'zh' => 'CI标志下载资料'],
];

if (trim($b_title_ko) === '') $b_title_ko = mysqli_real_escape_string($conn, $kind_titles[$asset_kind]['ko']);
if (trim($b_title_en) === '') $b_title_en = mysqli_real_escape_string($conn, $kind_titles[$asset_kind]['en']);
if (trim($b_title_zh) === '') $b_title_zh = mysqli_real_escape_string($conn, $kind_titles[$asset_kind]['zh']);
if (trim($b_content_ko) === '') $b_content_ko = mysqli_real_escape_string($conn, $kind_descs[$asset_kind]['ko']);
if (trim($b_content_en) === '') $b_content_en = mysqli_real_escape_string($conn, $kind_descs[$asset_kind]['en']);
if (trim($b_content_zh) === '') $b_content_zh = mysqli_real_escape_string($conn, $kind_descs[$asset_kind]['zh']);

// 파일 업로드 경로 설정
$upload_dir = $_SERVER['DOCUMENT_ROOT'] . "/upload/board/";
if(!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

// 3. 등록(insert) 및 수정(update) 처리
if ($mode == 'insert' || $mode == 'update') {
    
    $langs = ['ko', 'en', 'zh'];
    $file_data = []; // 쿼리에 사용할 파일 정보 저장용
    
    foreach ($langs as $lang) {
        $input_name = "upfile_" . $lang;
        $file_data[$lang] = ['new' => '', 'ori' => ''];

        // 파일이 업로드 되었는지 확인
        if (isset($_FILES[$input_name]) && $_FILES[$input_name]['name']) {
            
            // 수정 모드일 경우 해당 언어의 기존 파일만 삭제
            if ($mode == 'update' && !empty($idx)) {
                $prev_res = mysqli_query($conn, "SELECT file_name_$lang FROM board WHERE idx = '$idx'");
                $prev_row = mysqli_fetch_assoc($prev_res);
                if ($prev_row["file_name_$lang"]) {
                    @unlink($upload_dir . $prev_row["file_name_$lang"]);
                }
            }

            $ori_name = mysqli_real_escape_string($conn, $_FILES[$input_name]['name']);
            $ext = pathinfo($ori_name, PATHINFO_EXTENSION);
            $new_name = time() . "_" . $lang . "_" . rand(1000, 9999) . "." . $ext;
            
            if (move_uploaded_file($_FILES[$input_name]['tmp_name'], $upload_dir . $new_name)) {
                $file_data[$lang]['new'] = $new_name;
                $file_data[$lang]['ori'] = $ori_name;
            }
        }
    }

    // 유형별 필수 슬롯 검증
    $existing = ['ko' => '', 'en' => '', 'zh' => ''];
    if ($mode === 'update' && !empty($idx)) {
        $ex_res = mysqli_query($conn, "SELECT file_name_ko, file_name_en, file_name_zh FROM board WHERE idx = '$idx'");
        if ($ex_res) {
            $ex_row = mysqli_fetch_assoc($ex_res);
            if ($ex_row) {
                $existing['ko'] = $ex_row['file_name_ko'] ?? '';
                $existing['en'] = $ex_row['file_name_en'] ?? '';
                $existing['zh'] = $ex_row['file_name_zh'] ?? '';
            }
        }
    }

    $has_slot = [
        'ko' => !empty($file_data['ko']['new']) || !empty($existing['ko']),
        'en' => !empty($file_data['en']['new']) || !empty($existing['en']),
        'zh' => !empty($file_data['zh']['new']) || !empty($existing['zh']),
    ];

    $missing = [];
    if ($asset_kind === 'brochure') {
        if (!$has_slot['ko']) $missing[] = '국문(A)';
        if (!$has_slot['zh']) $missing[] = '중문(C)';
    } elseif ($asset_kind === 'catalog') {
        if (!$has_slot['ko']) $missing[] = '국문(A)';
    } elseif ($asset_kind === 'ci_logo') {
        if (!$has_slot['ko']) $missing[] = 'AI(A)';
        if (!$has_slot['en']) $missing[] = 'PNG(B)';
    }

    if (!empty($missing)) {
        $missing_text = implode(', ', $missing);
        echo "<script>alert('필수 첨부파일이 누락되었습니다: {$missing_text}'); history.back();</script>";
        exit;
    }

    if ($mode == 'insert') {
        // --- 데이터 등록 ---
        $sql = "INSERT INTO board (
                    b_title_ko, b_title_en, b_title_zh, 
                    b_content_ko, b_content_en, b_content_zh, 
                    asset_kind,
                    file_name_ko, file_ori_ko, 
                    file_name_en, file_ori_en, 
                    file_name_zh, file_ori_zh, 
                    reg_date
                ) VALUES (
                    '$b_title_ko', '$b_title_en', '$b_title_zh', 
                    '$b_content_ko', '$b_content_en', '$b_content_zh', 
                    '$asset_kind',
                    '{$file_data['ko']['new']}', '{$file_data['ko']['ori']}',
                    '{$file_data['en']['new']}', '{$file_data['en']['ori']}',
                    '{$file_data['zh']['new']}', '{$file_data['zh']['ori']}',
                    NOW()
                )";
        $msg = "자료가 성공적으로 등록되었습니다.";

    } else if ($mode == 'update') {
        // --- 데이터 수정 (파일이 새로 올라온 것만 업데이트 구문에 추가) ---
        $file_update_sql = "";
        foreach ($langs as $lang) {
            if ($file_data[$lang]['new']) {
                $file_update_sql .= ", file_name_$lang = '{$file_data[$lang]['new']}', file_ori_$lang = '{$file_data[$lang]['ori']}'";
            }
        }

        $sql = "UPDATE board SET 
                    b_title_ko = '$b_title_ko', 
                    b_title_en = '$b_title_en', 
                    b_title_zh = '$b_title_zh',
                    b_content_ko = '$b_content_ko', 
                    b_content_en = '$b_content_en', 
                    b_content_zh = '$b_content_zh',
                    asset_kind = '$asset_kind'
                    $file_update_sql 
                WHERE idx = '$idx'";
        $msg = "자료가 성공적으로 수정되었습니다.";
    }

} else if ($mode == 'delete') {
    // --- 데이터 삭제 (모든 언어의 파일 삭제) ---
    if (empty($idx)) {
        echo "<script>alert('삭제할 데이터가 지정되지 않았습니다.'); history.back();</script>";
        exit;
    }

    $res = mysqli_query($conn, "SELECT file_name_ko, file_name_en, file_name_zh FROM board WHERE idx = '$idx'");
    $row = mysqli_fetch_assoc($res);
    
    if($row) {
        if($row['file_name_ko']) @unlink($upload_dir . $row['file_name_ko']);
        if($row['file_name_en']) @unlink($upload_dir . $row['file_name_en']);
        if($row['file_name_zh']) @unlink($upload_dir . $row['file_name_zh']);
    }

    $sql = "DELETE FROM board WHERE idx = '$idx'";
    $msg = "자료가 삭제되었습니다.";

} else {
    echo "<script>alert('잘못된 접근입니다.'); location.href='board_manage.php';</script>";
    exit;
}

// 4. 쿼리 실행 및 결과 보고
if (mysqli_query($conn, $sql)) {
    echo "<script>
            alert('$msg');
            location.href = 'board_manage.php';
          </script>";
} else {
    echo "에러 발생: " . mysqli_error($conn);
}

mysqli_close($conn);
?>