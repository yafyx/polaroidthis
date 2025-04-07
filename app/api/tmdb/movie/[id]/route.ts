import { type NextRequest, NextResponse } from "next/server"

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const movieId = params.id

    if (!TMDB_API_KEY) {
      return NextResponse.json({ message: "TMDB API key is not configured" }, { status: 500 })
    }

    // Fetch detailed movie information
    const movieResponse = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`,
    )

    // Check if response is not JSON
    const contentType = movieResponse.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid response type:", contentType)
      return NextResponse.json(
        { message: "Invalid API response. Please check your TMDB API key configuration." },
        { status: 500 }
      )
    }

    if (!movieResponse.ok) {
      const errorData = await movieResponse.json().catch(() => ({ status_message: "Unknown error" }))
      console.error("TMDB API error:", errorData)
      return NextResponse.json(
        { message: `TMDB API error: ${errorData.status_message}` },
        { status: movieResponse.status }
      )
    }

    const movieData = await movieResponse.json()

    // Validate required fields
    if (!movieData.title || !movieData.release_date || !movieData.runtime || !movieData.credits) {
      console.error("Invalid movie data format:", movieData)
      return NextResponse.json(
        { message: "Invalid movie data format from TMDB API" },
        { status: 500 }
      )
    }

    // Extract director from crew
    const director =
      movieData.credits?.crew
        ?.filter((person: any) => person.job === "Director")
        .map((person: any) => person.name)
        .join(", ") || "Unknown"

    // Extract top actors
    const starring =
      movieData.credits?.cast
        ?.slice(0, 9)
        .map((person: any) => person.name)
        .join(", ") || "Unknown"

    // Extract producers from crew
    const producers =
      movieData.credits?.crew
        ?.filter((person: any) => person.job === "Producer")
        .map((person: any) => person.name)
        .slice(0, 3)
        .join(", ") || "Unknown"

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
    return NextResponse.json(
      { message: "Failed to fetch movie data. Please check your API configuration." },
      { status: 500 }
    )
  }
}

