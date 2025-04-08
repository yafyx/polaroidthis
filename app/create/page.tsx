"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PosterGenerator from "@/components/poster-generator/poster-generator";
import { ImageIcon, Info, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

      // Check content type before trying to parse JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Invalid response type:", contentType);
        throw new Error(
          "Invalid API response. Please check your TMDB API configuration."
        );
      }

      // Safely parse JSON with error handling
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error(
          "Failed to parse API response. Please check your TMDB API configuration."
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch movie");
      }

      setInitialMovieData(data);
    } catch (error) {
      console.error("Error fetching movie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processUrl = async (encodedUrlFromQuery: string) => {
    setIsLoading(true);
    try {
      // Decode the URL passed from the middleware
      const decodedUrl = decodeURIComponent(encodedUrlFromQuery);

      // First try scraping the title using the correct, decoded URL
      let extractedTitle = null;
      let extractedService = null;

      const scrapeResponse = await fetch(
        `/api/scrape-title?url=${encodeURIComponent(decodedUrl)}`
      );

      // Check content type before trying to parse JSON
      const scrapeContentType = scrapeResponse.headers.get("content-type");
      if (
        !scrapeContentType ||
        !scrapeContentType.includes("application/json")
      ) {
        console.error(
          "Invalid response type from scrape API:",
          scrapeContentType
        );
        throw new Error(
          "Invalid API response from scrape endpoint. Please check your API configuration."
        );
      }

      // Safely parse JSON
      let scrapeData;
      try {
        scrapeData = await scrapeResponse.json();
      } catch (parseError) {
        console.error("JSON parsing error from scrape API:", parseError);
        throw new Error("Failed to parse scrape API response.");
      }

      if (scrapeResponse.ok && scrapeData.success) {
        extractedTitle = scrapeData.title;
        extractedService = scrapeData.service;
      }

      // If scraping failed, fall back to basic extraction
      if (!extractedTitle) {
        // Extract information from URL using the correct, decoded URL
        const extractResponse = await fetch(
          `/api/extract-url?url=${encodeURIComponent(decodedUrl)}`
        );

        // Check content type before trying to parse JSON
        const extractContentType = extractResponse.headers.get("content-type");
        if (
          !extractContentType ||
          !extractContentType.includes("application/json")
        ) {
          console.error(
            "Invalid response type from extract API:",
            extractContentType
          );
          throw new Error(
            "Invalid API response from extract endpoint. Please check your API configuration."
          );
        }

        // Safely parse JSON
        let extractData;
        try {
          extractData = await extractResponse.json();
        } catch (parseError) {
          console.error("JSON parsing error from extract API:", parseError);
          throw new Error("Failed to parse extract API response.");
        }

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

      // Check content type before trying to parse JSON
      const searchContentType = searchResponse.headers.get("content-type");
      if (
        !searchContentType ||
        !searchContentType.includes("application/json")
      ) {
        console.error(
          "Invalid response type from TMDB API:",
          searchContentType
        );
        throw new Error(
          "Invalid API response from TMDB. Please check your TMDB API configuration."
        );
      }

      // Safely parse JSON
      let movieData;
      try {
        movieData = await searchResponse.json();
      } catch (parseError) {
        console.error("JSON parsing error from TMDB API:", parseError);
        throw new Error(
          "Failed to parse TMDB API response. Please check your API configuration."
        );
      }

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
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-4 lg:hidden">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <div className="bg-blue-100 p-1 rounded-full">
                  <Info className="h-4 w-4" />
                </div>
                <span>Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 pl-6 list-disc text-xs text-slate-600">
                <li>
                  Click the floating buttons around the poster to edit different
                  elements
                </li>
                <li>
                  If one input method doesn't work, try another (e.g., use
                  search movie by title if URL fails)
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Canvas */}
        <div className="relative">
          <div className="w-full">
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

          <div
            className="hidden lg:block absolute top-0 right-0 translate-x-full pl-4"
            style={{ width: "250px" }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <Info className="h-4 w-4" />
                  </div>
                  <span>Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 pl-6 list-disc text-xs text-slate-600">
                  <li>
                    Click the floating buttons around the poster to edit
                    different elements
                  </li>
                  <li>
                    If one input method doesn't work, try another (e.g., use
                    search movie by title if URL fails)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

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
