# 이음푸드 사이트 작업 컨텍스트

**새 세션 시작 시 [`HANDOVER.md`](./HANDOVER.md) 를 먼저 읽어주세요.**

거기에 인프라/배포/기술스택/페이지 포팅 상태/보류 작업/사용자 톤/함정 등
전체 컨텍스트가 정리돼 있습니다.

## 빠른 참조

- **푸시 전 GitHub 계정 전환 필수**:
  ```bash
  "C:/Program Files/GitHub CLI/gh.exe" auth switch -u eumfoodhp
  ```
- **배포**: GitHub push → Vercel 자동
- **확인**: https://eumfoodhp.vercel.app/ (Ctrl+Shift+R 하드 리프레시)
- **UI 커스텀은 거의 다**: `web/src/styles/buttons-override.css`
