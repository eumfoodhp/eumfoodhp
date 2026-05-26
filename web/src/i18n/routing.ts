import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'zh'],  /* EN 옵션 제거 (요청) — en.json 파일은 보존 */
  defaultLocale: 'ko',
  // ko has no prefix (`/`), en/zh use `/en`, `/zh`
  localePrefix: 'as-needed',
});
