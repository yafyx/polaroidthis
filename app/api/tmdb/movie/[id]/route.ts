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

