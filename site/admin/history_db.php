<?php
// 1. 보안 체크 및 DB 연결
include_once 'admin_check.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/inc/db_conn.php';

// history 테이블이 없으면 자동 생성
$create_history_table_sql = "CREATE TABLE IF NOT EXISTS history (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    h_year VARCHAR(10) NOT NULL,
    h_content TEXT NOT NULL,
    h_content_en TEXT DEFAULT NULL,
    h_content_zh TEXT DEFAULT NULL,
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
if (!mysqli_query($conn, $create_history_table_sql)) {
    echo "에러 발생: " . mysqli_error($conn);
    exit;
}

// 2. 파라미터 받기 (POST 또는 GET)
$mode = $_REQUEST['mode'] ?? ''; // insert, update, delete
$idx = $_REQUEST['idx'] ?? '';

// 다국어 데이터 모두 받기 및 보안 처리
$h_year = mysqli_real_escape_string($conn, $_POST['h_year'] ?? '');
$h_content = mysqli_real_escape_string($conn, $_POST['h_content'] ?? '');
$h_content_en = mysqli_real_escape_string($conn, $_POST['h_content_en'] ?? ''); // 추가
$h_content_zh = mysqli_real_escape_string($conn, $_POST['h_content_zh'] ?? ''); // 추가

// 3. 모드별 처리
if ($mode == 'insert') {
    // --- 데이터 등록 ---
    // 한국어는 필수값, 외국어는 선택사항으로 처리
    if (empty($h_year) || empty($h_content)) {
        echo "<script>alert('연도와 한국어 내용을 입력해주세요.'); history.back();</script>";
        exit;
    }

    // [수정] 다국어 컬럼 추가
    $sql = "INSERT INTO history (h_year, h_content, h_content_en, h_content_zh, reg_date) 
            VALUES ('$h_year', '$h_content', '$h_content_en', '$h_content_zh', NOW())";
    $msg = "새로운 다국어 연혁이 등록되었습니다.";

} else if ($mode == 'update') {
    // --- 데이터 수정 ---
    if (empty($idx) || empty($h_year) || empty($h_content)) {
        echo "<script>alert('수정할 데이터가 올바르지 않습니다.'); history.back();</script>";
        exit;
    }

    // [수정] 다국어 컬럼 업데이트 추가
    $sql = "UPDATE history SET 
                h_year = '$h_year', 
                h_content = '$h_content',
                h_content_en = '$h_content_en',
                h_content_zh = '$h_content_zh'
            WHERE idx = '$idx'";
    $msg = "연혁이 다국어로 수정되었습니다.";

} else if ($mode == 'delete') {
    // --- 데이터 삭제 ---
    if (empty($idx)) {
        echo "<script>alert('삭제할 데이터가 지정되지 않았습니다.'); history.back();</script>";
        exit;
    }

    $sql = "DELETE FROM history WHERE idx = '$idx'";
    $msg = "연혁이 삭제되었습니다.";

} else {
    // --- 예외 처리 ---
    echo "<script>alert('잘못된 접근입니다.'); location.href='history_manage.php';</script>";
    exit;
}

// 4. 쿼리 실행 및 결과 보고
if (mysqli_query($conn, $sql)) {
    echo "<script>
        alert('$msg');
        location.href = 'history_manage.php';
    </script>";
} else {
    // DB 에러 발생 시
    echo "에러 발생: " . mysqli_error($conn);
}

// 5. DB 연결 종료 (권장)
mysqli_close($conn);
?>