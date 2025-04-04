import { Suspense } from "react";
import MovieGrid from "@/components/movie-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, Search } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="bg-[#F9FAFB] min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <div className="bg-primary/10 p-2 rounded-md mr-3">
            <Grid className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">Explore Movies</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-muted-foreground mb-6 text-sm">
            Browse through popular movies and create posters for your favorites.
          </p>

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
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <Search className="h-10 w-10 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground">Loading movies...</p>
      </div>
    </div>
  );
}
