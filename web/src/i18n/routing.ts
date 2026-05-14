import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'en', 'zh'],
  defaultLocale: 'ko',
  // ko has no prefix (`/`), en/zh use `/en`, `/zh`
  localePrefix: 'as-needed',
});
