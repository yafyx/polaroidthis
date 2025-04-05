import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Film, Plus, Search } from "lucide-react";
import FeaturedMovies from "@/components/featured-movies";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#F9FAFB]">
      {/* App Header */}
      <section className="py-12 px-4 md:py-16 bg-white border-b">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  create polaroid posters
                </h1>
              </div>
              <p className="text-base text-muted-foreground">
                transform your favorite movies into minimalist polaroid posters
                with just a few clicks
              </p>
              <div className="flex space-x-3 pt-2">
                <Button asChild size="lg" className="gap-2 px-4">
                  <Link href="/create">
                    <Plus className="h-4 w-4" />
                    create Poster
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="gap-2 px-4"
                >
                  <Link href="/explore">
                    <Search className="h-4 w-4" />
                    explore
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative h-[240px] w-[180px]">
                <Image
                  src="/examples/poster1.jpg"
                  alt="Example poster"
                  fill
                  className="object-cover rounded-md shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-md"></div>
              </div>
              <div className="relative h-[220px] w-[180px] ml-[-60px] mt-4">
                <Image
                  src="/examples/poster2.jpg"
                  alt="Example poster"
                  fill
                  className="object-cover rounded-md shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="py-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">Featured Movies</h2>
              <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full ml-2">
                TMDB
              </div>
            </div>
            <Link
              href="/explore"
              className="text-primary flex items-center text-sm font-medium hover:underline group"
            >
              See more{" "}
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-xs text-muted-foreground mb-4">
              Select a movie to create a stylized poster
            </p>
            <FeaturedMovies />
          </div>
        </div>
      </section>
    </div>
  );
}
