"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PosterGenerator from "@/components/poster-generator";
import { ImageIcon, Loader2 } from "lucide-react";

export default function CreatePage() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movie");
  const url = searchParams.get("url");
  const tab = searchParams.get("tab");
  const [isLoading, setIsLoading] = useState(!!movieId || !!url);
  const [initialMovieData, setInitialMovieData] = useState(null);
  const [initialTab, setInitialTab] = useState(tab || "tmdb");

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
      setInitialTab("tmdb");
    } else if (url) {
      processUrl(url);
      setInitialTab("url");
    } else if (tab) {
      setInitialTab(tab);
    }
  }, [movieId, url, tab]);

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

  const processUrl = async (urlPath: string) => {
    setIsLoading(true);
    try {
      // Add protocol and domain to make it a valid URL
      const fullUrl = `https://example.com${urlPath}`;

      // First try scraping the title
      let extractedTitle = null;
      let extractedService = null;

      const scrapeResponse = await fetch(
        `/api/scrape-title?url=${encodeURIComponent(fullUrl)}`
      );

      if (scrapeResponse.ok) {
        const scrapeData = await scrapeResponse.json();
        if (scrapeData.success) {
          extractedTitle = scrapeData.title;
          extractedService = scrapeData.service;
        }
      }

      // If scraping failed, fall back to basic extraction
      if (!extractedTitle) {
        // Extract information from URL
        const extractResponse = await fetch(
          `/api/extract-url?url=${encodeURIComponent(fullUrl)}`
        );
        const extractData = await extractResponse.json();

        if (!extractResponse.ok || !extractData.success) {
          throw new Error(
            extractData.message || "Unable to extract details from this URL"
          );
        }

        extractedTitle = extractData.title;
        extractedService = extractData.service;
      }

      // Search TMDB with the extracted title
      const searchResponse = await fetch(
        `/api/tmdb/find-by-title?title=${encodeURIComponent(
          extractedTitle
        )}&service=${encodeURIComponent(extractedService || "")}`
      );
      const movieData = await searchResponse.json();

      if (!searchResponse.ok || !movieData.success) {
        throw new Error(movieData.message || "Movie details not found");
      }

      setInitialMovieData(movieData);
    } catch (error) {
      console.error("URL processing error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <header className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <ImageIcon className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Create Poster
              </h1>
              <p className="text-slate-500 text-sm">
                Design your perfect movie polaroid
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="inline-block px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm text-xs text-slate-600">
              <span className="font-medium">Tip:</span> Search for your favorite
              movie, use a streaming URL, or enter details manually
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                </div>
                <h3 className="font-medium text-slate-700">
                  Preparing Your Poster
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Loading movie details from database...
                </p>
              </div>
            </div>
          ) : (
            <PosterGenerator
              initialData={initialMovieData}
              initialTab={initialTab}
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Created posters can be downloaded in high resolution, perfect for
            sharing or printing
          </p>
        </div>
      </div>
    </div>
  );
}
