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

      <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Instantly Create from URLs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Just add{" "}
              <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-base mx-1">
                polaroidthis.
              </code>{" "}
              to the beginning of a streaming service URL.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Explanation and Examples */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Link2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">How it Works</h3>
                </div>
                <p className="text-muted-foreground mb-5">
                  Simply prepend our domain to any supported streaming service
                  link to automatically generate a polaroid poster. We'll fetch
                  the title and create the magic!
                </p>
                <div className="space-y-4">
                  {/* Example 1 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                    <span className="font-mono bg-slate-100 px-3 py-1.5 rounded text-xs flex-grow break-all text-center sm:text-left">
                      netflix.com/title/81922333
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 mx-auto sm:mx-2" />
                    <span className="font-mono bg-primary/10 text-primary px-3 py-1.5 rounded text-xs font-medium flex-grow break-all text-center sm:text-left">
                      polaroidthis.vercel.app/create?url=netflix...
                    </span>
                  </div>
                  {/* Example 2 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                    <span className="font-mono bg-slate-100 px-3 py-1.5 rounded text-xs flex-grow break-all text-center sm:text-left">
                      primevideo.com/detail/0SSV...
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 mx-auto sm:mx-2" />
                    <span className="font-mono bg-primary/10 text-primary px-3 py-1.5 rounded text-xs font-medium flex-grow break-all text-center sm:text-left">
                      polaroidthis.vercel.app/create?url=primevideo...
                    </span>
                  </div>
                </div>
                <div className="mt-6 text-center sm:text-left">
                  <Button
                    asChild
                    size="sm"
                    variant="default"
                    className="gap-1.5"
                  >
                    <Link href="/create?tab=url">
                      <Link2 className="h-3.5 w-3.5" />
                      Try it with a URL
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Supported Services */}
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-center md:text-left">
                Supported Streaming Services
              </h3>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
                {[
                  "Netflix",
                  "Amazon Prime",
                  "Disney+",
                  "Hulu",
                  "Max (HBO)",
                  "Apple TV+",
                ].map((service) => (
                  <li key={service} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                    <span className="text-muted-foreground">{service}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-600 mt-4 pt-4 border-t border-slate-200">
                We automatically extract the movie or show details from these
                services and generate a poster using data from TMDB.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
