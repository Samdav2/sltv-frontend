import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map();

interface RateLimitConfig {
    windowMs: number;
    max: number;
}

const RATELIMIT_CONFIGS: Record<string, RateLimitConfig> = {
    default: { windowMs: 60 * 1000, max: 200 },
    auth: { windowMs: 60 * 1000, max: 100 },
};

export function middleware(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const path = request.nextUrl.pathname;

    // 1. Rate Limiting Strategy
    let config = RATELIMIT_CONFIGS.default;
    if (path.includes('/login') || path.includes('/register') || path.includes('/admin')) {
        config = RATELIMIT_CONFIGS.auth;
    }

    const now = Date.now();
    const windowStart = now - config.windowMs;

    const requestLog = rateLimit.get(ip) || [];
    const requestsInWindow = requestLog.filter((timestamp: number) => timestamp > windowStart);

    if (requestsInWindow.length >= config.max) {
        return new NextResponse(
            JSON.stringify({ error: 'Too many requests. Please try again later.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
    }

    requestsInWindow.push(now);
    rateLimit.set(ip, requestsInWindow);

    const response = NextResponse.next();
    const headers = response.headers;

    headers.set('X-Frame-Options', 'DENY');

    headers.set('X-Content-Type-Options', 'nosniff');

    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()'
    );



    return response;
}

export const config = {
    matcher: [

        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
