import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for
    // - API routes
    // - Next.js internals (_next)
    // - static files (anything with a dot, e.g. favicon.ico, images, videos)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
