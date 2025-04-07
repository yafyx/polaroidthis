import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Film,
  Plus,
  Search,
  Link2,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
                  className="object-cover rounded-md shadow-lg transform -rotate-2"
                />
              </div>
              <div className="relative h-[220px] w-[180px] ml-[-60px] mt-4">
                <Image
                  src="/examples/poster2.jpg"
                  alt="Example poster"
                  fill
                  className="object-cover rounded-md shadow-lg transform rotate-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Page */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Instantly Create from URLs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Just add your streaming URL to{" "}
              <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-base mx-1">
                polaroidthis.tech
              </code>
            </p>
          </div>

          <Card className="border">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* How it Works Section (Left/Top) */}
              <div className="md:col-span-2 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Link2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      How it Works
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Visit{" "}
                    <code className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded text-xs mx-0.5">
                      polaroidthis.tech
                    </code>{" "}
                    and paste your streaming service link to automatically
                    generate a polaroid poster.
                  </CardDescription>
                </div>

                <div className="space-y-4">
                  {/* Example 1 */}
                  <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 text-sm p-3 bg-slate-50/50 rounded-md border border-dashed border-slate-200">
                    <span className="font-mono bg-white border border-slate-200 px-3 py-1.5 rounded text-xs flex-grow break-all text-center sm:text-left z-10 shadow-sm">
                      netflix.com/title/...
                    </span>
                    <div className="flex-shrink-0 w-full sm:w-auto flex justify-center items-center my-1 sm:my-0">
                      <ArrowRight className="h-4 w-4 text-slate-500 shrink-0 z-10 bg-slate-50 px-1 animate-pulse" />
                    </div>
                    <span className="font-mono bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded text-xs font-medium flex-grow break-all text-center sm:text-left z-10 shadow-sm">
                      polaroidthis.tech/netflix.com/title/...
                    </span>
                  </div>
                  {/* Example 2 */}
                  <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 text-sm p-3 bg-slate-50/50 rounded-md border border-dashed border-slate-200">
                    <span className="font-mono bg-white border border-slate-200 px-3 py-1.5 rounded text-xs flex-grow break-all text-center sm:text-left z-10 shadow-sm">
                      primevideo.com/detail/...
                    </span>
                    <div className="flex-shrink-0 w-full sm:w-auto flex justify-center items-center my-1 sm:my-0">
                      <ArrowRight className="h-4 w-4 text-slate-500 shrink-0 z-10 bg-slate-50 px-1 animate-pulse" />
                    </div>
                    <span className="font-mono bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded text-xs font-medium flex-grow break-all text-center sm:text-left z-10 shadow-sm">
                      polaroidthis.tech/primevideo.com/detail/...
                    </span>
                  </div>
                </div>

                <div className="pt-1 text-center sm:text-left">
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

              {/* Supported Services Section (Right/Bottom) */}
              <div className="md:col-span-1 space-y-5">
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold">
                    Supported Services
                  </CardTitle>
                  <p className="text-sm text-slate-600">
                    We automatically extract movie/show details and generate a
                    poster using data from TMDB.
                  </p>
                </div>
                <ul className="grid grid-cols-1 gap-y-3.5 text-base">
                  {[
                    "Netflix",
                    "Amazon Prime",
                    "Disney+",
                    "Hulu",
                    "Max (HBO)",
                    "Apple TV+",
                  ].map((service) => (
                    <li key={service} className="flex items-center gap-3">
                      <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
