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
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`,
    )

    if (!response.ok) {
      throw new Error("Failed to search for movies")
    }

    const data = await response.json()

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
    return NextResponse.json({ message: "Failed to search for movies" }, { status: 500 })
  }
}

