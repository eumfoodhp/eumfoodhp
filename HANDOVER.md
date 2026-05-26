# 이음푸드 사이트 작업 인계

> 새 Claude 세션 시작할 때 이 파일을 먼저 읽으면 컨텍스트 인수 완료.
> 마지막 업데이트: 2026-05-26

## 한 줄 요약
가족이 운영하는 이음푸드(주) 회사 홈페이지를 PHP → Next.js로 마이그레이션 진행 중. 본인이 개인 GitHub/Vercel에서 관리하고 가족은 티제이웹 호스팅 그대로 유지.

---

## 인프라

| 항목 | 값 |
|---|---|
| 로컬 폴더 | `C:\Users\dev\Downloads\ceworkspaces\eumfood` |
| GitHub | `eumfoodhp/eumfoodhp` (Public) |
| Vercel | https://eumfoodhp.vercel.app/ (Hobby 무료, GitHub 연동 자동 배포) |
| Figma | https://www.figma.com/design/kBGWJsLDzRy8B6h68X9zX0/이음푸드 |
| 원본 호스팅 | **티제이웹(JTweb)** 정액형 (가족 결제 중) |
| 원본 도메인 | eumfood.com (티제이웹 관리) |
| FTP | eumfood.com / eumfood1 / adm508749 (채팅 노출됨 — 비번 변경 권장) |

⚠️ `site/inc/db_conn.php` 주석에 "카페24"라고 적혀있는데 그건 옛날에 카페24에서 만들어서 옮긴 흔적. **현재 호스팅은 티제이웹**.

⚠️ DB는 외부 phpMyAdmin 차단 + FTP quota full + IP whitelist로 접속 못 함. 가족분께 티제이웹 호스팅 관리자 로그인 받아야 백업 가능.

---

## 기술 스택 (web/ 디렉토리)

- Next.js 16.2.6 (App Router, Turbopack)
- React 19.2.4
- TypeScript
- next-intl 4.12 (ko/zh, en 제거됨)
- Swiper 11 (메인 hero)

원본 CSS는 `src/styles/`로 옮겨 `import`. `src/styles/buttons-override.css` 한 파일에 모든 UI 커스텀이 집중돼 있음.

---

## 디렉토리 구조

```
eumfood/
├─ site/                          # 원본 PHP (FTP에서 다운로드, 참조용)
├─ web/                           # Next.js 프로젝트 (배포 대상)
│  ├─ src/
│  │  ├─ app/[locale]/            # 페이지들
│  │  ├─ components/              # Header, Footer, QuickMenu, SubVisual,
│  │  │                             SubTabBar, LanguageSwitcher, HeroSwiper,
│  │  │                             StubBody
│  │  ├─ i18n/
│  │  │  ├─ routing.ts            # locales: ['ko','zh']
│  │  │  ├─ messages/ko.json
│  │  │  ├─ messages/zh.json
│  │  │  └─ messages/en.json      # 보존만 (참조 안 됨)
│  │  └─ styles/
│  │     ├─ common.css
│  │     ├─ main.css
│  │     ├─ sub.css
│  │     ├─ buttons-override.css  # ⭐ UI 커스텀 거의 다 여기
│  │     └─ ...
│  └─ public/images, /js, /data
└─ HANDOVER.md                    # 이 파일
```

---

## 페이지 포팅 상태

### ✅ 실제 콘텐츠 포팅 완료
- 메인 (`/`)
- About 5개 (greeting / history / cert / organization / location)
- Business 2개 (area / facility)
- Products 6개 (pickles 18종, braised 9, namul 4, salted 3, sauce 28/4섹션, tea 5)
- Process 4개 (pickles 7단계, braised 5, salted 5, sauce 4)

### 🟡 Stub (SubVisual + 탭바만 진짜, 본문은 "준비중")
- business/process
- products/mealkit, process/mealkit
- notice / notice/[id]
- press / press/[id]
- download / download/[id]
- contact / contact/[id] / contact/write / contact/sales

---

## 현재 UI 디자인 (전부 `buttons-override.css`)

- **헤더**: 1580px max 라운드 카드, `position: relative` (스크롤 따라가지 않음), 위 16px 여백 + 마진 24px
- **헤더 배경**: radial-gradient 11개 블롭 마블링 (오렌지/그린/라임/살구/머스타드/핑크/라벤더 등 옅게)
- **헤더 검은 테두리 제거**, 그림자만
- **헤더 grid**: `auto 1fr auto`, column-gap 24px (로고 - GNB - 우측버튼)
- **1024px↓**: `display: flex; justify-content: space-between`로 강제 전환 (grid 해제 — 우측 버튼이 가운데로 밀리는 버그 해결)
- **GNB 호버**: 메뉴별 개별 카드 드롭다운 (mega panel 풀폭 제거, 각 컬럼이 독립 카드)
- **우측 3개 버튼** (문의/언어/메뉴): 모두 SVG 인라인 아이콘, 주황 채움 정사각 40×40
- **퀵메뉴** (자사몰/고객문의/카탈로그/↑): 우측 하단 fixed 가로 배치, 원형 카드 + 옅은 테두리
- **서브탭바**: 배너 이미지 안에서 → 아래로 분리 (`--below` 모디파이어, 옅은 회색 배경 + 다크 텍스트)
- **서브페이지 상단**: 가로 한 줄로 압축 (브레드크럼 좌 / 제목+설명 우)
- **오시는 길 카드**: 라운드 박스. 모바일에서 지도 우측 50%만 노출 (opacity 0.55 + 좌측 mask 페이드 → 한반도 윤곽만 자연스럽게)

