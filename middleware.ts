import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const SOCIAL_BOTS = /TelegramBot|Twitterbot|facebookexternalhit|WhatsApp|LinkedInBot|Discordbot|Slackbot/i;

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Social media scrapers (Telegram, WhatsApp, etc.) often fail to follow 307 redirects.
    // Rewrite root '/' to localized page directly so they receive HTTP 200 with full Open Graph tags.
    if (pathname === '/') {
        const userAgent = request.headers.get('user-agent') || '';
        if (SOCIAL_BOTS.test(userAgent)) {
            const acceptLang = request.headers.get('accept-language') || '';
            const locale = acceptLang.toLowerCase().includes('en') && !acceptLang.toLowerCase().startsWith('ar') ? 'en' : 'ar';
            return NextResponse.rewrite(new URL(`/${locale}`, request.url));
        }
    }

    return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for
    // - API routes
    // - Next.js internals (_next)
    // - static files (anything with a dot, e.g. favicon.ico, images, videos)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

