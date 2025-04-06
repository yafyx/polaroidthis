import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Film, Plus, Search, Link2 } from "lucide-react";
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

      {/* New section for URL prefixing feature */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">URL Prefixing</h2>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Simply prepend{" "}
                  <span className="font-mono text-primary bg-slate-100 px-1 py-0.5 rounded">
                    polaroidthis.
                  </span>{" "}
                  to any streaming service URL to instantly create a polaroid
                  poster.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs flex-1 overflow-hidden text-ellipsis">
                      netflix.com/title/81922333
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-mono bg-primary/10 text-primary px-2 py-1 rounded text-xs flex-1 overflow-hidden text-ellipsis">
                      polaroidthis.vercel.app/title/81922333
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs flex-1 overflow-hidden text-ellipsis">
                      primevideo.com/detail/0SSV1CIYHPUKDFUE5JOYRDKF06
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-mono bg-primary/10 text-primary px-2 py-1 rounded text-xs flex-1 overflow-hidden text-ellipsis">
                      polaroidthis.vercel.app/detail/0SSV1CIYHPUKDFUE5JOYRDKF06
                    </span>
                  </div>
                </div>
                <div className="mt-5">
                  <Button asChild size="sm" variant="default" className="gap-1">
                    <Link href="/create?tab=url">
                      <Link2 className="h-3.5 w-3.5" />
                      Try a URL
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-3">
                <h3 className="text-base font-medium">
                  Supported Streaming Services
                </h3>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Netflix</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Amazon Prime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Disney+</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Hulu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Max (HBO)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Apple TV+</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 mt-3">
                  We automatically extract the movie or show information by
                  scraping the actual title from streaming services and create a
                  beautiful polaroid poster using data from TMDB.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
