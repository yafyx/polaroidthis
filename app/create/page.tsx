"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PosterGenerator from "@/components/poster-generator";
import { Loader2, Film, ImageIcon } from "lucide-react";

export default function CreatePage() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movie");
  const [isLoading, setIsLoading] = useState(!!movieId);
  const [initialMovieData, setInitialMovieData] = useState(null);

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
    }
  }, [movieId]);

  const fetchMovieDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tmdb/movie/${id}`);
      if (!response.ok) throw new Error("Failed to fetch movie");
      const data = await response.json();
      setInitialMovieData(data);
    } catch (error) {
      console.error("Error fetching movie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <div className="bg-primary/10 p-2 rounded-md mr-3">
            <ImageIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">Create Poster</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Loading movie details...</span>
            </div>
          ) : (
            <PosterGenerator initialData={initialMovieData} />
          )}
        </div>
      </div>
    </div>
  );
}
