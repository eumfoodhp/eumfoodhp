# eumfood

이음푸드(주) 웹사이트 — 개인 관리용 리포지토리.

## 현재 상태

- `site/` — 카페24에서 받아온 기존 PHP 코드 (참고용/레거시)
- DB 덤프(`eumfood1.sql`)는 git에서 제외 (덤프 후 로컬에만 보관)
- 새 스택: **Next.js + Vercel** (이전 진행 예정)

## 디렉터리

```
site/                     기존 PHP 사이트
├── config.php            세션·언어 로딩
├── header.php / footer.php
├── index.php             메인
├── inc/
│   ├── db_conn.php       (gitignored — 실제 자격증명)
│   └── db_conn.example.php  (템플릿)
├── pages/                개별 페이지(30여 개)
├── admin/                관리자 CRUD (board / notice / press / history / contact / contact_sales)
├── lang/                 ko·en·zh 카피 (PHP 배열)
├── css/, js/, images/
├── data/                 catalogue.pdf 등
└── upload/               (gitignored — 사용자 업로드)
```

## 로컬 PHP 실행 (참고용)

기존 사이트를 로컬에서 띄울 일이 있을 때:

1. `cp site/inc/db_conn.example.php site/inc/db_conn.php`
2. 환경변수 `DB_HOST/DB_USER/DB_PASS/DB_NAME` 설정
3. `php -S localhost:8000 -t site/`

## 다음 단계

1. DB 덤프 받기 (phpMyAdmin에서 export → `eumfood1.sql` 로컬 저장)
2. Next.js 프로젝트 스캐폴드 (root에 신규)
3. 정적 페이지부터 포팅 (about / business / products / process)
4. 동적 부분(notice / board / press / contact) — Vercel + Neon/Supabase 또는 Prisma
5. Vercel 배포 + 도메인 연결
