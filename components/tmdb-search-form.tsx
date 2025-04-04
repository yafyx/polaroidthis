"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Film, Info, X } from "lucide-react";
import type { MovieData } from "./poster-generator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TmdbSearchFormProps {
  onUpdateMovieData: (data: Partial<MovieData>) => void;
}

type MovieSearchResult = {
  id: number;
  title: string;
  releaseDate: string;
  posterPath: string | null;
};

export default function TmdbSearchForm({
  onUpdateMovieData,
}: TmdbSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieSearchResult | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchSearchResults(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSearchResults = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/tmdb/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMovie = (movie: MovieSearchResult) => {
    setSelectedMovie(movie);
    setIsSearchOpen(false);
    fetchMovieDetails(movie.id);
  };

  const clearSelectedMovie = () => {
    setSelectedMovie(null);
    onUpdateMovieData({
      title: "",
      year: "",
      runningTime: "",
      director: "",
      producedBy: "",
      starring: "",
      imageUrl: "",
      imageFile: null,
    });
  };

  const fetchMovieDetails = async (movieId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tmdb/movie/${movieId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch movie data");
      }

      onUpdateMovieData({
        title: data.title,
        year: data.year,
        runningTime: data.runningTime,
        director: data.director,
        producedBy: data.producedBy,
        starring: data.starring,
        imageUrl: data.imageUrl,
        imageFile: null,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="search" className="text-xs font-medium">
            Search for a movie
          </Label>
          {selectedMovie && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={clearSelectedMovie}
            >
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isSearchOpen}
              className="w-full justify-between h-9 font-normal"
            >
              {selectedMovie ? (
                <div className="flex items-center">
                  <span className="truncate max-w-[240px]">
                    {selectedMovie.title}
                  </span>
                  {selectedMovie.releaseDate && (
                    <Badge
                      variant="outline"
                      className="ml-2 text-xs font-normal"
                    >
                      {new Date(selectedMovie.releaseDate).getFullYear()}
                    </Badge>
                  )}
                </div>
              ) : (
                "Search for a movie..."
              )}
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] md:w-[400px] p-0" align="start">
            <Command className="rounded-lg overflow-hidden">
              <CommandInput
                placeholder="Type a movie title..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="h-9"
              />
              <CommandList className="max-h-[300px] overflow-auto">
                {isSearching && (
                  <div className="p-2 fade-in">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 py-2 px-1"
                      >
                        <Skeleton className="h-14 w-10 rounded" />
                        <div className="space-y-1.5 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <CommandEmpty className="py-6 text-center text-sm">
                  {searchQuery.length > 0 ? (
                    <>
                      <div className="text-muted-foreground mb-2">
                        No movies found
                      </div>
                      <span className="text-xs block">
                        Try a different search term
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      Type to search for movies
                    </span>
                  )}
                </CommandEmpty>

                <CommandGroup>
                  {searchResults.map((movie) => (
                    <CommandItem
                      key={movie.id}
                      value={movie.title}
                      onSelect={() => handleSelectMovie(movie)}
                      className="flex items-center py-2"
                    >
                      <div className="flex items-center space-x-2 w-full">
                        {movie.posterPath ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                            alt={movie.title}
                            className="h-14 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-14 w-10 bg-muted rounded flex items-center justify-center">
                            <Film className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{movie.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {movie.releaseDate
                              ? new Date(movie.releaseDate).getFullYear()
                              : "Unknown year"}
                          </p>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 fade-in">
          <Loader2 className="h-7 w-7 animate-spin text-primary mb-4" />
          <span className="text-sm text-muted-foreground">
            Loading movie details...
          </span>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4 fade-in">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedMovie && !isLoading && (
        <Card className="bg-secondary/30 border-0 slide-up overflow-hidden">
          <CardContent className="p-4">
            <div className="flex space-x-3">
              {selectedMovie.posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w154${selectedMovie.posterPath}`}
                  alt={selectedMovie.title}
                  className="h-28 rounded-md object-cover shadow-sm"
                />
              ) : (
                <div className="h-28 w-20 bg-muted rounded-md flex items-center justify-center">
                  <Film className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 space-y-1 pt-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-base leading-tight">
                    {selectedMovie.title}
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`https://www.themoviedb.org/movie/${selectedMovie.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Info className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>View on TMDB</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedMovie.releaseDate
                    ? new Date(selectedMovie.releaseDate).getFullYear()
                    : "Unknown year"}
                </p>
                <div className="pt-2">
                  <Badge variant="secondary" className="text-xs font-normal">
                    Data from TMDB
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