---

## 최근 수정된 콘텐츠

| 항목 | 변경 |
|---|---|
| 자사몰 URL | `smartstore.naver.com/Eumfood/` → `smartstore.naver.com/eumfood` |
| 인증서 #2 | "조림 HACCP" → "조림류 HACCP" |
| 연구개발팀 전화 | `070-4334-5885` → `070-7733-5887` (ko/en/zh 모두) |
| 중국어 ft_ceo | `董事长 五福` → `董事长 黄万植` |
| 영어(EN) 옵션 | 삭제 (locales: ['ko','zh']) |
| 시설현황 desc | `<br>` literal 노출 → `dangerouslySetInnerHTML`로 진짜 줄바꿈 |
| 시설 카드 | 너무 컸음 → 4열 그리드 + 이미지 4:3 + 폰트 축소 |

---

## ⏳ 보류 작업 (6건)

1. **영업문의(`/contact/sales`) 폼 실제 구현** — Resend/SendGrid 키 필요
2. **다운로드(`/download`) 페이지 구현** — 자료 PDF + 카드 디자인 결정 필요
3. **공지사항(`/notice`) hero 이미지** 교체 — "회의/박수" 사진 파일 필요
4. **1:1·영업문의 hero 이미지** 교체 — "노트북" 사진 파일 필요
5. **공장 사진 `(추)→㈜`** — 이미지 안에 박힌 텍스트. 수정된 이미지 파일 필요 (코드로 안 됨)
6. **티제이웹 호스팅 관리자 로그인 받기** (가족 보유) — DB 백업 + 도메인 DNS 변경(eumfood.com → Vercel)에 필요

### DB 미연결 영향
- 공지사항 / 보도자료 / 다운로드 글 목록: 빈 상태
- 1:1문의 / 영업문의 게시판: 빈 상태
- 메인 페이지 공지 섹션: "준비중" placeholder 3개

---

## ⚠️ 계정 충돌 주의 (중요)

같은 머신에서 **다른 Claude 세션들이 다른 GitHub 계정**으로 작업 중. `gh` CLI active 계정이 자주 바뀜 (`dlab22`, `bldh2026`, `hyseop` 등으로 자동 전환됨).

**푸시 직전 반드시 실행**:
```bash
"C:/Program Files/GitHub CLI/gh.exe" auth switch -u eumfoodhp
```

SSH 키 분리 셋업은 보류됨 (사용자가 "그냥 매번 전환"으로 결정).

---

## 사용자 톤·스타일

- 한국어, 짧고 직접적
- 빙빙 돌리거나 추측하면 짜증냄 — **코드 직접 까서 답할 것**
- 디자인 요청 시 시각적 결과물 (스크린샷) 기대
- "ㄱ자" 같은 한글 모양 비유 잘 씀
- 자주 화면 캡처해서 화살표 그려가며 변경 요청

---

## 작업 흐름

1. 사용자 요청 → 코드 수정
2. `git add` + `git commit`
3. `gh auth switch -u eumfoodhp` (계정 확인)
4. `git push`
5. Vercel 자동 배포 (1~2분)
6. 사용자가 https://eumfoodhp.vercel.app/ 에서 **Ctrl+Shift+R** (하드 리프레시)로 확인

---

## 빌드 / 타입체크

```bash
cd web
npx tsc --noEmit         # 타입 체크
npm run dev              # 로컬 dev 서버 :3000
```

---

## ⚠️ 알려진 함정 (반드시 알아둘 것)

1. **React 19에서 `<link rel="stylesheet">` 직접 쓰면 preload만 됨** → CSS는 항상 `import`로 (또는 `precedence` 속성 필요). 페이지마다 `import '@/styles/X.css'` 패턴 사용 중.

2. **Next.js `<Script strategy="afterInteractive">`는 DOMContentLoaded 이후 로드**됨 → `document.addEventListener('DOMContentLoaded', ...)` 절대 안 불림. `web/public/js/main.js` 맨 위에 polyfill 추가해서 우회. 새 inline 스크립트 작성 시 같은 패턴 써야 함:
   ```js
   if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __init);
   else __init();
   ```

3. **common.js의 legacy `?lang=xx` 핸들러는 제거함** — next-intl Link 클릭을 가로채서 `?lang=undefined`로 리다이렉트하던 버그였음.

4. **헤더 grid는 1024px↓에서 무조건 flex로 전환** — 그래야 GNB 숨겨졌을 때 util_area가 가운데로 떨어지지 않음.

5. **다른 Claude 세션 영향**: 위 계정 충돌 외에도, 같은 폴더 동시 작업 시 git pull 필요할 수 있음.

---

## Figma MCP

- 데스크탑 앱 + Dev Mode MCP Server 활성화 상태에서 동작
- HTTP MCP, `http://127.0.0.1:3845/mcp` 엔드포인트
- 같은 머신의 다른 Claude 세션은 잘 잡힘
- **이전 세션이 stale 상태로 막혔던 적 있음** — 새 세션은 잡힐 것
- 잘 안 잡히면: Figma 데스크탑 → Preferences → Dev Mode MCP Server 토글 확인, Figma 재시작, Claude Code 재시작 순으로 시도
