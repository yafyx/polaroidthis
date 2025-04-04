"use client";

import { useEffect, useState } from "react";
import MovieCard from "./movie-card";
import Link from "next/link";
import { Loader2, Film } from "lucide-react";

type FeaturedMovie = {
  id: number;
  title: string;
  posterPath: string;
  year: string;
};

export default function FeaturedMovies() {
  const [movies, setMovies] = useState<FeaturedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/tmdb/featured");
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Film className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p>No popular movies available at the moment.</p>
        <p className="text-xs mt-1">Try again later or browse the gallery</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <Link
          key={movie.id}
          href={`/create?movie=${movie.id}`}
          className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        >
          <MovieCard
            title={movie.title}
            year={movie.year}
            imageUrl={movie.posterPath}
          />
        </Link>
      ))}
    </div>
  );
}
