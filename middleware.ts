import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

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

// Only run the middleware on paths that might be streaming service paths
export const config = {
    matcher: [
        '/title/:path*',
        '/watch/:path*',
        '/detail/:path*',
        '/movie/:path*',
        '/movies/:path*',
        '/tv/:path*',
        '/series/:path*',
    ],
}; 