"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import PolaroidPoster from "./polaroid-poster"
import Link from "next/link"

type FeaturedMovie = {
  id: number
  title: string
  posterPath: string
  year: string
}

export default function FeaturedPosters() {
  const [featuredMovies, setFeaturedMovies] = useState<FeaturedMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const response = await fetch("/api/tmdb/featured")
        if (!response.ok) throw new Error("Failed to fetch featured movies")
        const data = await response.json()
        setFeaturedMovies(data)
      } catch (error) {
        console.error("Error fetching featured movies:", error)
        // Fallback data in case of error
        setFeaturedMovies([
          {
            id: 1,
            title: "The Shawshank Redemption",
            posterPath: "/placeholder.svg?height=450&width=300&text=Shawshank",
            year: "1994",
          },
          {
            id: 2,
            title: "The Godfather",
            posterPath: "/placeholder.svg?height=450&width=300&text=Godfather",
            year: "1972",
          },
          {
            id: 3,
            title: "The Dark Knight",
            posterPath: "/placeholder.svg?height=450&width=300&text=Dark+Knight",
            year: "2008",
          },
          {
            id: 4,
            title: "Pulp Fiction",
            posterPath: "/placeholder.svg?height=450&width=300&text=Pulp+Fiction",
            year: "1994",
          },
          {
            id: 5,
            title: "Fight Club",
            posterPath: "/placeholder.svg?height=450&width=300&text=Fight+Club",
            year: "1999",
          },
          {
            id: 6,
            title: "Inception",
            posterPath: "/placeholder.svg?height=450&width=300&text=Inception",
            year: "2010",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedMovies()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[3/4] w-full rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {featuredMovies.map((movie) => (
        <Link key={movie.id} href={`/create?movie=${movie.id}`}>
          <PolaroidPoster title={movie.title} year={movie.year} imageUrl={movie.posterPath} showDetails={false} />
        </Link>
      ))}
    </div>
  )
}

