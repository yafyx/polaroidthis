import { type NextRequest, NextResponse } from "next/server";

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

// Mock data for common titles (used when the title is an ID number)
interface MockMovieData {
    title: string;
    year: string;
    runningTime: string;
    director: string;
    producedBy: string;
    starring: string;
    imageUrl: string;
    service?: string;
}

const mockMovieData: Record<string, MockMovieData> = {
    // For testing/demo purposes
    "81922333": {
        title: "The Boys",
        year: "2022",
        runningTime: "60 MINUTES",
        director: "ERIC KRIPKE",
        producedBy: "AMAZON STUDIOS",
        starring: "KARL URBAN, JACK QUAID, ANTONY STARR, ERIN MORIARTY",
        imageUrl: "https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg",
        service: "Netflix"
    },
    "0SSV1CIYHPUKDFUE5JOYRDKF06": {
        title: "The Boys",
        year: "2022",
        runningTime: "60 MINUTES",
        director: "ERIC KRIPKE",
        producedBy: "AMAZON STUDIOS",
        starring: "KARL URBAN, JACK QUAID, ANTONY STARR, ERIN MORIARTY",
        imageUrl: "https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg",
        service: "Amazon Prime"
    }
};

export async function GET(request: NextRequest) {
    try {
        // Get the title from the URL
        const searchParams = request.nextUrl.searchParams
        const title = searchParams.get("title")
        const service = searchParams.get("service") || null

        if (!title) {
            return NextResponse.json({ message: "Title parameter is required" }, { status: 400 })
        }

        if (!TMDB_API_KEY) {
            return NextResponse.json({ message: "TMDB API key is not configured" }, { status: 500 })
        }

        // Check if we have mock data for this ID (for testing)
        if (mockMovieData[title]) {
            return NextResponse.json({
                ...mockMovieData[title],
                service: service || mockMovieData[title].service,
                success: true
            });
        }

        // If the title is numeric, it's likely an ID from a streaming service
        // Try a more fuzzy search to find related content
        const isNumericId = /^\d+$/.test(title) || title.match(/^[A-Z0-9]+$/);

        // For IDs, we should add some context to help the search
        let searchQuery = title;
        if (isNumericId && service) {
            // For numeric IDs, add the service name to help TMDB search
            searchQuery = `${service} popular`;
        }

        // Search movies - No language parameter specified, allowing multi-language results
        const movieSearchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=true`;
        console.log("Movie Search URL:", movieSearchUrl);
        const response = await fetch(movieSearchUrl);

        if (!response.ok) {
            throw new Error("Failed to search for movies");
        }
        const movieData = await response.json();

        // Search TV shows if no movies found - No language parameter specified
        let searchResults = movieData.results;
        if (searchResults.length === 0) {
            const tvSearchUrl = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=true`;
            console.log("TV Search URL:", tvSearchUrl);
            const tvResponse = await fetch(tvSearchUrl);

            if (!tvResponse.ok) {
                throw new Error("Failed to search for TV shows");
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

        const result = searchResults[0];

        // Fetch details - No language parameter specified
        const isTV = result.media_type === 'tv' || result.name; // Check if it has a 'name' field typical for TV shows
        const detailsEndpoint = isTV ? 'tv' : 'movie';
        const detailsUrl = `${TMDB_BASE_URL}/${detailsEndpoint}/${result.id}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
        console.log("Details URL:", detailsUrl);
        const detailsResponse = await fetch(detailsUrl);

        if (!detailsResponse.ok) {
            throw new Error(`Failed to fetch ${isTV ? 'TV show' : 'movie'} details`);
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
    } catch (error) {
        console.error("TMDB API error:", error);
        return NextResponse.json({
            message: "Failed to fetch movie data",
            success: false
        }, { status: 500 });
    }
} 