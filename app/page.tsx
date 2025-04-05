import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Film, Plus, Search } from "lucide-react";
import FeaturedMovies from "@/components/featured-movies";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#F9FAFB]">
      <section className="py-12 px-4 md:py-16 bg-white border-b relative overflow-hidden">
        <div className="container mx-auto max-w-5xl relative">
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
                    create poster
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
            <div className="flex-1 flex justify-center md:justify-end relative">
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
    </div>
  );
}
