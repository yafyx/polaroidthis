import { type NextRequest, NextResponse } from "next/server";

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: NextRequest) {
    try {
        // Get the title from the URL
        const searchParams = request.nextUrl.searchParams
        const title = searchParams.get("title")
        const service = searchParams.get("service") || null

        if (!title) {
            return NextResponse.json({ message: "Title parameter is required", success: false }, { status: 400 })
        }

        if (!TMDB_API_KEY) {
            return NextResponse.json({ message: "TMDB API key is not configured", success: false }, { status: 500 })
        }

        // If the title is numeric, it's likely an ID from a streaming service
        // Try a more fuzzy search to find related content
        const isNumericId = /^\\d+$/.test(title);
        // Removed check for alphanumeric IDs as find endpoint expects numeric netflix IDs

        let foundResult: any = null;

        // If it\'s a numeric ID, try the /find endpoint first
        if (isNumericId && service === 'Netflix') {
            const findUrl = `${TMDB_BASE_URL}/find/${title}?api_key=${TMDB_API_KEY}&external_source=netflix_id`;
            console.log("TMDB Find By External ID URL:", findUrl);
            const findResponse = await fetch(findUrl);

            // Check if response is not JSON
            const contentType = findResponse.headers.get("content-type")
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Invalid response type:", contentType)
                return NextResponse.json(
                    { message: "Invalid API response. Please check your TMDB API key configuration.", success: false },
                    { status: 500 }
                )
            }

            if (findResponse.ok) {
                const findData = await findResponse.json();
                // The /find endpoint returns arrays like movie_results, tv_results, etc.
                const potentialResults = [...findData.movie_results, ...findData.tv_results, ...findData.tv_episode_results, ...findData.tv_season_results];
                if (potentialResults.length > 0) {
                    foundResult = potentialResults[0]; // Use the first match
                    // Determine media type from the result object structure
                    foundResult.media_type = findData.movie_results.length > 0 ? 'movie' : 'tv';
                }
            } else {
                const errorData = await findResponse.json().catch(() => ({ status_message: "Unknown error" }))
                console.warn(`TMDB Find by ID failed: ${findResponse.status}`, errorData);
                // Optional: Fallback to search if find fails?
            }
        }

        // If not a numeric ID OR the /find endpoint failed/found nothing, use the search endpoints
        let searchResults: any[] = [];
        if (!foundResult) {
            console.log('Numeric ID not found or service not Netflix, falling back to search.');
            let searchQuery = title; // Use the original title for searching
            // NOTE: Removed the `${service} popular` logic as it was problematic

            // Search movies - Removed language parameter for broader matching
            const movieSearchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=true`;
            console.log("Movie Search URL:", movieSearchUrl);
            const response = await fetch(movieSearchUrl);

            // Check if response is not JSON
            const movieContentType = response.headers.get("content-type")
            if (!movieContentType || !movieContentType.includes("application/json")) {
                console.error("Invalid movie search response type:", movieContentType)
                return NextResponse.json(
                    { message: "Invalid API response. Please check your TMDB API key configuration.", success: false },
                    { status: 500 }
                )
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ status_message: "Unknown error" }))
                console.error("TMDB API movie search error:", errorData)
                return NextResponse.json(
                    { message: `TMDB API error: ${errorData.status_message}`, success: false },
                    { status: response.status }
                )
            }
            const movieData = await response.json();

            // Search TV shows if no movies found - Removed language parameter
            searchResults = movieData.results;
            if (searchResults.length === 0) {
                const tvSearchUrl = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=true`;
                console.log("TV Search URL:", tvSearchUrl);
                const tvResponse = await fetch(tvSearchUrl);

                // Check if response is not JSON
                const tvContentType = tvResponse.headers.get("content-type")
                if (!tvContentType || !tvContentType.includes("application/json")) {
                    console.error("Invalid TV search response type:", tvContentType)
                    return NextResponse.json(
                        { message: "Invalid API response. Please check your TMDB API key configuration.", success: false },
                        { status: 500 }
                    )
                }

                if (!tvResponse.ok) {
                    const errorData = await tvResponse.json().catch(() => ({ status_message: "Unknown error" }))
                    console.error("TMDB API TV search error:", errorData)
                    return NextResponse.json(
                        { message: `TMDB API error: ${errorData.status_message}`, success: false },
                        { status: tvResponse.status }
                    )
                }
                const tvData = await tvResponse.json();
                searchResults = tvData.results;

                if (searchResults.length === 0) {
                    return NextResponse.json({
                        message: "No content found with this title",
                        success: false,
                    }, { status: 404 });
                }
            }

            const result = foundResult || searchResults[0]; // Use foundResult if available, otherwise fallback to search result

            // Fetch details - Removed language parameter to get original language details
            const isTV = result.media_type === 'tv' || result.name;
            const detailsEndpoint = isTV ? 'tv' : 'movie';
            const detailsUrl = `${TMDB_BASE_URL}/${detailsEndpoint}/${result.id}?api_key=${TMDB_API_KEY}&append_to_response=credits`; // Reverted to no language param
            console.log("Details URL:", detailsUrl);
            const detailsResponse = await fetch(detailsUrl);

            // Check if response is not JSON
            const detailsContentType = detailsResponse.headers.get("content-type")
            if (!detailsContentType || !detailsContentType.includes("application/json")) {
                console.error("Invalid details response type:", detailsContentType)
                return NextResponse.json(
                    { message: "Invalid API response. Please check your TMDB API key configuration.", success: false },
                    { status: 500 }
                )
            }

            if (!detailsResponse.ok) {
                const errorData = await detailsResponse.json().catch(() => ({ status_message: "Unknown error" }))
                console.error(`TMDB API ${isTV ? 'TV show' : 'movie'} details error:`, errorData)
                return NextResponse.json(
                    { message: `TMDB API error: ${errorData.status_message}`, success: false },
                    { status: detailsResponse.status }
                )
            }
            const detailsData = await detailsResponse.json();

            // Extract details (Director, Starring, Producers - same logic)
            const director = detailsData.credits?.crew?.filter((p: any) => p.job === "Director").map((p: any) => p.name).join(", ") || "Unknown";
            const starring = detailsData.credits?.cast?.slice(0, 9).map((p: any) => p.name).join(", ") || "Unknown";
            const producers = detailsData.credits?.crew?.filter((p: any) => p.job === "Producer").map((p: any) => p.name).slice(0, 3).join(", ") || "Unknown";

            // Format response - Use title/name and correct year/runtime fields
            const releaseDate = detailsData.release_date || detailsData.first_air_date;
            const releaseYear = releaseDate ? new Date(releaseDate).getFullYear().toString() : "";
            const runtime = detailsData.runtime || (detailsData.episode_run_time && detailsData.episode_run_time[0]) || null;

            const formattedData = {
                title: detailsData.title || detailsData.name, // Use 'name' for TV shows
                original_title: detailsData.original_title || detailsData.original_name,
                year: releaseYear,
                runningTime: runtime ? `${runtime} MINUTES` : "",
                director: director.toUpperCase(),
                producedBy: producers.toUpperCase(),
                starring: starring.toUpperCase(),
                imageUrl: detailsData.poster_path ? `https://image.tmdb.org/t/p/w500${detailsData.poster_path}` : "",
                service: service,
                success: true
            };

            return NextResponse.json(formattedData);
        }

        // If we reach here without returning data, something went wrong in the flow but we didn't hit a specific error
        return NextResponse.json({
            message: "Failed to find movie data. Please try again with a different title.",
            success: false
        }, { status: 404 });
    } catch (error) {
        console.error("TMDB API error:", error);
        return NextResponse.json({
            message: "Failed to fetch movie data. Please check your API configuration.",
            success: false
        }, { status: 500 });
    }
} 