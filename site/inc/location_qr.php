<?php
/**
 * 오시는 길 — 티맵·카카오맵·네이버지도 웹 링크 및 QR 이미지 URL
 * QR 이미지: api.qrserver.com (외부 호출, 오프라인/차단 시 표시 안 됨)
 */

if (!function_exists('location_map_url_tmap')) {
    function location_map_url_tmap(string $address): string
    {
        return 'https://tmap.co.kr/tmap3/mobile/map.jsp?searchKeyword=' . rawurlencode($address);
    }

    function location_map_url_kakao(string $address): string
    {
        return 'https://map.kakao.com/link/search/' . rawurlencode($address);
    }

    function location_map_url_naver(string $address): string
    {
        return 'https://map.naver.com/v5/search/' . rawurlencode($address);
    }

    /** @param string $target_url 스캔 시 열릴 전체 URL */
    function location_qr_img_src(string $target_url): string
    {
        return 'https://api.qrserver.com/v1/create-qr-code/?size=136x136&ecc=M&margin=8&data=' . rawurlencode($target_url);
    }
}
