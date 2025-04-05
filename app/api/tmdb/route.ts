import { type NextRequest, NextResponse } from "next/server"

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

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

    // Check if the query is a TMDB ID (numeric)
    const isId = /^\d+$/.test(query)

    // Fetch movie details
    let movieId: string

    if (isId) {
      movieId = query
    } else {
      // Search for the movie by title
      const searchResponse = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=true`,
      )

      if (!searchResponse.ok) {
        throw new Error("Failed to search for movie")
      }

      const searchData = await searchResponse.json()

      if (!searchData.results || searchData.results.length === 0) {
        return NextResponse.json({ message: "No movies found matching your search" }, { status: 404 })
      }

      // Use the first result
      movieId = searchData.results[0].id.toString()
    }

    // Fetch detailed movie information
    const movieResponse = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`,
    )

    if (!movieResponse.ok) {
      throw new Error("Failed to fetch movie details")
    }

    const movieData = await movieResponse.json()

    // Extract director from crew
    const director =
      movieData.credits?.crew
        ?.filter((person: any) => person.job === "Director")
        .map((person: any) => person.name)
        .join(", ") || "Unknown"

    // Extract top actors
    const starring =
      movieData.credits?.cast
        ?.slice(0, 3)
        .map((person: any) => person.name)
        .join(", ") || "Unknown"

    // Extract producers from crew
    const producers =
      movieData.credits?.crew
        ?.filter((person: any) => person.job === "Producer")
        .map((person: any) => person.name)
        .slice(0, 3)
        .join(" ") || "Unknown"

    // Format the response
    const releaseYear = new Date(movieData.release_date).getFullYear()
    const formattedData = {
      title: movieData.title,
      year: releaseYear.toString(),
      runningTime: `${movieData.runtime} MINUTES`,
      director: director.toUpperCase(),
      producedBy: producers.toUpperCase(),
      starring: starring.toUpperCase(),
      imageUrl: movieData.poster_path ? `${TMDB_IMAGE_BASE_URL}${movieData.poster_path}` : "",
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("TMDB API error:", error)
    return NextResponse.json({ message: "Failed to fetch movie data" }, { status: 500 })
  }
}

