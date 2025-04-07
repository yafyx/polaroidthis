"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Link2, AlertCircle } from "lucide-react";
import type { MovieData } from "./poster-generator";
import { Badge } from "@/components/ui/badge";

interface UrlInputFormProps {
  onUpdateMovieData: (data: Partial<MovieData>) => void;
}

export default function UrlInputForm({ onUpdateMovieData }: UrlInputFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
  };

  const processUrl = async () => {
    if (!url.trim()) {
      setError("Please enter a streaming service URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validate URL format
      let processedUrl = url.trim();

      // Check if URL has a protocol, if not add one
      if (
        !processedUrl.startsWith("http://") &&
        !processedUrl.startsWith("https://")
      ) {
        processedUrl = "https://" + processedUrl;
      }

      // Create polaroidthis URL
      try {
        const urlObj = new URL(processedUrl);
      } catch (e) {
        console.error("URL parsing error:", e);
      }

      // First try to scrape the title from the URL
      const scrapeResponse = await fetch(
        `/api/scrape-title?url=${encodeURIComponent(processedUrl)}`
      );

      let extractedTitle;
      let extractedService;

      // If scraping succeeded
      if (scrapeResponse.ok) {
        const scrapeData = await scrapeResponse.json();
        if (scrapeData.success) {
          extractedTitle = scrapeData.title;
          extractedService = scrapeData.service;
          setService(extractedService);
        }
      }

      // If scraping failed, fall back to the basic URL extraction
      if (!extractedTitle) {
        const extractResponse = await fetch(
          `/api/extract-url?url=${encodeURIComponent(processedUrl)}`
        );
        const extractData = await extractResponse.json();

        if (!extractResponse.ok || !extractData.success) {
          throw new Error(
            extractData.message || "Unable to extract details from this URL"
          );
        }

        extractedTitle = extractData.title;
        extractedService = extractData.service;
        setService(extractedService);
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

      // Update the poster data
      onUpdateMovieData({
        title: movieData.title,
        year: movieData.year,
        runningTime: movieData.runningTime,
        director: movieData.director,
        producedBy: movieData.producedBy,
        starring: movieData.starring,
        imageUrl: movieData.imageUrl,
        imageFile: null,
      });
    } catch (error) {
      console.error("URL processing error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url" className="text-xs font-medium">
          Enter streaming service URL
        </Label>
        <div className="flex gap-2">
          <Input
            id="url"
            placeholder="e.g. netflix.com/title/81922333"
            value={url}
            onChange={handleInputChange}
            className="h-9"
            disabled={isLoading}
          />
          <Button
            onClick={processUrl}
            disabled={isLoading}
            className="shrink-0"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-1.5" /> Extract
              </>
            )}
          </Button>
        </div>
      </div>

      {service && (
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Detected:</span>
          <Badge variant="outline">{service}</Badge>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs ml-2">{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-slate-500 mt-2">
        <p>
          Supported services: Netflix, Amazon Prime, Disney+, Hulu, Max, Apple
          TV+
        </p>
      </div>
    </div>
  );
}
