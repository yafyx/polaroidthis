import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // Check if the pathname starts with /http: or /https:
    if (pathname.startsWith('/http:') || pathname.startsWith('/https:')) {
        // Extract the URL (remove the leading '/')
        const originalUrl = pathname.substring(1) + search;
        const encodedUrl = encodeURIComponent(originalUrl);
        // Redirect to the create page
        return NextResponse.redirect(new URL(`/create?url=${encodedUrl}`, request.url));
    }

    // If this is already on our domain, we're not in redirection mode
    if (request.headers.has('x-forwarded-host')) {
        const host = request.headers.get('x-forwarded-host') || '';
        if (host.includes('polaroidthis')) {
            return NextResponse.next();
        }
    }

    // Check if the URL path might be a streaming service path
    if (
        // Netflix patterns
        pathname.match(/\/title\/\d+/) ||
        pathname.match(/\/watch\/\d+/) ||
        // Prime Video patterns
        pathname.includes('/detail/') ||
        // Other streaming services
        pathname.includes('/movie/') ||
        pathname.includes('/movies/') ||
        pathname.includes('/tv/') ||
        pathname.includes('/series/')
    ) {
        // Extract the original URL without the "polaroidthis." prefix
        // We'll reconstruct this on the client side
        const encodedUrl = encodeURIComponent(pathname + search);

        // Redirect to our create page with the URL as a parameter
        return NextResponse.redirect(new URL(`/create?url=${encodedUrl}`, request.url));
    }

    return NextResponse.next();
} 