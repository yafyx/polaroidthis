import { NextResponse } from "next/server"

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

export async function GET() {
  try {
    if (!TMDB_API_KEY) {
      return NextResponse.json({ message: "TMDB API key is not configured" }, { status: 500 })
    }

    // Fetch popular movies
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`)

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
    const featuredMovies = data.results.slice(0, 6).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
        : "/placeholder.svg?height=450&width=300&text=No+Image",
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown",
    }))

    return NextResponse.json(featuredMovies)
  } catch (error) {
    console.error("TMDB API error:", error)
    return NextResponse.json(
      { message: "Failed to fetch featured movies. Please check your API configuration." },
      { status: 500 }
    )
  }
}

