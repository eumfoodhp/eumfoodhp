<?php
// inc/download.php
$file_name = $_GET['file'] ?? '';
$ori_name = $_GET['ori'] ?? 'download_file';

$file_path = $_SERVER['DOCUMENT_ROOT'] . "/upload/board/" . $file_name;

if (file_exists($file_path)) {
    // 파일명에 포함된 특수문자나 공백 처리
    $dn_name = urlencode($ori_name);
    
    header("Content-Type: application/octet-stream");
    header("Content-Disposition: attachment; filename=\"$ori_name\"");
    header("Content-Transfer-Encoding: binary");
    header("Content-Length: " . filesize($file_path));
    header("Cache-Control: cache, must-revalidate");
    header("Pragma: no-cache");
    header("Expires: 0");

    readfile($file_path);
    exit;
} else {
    echo "<script>alert('파일을 찾을 수 없습니다.'); history.back();</script>";
}
?>