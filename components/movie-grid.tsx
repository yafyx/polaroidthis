"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import MovieCard from "./movie-card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { ref: loadMoreRef, inView } = useInView();

  // Auto-load more when the load more button comes into view
  useEffect(() => {
    if (inView && !isLoadingMore && hasMore) {
      loadMore();
    }
  }, [inView]);

  // Detect scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/30"></div>
            <div className="relative animate-pulse rounded-full bg-primary p-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="mt-6 font-medium text-slate-700">
            Curating movies for you
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Just a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
          >
            <Link
              href={`/create?movie=${movie.id}`}
              className="block h-full transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            >
              <MovieCard
                title={movie.title}
                year={movie.year}
                imageUrl={movie.posterPath}
                className="h-full"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Load more trigger area */}
      {hasMore && (
        <div className="mt-16 text-center" ref={loadMoreRef}>
          <Button
            onClick={loadMore}
            disabled={isLoadingMore}
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 bg-white shadow-sm"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more movies...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Discover More Films
              </>
            )}
          </Button>
        </div>
      )}

      {/* Scroll to top button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8,
          pointerEvents: showScrollTop ? "auto" : "none",
        }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={scrollToTop}
          size="icon"
          variant="default"
          className="h-10 w-10 rounded-full shadow-md"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}
