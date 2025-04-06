import * as cheerio from 'cheerio';
import { type NextRequest, NextResponse } from "next/server";

// Mock data removed - relying solely on scraping now

/**
 * Scrapes the title from a streaming service URL using fetch and cheerio.
 */
async function scrapeTitle(url: string): Promise<{ title: string | null; service: string | null }> {
    let service: string | null = null;

    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        const pathname = urlObj.pathname;

        // Determine service
        if (hostname.includes('netflix')) {
            service = 'Netflix';
        } else if (hostname.includes('amazon') || hostname.includes('primevideo')) {
            service = 'Amazon Prime';
        } else if (hostname.includes('hulu')) {
            service = 'Hulu';
        } else if (hostname.includes('disney')) {
            service = 'Disney+';
        } else if (hostname.includes('hbomax') || hostname.includes('max.com')) {
            service = 'Max';
        } else if (hostname.includes('apple') || hostname.includes('tv.apple')) {
            service = 'Apple TV+';
        }

        // Mock data check removed

        console.log(`Attempting to scrape title from: ${url}`);
        const response = await fetch(url, {
            headers: {
                // Mimic a browser User-Agent
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            },
            // Add timeout if needed
            // signal: AbortSignal.timeout(10000) // 10 seconds timeout
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        let extractedTitle: string | null = null;

        // --- Title Extraction Logic ---
        // Try common meta tags first, as they are often more reliable
        extractedTitle = $('meta[property="og:title"]').attr('content') || null;
        if (!extractedTitle) {
            extractedTitle = $('meta[name="twitter:title"]').attr('content') || null;
        }
        // Fallback to <title> tag
        if (!extractedTitle) {
            extractedTitle = $('title').first().text().trim() || null;
        }

        // --- Title Cleanup Logic ---
        if (extractedTitle) {
            console.log(`Raw extracted title: ${extractedTitle}`);
            // Remove common prefixes
            extractedTitle = extractedTitle.replace(/^(Watch|Stream|Ver)\s*/i, '');

            // Remove common suffixes related to the service name
            if (service) {
                // Create variations of the service name to check against
                const servicePatterns = [
                    `| ${service}`,
                    `- ${service}`,
                    `| Watch on ${service}`,
                    `| Stream on ${service}`,
                    `(${service})`,
                    `on ${service}`
                ];
                // Add lowercase variations just in case
                servicePatterns.push(...servicePatterns.map(p => p.toLowerCase()));

                let titleLower = extractedTitle.toLowerCase();
                for (const pattern of servicePatterns) {
                    // Check if the title ends with the pattern (case-insensitive check on lowercased title)
                    if (titleLower.endsWith(pattern.toLowerCase())) {
                        // Remove the pattern from the original title string
                        extractedTitle = extractedTitle.substring(0, extractedTitle.length - pattern.length).trim();
                        // Re-check lowercased title for next iteration if needed
                        titleLower = extractedTitle.toLowerCase();
                    }
                }
                // Final trim after potential removals
                extractedTitle = extractedTitle.replace(/[\s-|:]*$/, '').trim();
            }
            console.log(`Cleaned title: ${extractedTitle}`);
        }

        // Add specific selectors as fallbacks if meta tags fail
        if (!extractedTitle && service === 'Netflix') {
            // Example: Netflix might use a specific class (inspect element to find reliable ones)
            // extractedTitle = $('.title-title').first().text().trim() || null;
        }
        if (!extractedTitle && service === 'Amazon Prime') {
            extractedTitle = $('h1[data-automation-id="title"]').first().text().trim() || null; // From previous attempts
        }
        // Add more service-specific selectors here if needed
        // ...

        console.log(`Extracted title: ${extractedTitle}`);
        return { title: extractedTitle, service };

    } catch (error) {
        console.error("Scraping error:", error);
        // Fallback: If scraping fails, maybe try extracting from URL path as last resort
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const pathParts = pathname.split('/').filter(Boolean);
            if (pathParts.length > 0) {
                const lastPart = pathParts[pathParts.length - 1].replace(/-/g, ' ');
                console.log(`Falling back to extracting title from path: ${lastPart}`);
                return {
                    title: lastPart.charAt(0).toUpperCase() + lastPart.slice(1),
                    service
                };
            }
        } catch { /* ignore fallback error */ }

        return { title: null, service: null }; // Final failure
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json({ message: "URL parameter is required" }, { status: 400 });
        }

        // Scrape title from the URL
        const { title, service } = await scrapeTitle(url);

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
        console.error("URL scraping error:", error);
        return NextResponse.json({
            message: "Failed to process the URL",
            success: false
        }, { status: 500 });
    }
} 