<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$root = $_SERVER['DOCUMENT_ROOT'];

if (!isset($_SESSION['lang'])) {
    $_SESSION['lang'] = 'ko';
}

if (isset($_GET['lang'])) {
    $allowed_langs = ['ko', 'en', 'zh'];
    if (in_array($_GET['lang'], $allowed_langs)) {
        $_SESSION['lang'] = $_GET['lang'];
    }
}

// 언어 파일 경로 설정
$lang_file = $root . '/lang/' . $_SESSION['lang'] . '.php';

// [중요 수정] $lang = include 방식은 파일 내부에 return [ ... ] 이 있을 때만 씁니다.
// 현재 우리는 $lang['키'] = 값; 방식을 쓰므로, 그냥 include만 해야 변수가 유지됩니다.
if (file_exists($lang_file)) {
    include_once $lang_file;
} else {
    include_once $root . '/lang/ko.php';
}

// 만약 위에서 로드했는데도 $lang이 정의되지 않았다면 에러 방지용 빈 배열 생성
if (!isset($lang) || !is_array($lang)) {
    $lang = [];
}

function get_url($path) {
    return '/' . ltrim($path, '/');
}

/**
 * /images/ 이하 파일의 브라우저용 URL (항상 사이트 루트 기준 절대경로).
 * ../images/ 상대경로는 주소·리라이트에 따라 엑박이 나기 쉬워 /images/... 로 통일합니다.
 *
 * @param string $under_images 'sub/pickles-01.png' — images/ 바로 아래부터 적습니다.
 */
function images_url($under_images) {
    $under_images = ltrim($under_images, '/');
    return '/images/' . $under_images;
}
?>