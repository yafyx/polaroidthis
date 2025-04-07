import { type NextRequest, NextResponse } from "next/server"

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: NextRequest) {
  try {
    // Get the search query from the URL
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ message: "Search query is required" }, { status: 400 })
    }

    if (!TMDB_API_KEY) {
      return NextResponse.json({ message: "TMDB API key is not configured" }, { status: 500 })
    }

    // Search for movies
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=true`,
    )

    // Check if response is not JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid response type:", contentType)
      return NextResponse.json(
        { message: "Invalid API response. Please check your TMDB API key configuration." },
        { status: 500 }
      )
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ status_message: "Unknown error" }))
      console.error("TMDB API error:", errorData)
      return NextResponse.json(
        { message: `TMDB API error: ${errorData.status_message}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data.results || !Array.isArray(data.results)) {
      console.error("Invalid TMDB API response format:", data)
      return NextResponse.json(
        { message: "Invalid response format from TMDB API" },
        { status: 500 }
      )
    }

    // Format the response
    const searchResults = data.results.slice(0, 10).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      releaseDate: movie.release_date,
      posterPath: movie.poster_path,
    }))

    return NextResponse.json(searchResults)
  } catch (error) {
    console.error("TMDB API error:", error)
    return NextResponse.json(
      { message: "Failed to search for movies. Please check your API configuration." },
      { status: 500 }
    )
  }
}

