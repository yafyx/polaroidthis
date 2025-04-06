import { type NextRequest, NextResponse } from "next/server";

// Function to extract title from streaming service URLs
function extractTitleFromUrl(url: string): {
    title: string | null,
    service: string | null
} {
    let title = null;
    let service = null;

    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        const pathname = urlObj.pathname;

        // Extract streaming service
        if (hostname.includes('netflix')) {
            service = 'Netflix';
            // Netflix URLs: netflix.com/id-en/title/81922333 or netflix.com/title/81922333
            const titleMatch = pathname.match(/\/title\/(\d+)/);
            if (titleMatch && titleMatch[1]) {
                // Use the Netflix ID as title for further processing
                title = titleMatch[1];
            }
        } else if (hostname.includes('amazon') || hostname.includes('primevideo')) {
            service = 'Amazon Prime';
            // Amazon Prime URLs: primevideo.com/detail/0SSV1CIYHPUKDFUE5JOYRDKF06
            if (pathname.includes('/detail/')) {
                // Extract the ID directly from the last part of the path
                const pathParts = pathname.split('/');
                title = pathParts[pathParts.length - 1];
            }
        } else if (hostname.includes('hulu')) {
            service = 'Hulu';
            // Hulu URLs: hulu.com/movie/title-12345
            title = urlObj.pathname.split('/').pop() || null;
        } else if (hostname.includes('disney')) {
            service = 'Disney+';
            // Disney+ URLs: disneyplus.com/movies/title/12345
            const pathParts = urlObj.pathname.split('/');
            if (pathParts.length > 2) {
                title = pathParts[pathParts.length - 2];
            }
        } else if (hostname.includes('hbomax') || hostname.includes('max.com')) {
            service = 'Max';
            // HBO Max URLs: play.max.com/movie/12345
            title = urlObj.pathname.split('/').pop() || null;
        } else if (hostname.includes('apple') || hostname.includes('tv.apple')) {
            service = 'Apple TV+';
            // Apple TV+ URLs: tv.apple.com/movie/title/id12345
            const pathParts = urlObj.pathname.split('/');
            if (pathParts.length > 2) {
                title = pathParts[pathParts.length - 2];
            }
        }

    } catch (error) {
        console.error("URL parsing error:", error);
    }

    return { title, service };
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json({ message: "URL parameter is required" }, { status: 400 });
        }

        // Extract information from URL
        const { title, service } = extractTitleFromUrl(url);

        if (!title) {
            return NextResponse.json({
                message: "Could not extract title from the provided URL",
                success: false
            }, { status: 400 });
        }

        return NextResponse.json({
            title,
            service,
            success: true
        });
    } catch (error) {
        console.error("URL extraction error:", error);
        return NextResponse.json({
            message: "Failed to process the URL",
            success: false
        }, { status: 500 });
    }
} 