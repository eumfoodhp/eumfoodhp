import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export const proxy = createMiddleware(routing);
export default proxy;

export const config = {
  // Skip Next internals, static files, API routes, and /admin (별도 라우트)
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};
