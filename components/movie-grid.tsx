"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import MovieCard from "./movie-card";

type Movie = {
  id: number;
  title: string;
  posterPath: string;
  year: string;
};

export default function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const fetchMovies = async (pageNum: number) => {
    if (pageNum === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response = await fetch(`/api/tmdb/discover?page=${pageNum}`);
      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();

      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }

      setHasMore(data.page < data.totalPages);
      setPage(data.page);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchMovies(page + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/create?movie=${movie.id}`}
            className="block"
          >
            <MovieCard
              title={movie.title}
              year={movie.year}
              imageUrl={movie.posterPath}
            />
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <Button
            onClick={loadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="rounded-full px-8"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Movies"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
