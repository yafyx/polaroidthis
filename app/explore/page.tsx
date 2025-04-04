import { Suspense } from "react";
import MovieGrid from "@/components/movie-grid";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Film,
  Grid,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ExplorePage() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero section */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/80 to-primary p-8 text-white shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-3 flex items-center">
              <div className="mr-2 rounded-full bg-white/20 p-1.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/80">
                Discover
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-bold">
              Explore the World of Cinema
            </h1>
            <p className="mb-6 text-white/80">
              Browse through a curated collection of films and transform them
              into stunning polaroid posters.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/create">
                <Button
                  variant="secondary"
                  className="shadow-sm hover:shadow transition-all"
                >
                  Create New Poster
                </Button>
              </Link>
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-sm hover:shadow transition-all"
              >
                <TrendingUp className="mr-2 h-4 w-4" /> Popular Movies
              </Button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/30"></div>
            <div className="absolute -bottom-10 right-20 h-60 w-60 rounded-full bg-white/20"></div>
          </div>
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10"></div>
        </div>

        {/* Content section */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-3 text-primary shadow-sm">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Popular Movies</h2>
              <p className="text-muted-foreground text-sm">
                Find and create posters for your favorites
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative rounded-full border px-4 py-2 shadow-sm bg-white flex items-center w-full md:w-auto">
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search movies..."
                className="bg-transparent focus:outline-none text-sm w-full"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-primary text-white hover:bg-primary/90"
          >
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white shadow-sm hover:bg-slate-50"
          >
            Action
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white shadow-sm hover:bg-slate-50"
          >
            Drama
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white shadow-sm hover:bg-slate-50"
          >
            Comedy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white shadow-sm hover:bg-slate-50"
          >
            Sci-Fi
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white shadow-sm hover:bg-slate-50"
          >
            Horror
          </Button>
        </div>

        {/* Movie grid container */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <Suspense fallback={<MovieGridSkeleton />}>
            <MovieGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function MovieGridSkeleton() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Film className="h-8 w-8 text-primary/50" />
        </div>
        <p className="text-muted-foreground font-medium mb-1">
          Discovering movies for you
        </p>
        <p className="text-muted-foreground/60 text-sm">
          This may take a moment...
        </p>
      </div>
    </div>
  );
}
