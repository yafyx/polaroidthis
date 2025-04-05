import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 hidden md:block">
        <div className="w-12 h-12 border border-primary/10 rounded-full"></div>
        <div className="w-8 h-8 border border-primary/10 rounded-full absolute top-2 left-2"></div>
      </div>

      <div className="absolute top-40 left-0 h-40 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden md:block"></div>

      <div className="absolute bottom-20 right-10 opacity-30 hidden md:block">
        <Plus className="h-6 w-6 text-primary/20" strokeWidth={1} />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <div className="absolute top-0 left-0 w-10 h-px bg-primary"></div>
        <h1 className="text-3xl font-bold mb-6 pt-2">About polaroidthis</h1>

        <div className="prose prose-gray max-w-none relative">
          {/* Replace grid pattern with line patterns */}
          <div className="absolute -left-10 top-1/4 hidden md:block opacity-20">
            <div className="w-6 h-px bg-primary/50"></div>
            <div className="w-4 h-px bg-primary/50 mt-2"></div>
            <div className="w-8 h-px bg-primary/50 mt-2"></div>
            <div className="h-12 w-px bg-primary/50 absolute top-6 left-6"></div>
          </div>

          <p className="text-lg">
            polaroidthis is a web application that allows movie enthusiasts to
            create beautiful minimalist movie posters in a Polaroid style.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center">
            <div className="w-4 h-px bg-primary mr-2"></div>
            Technology
          </h2>
          <p>polaroidthis is built with modern web technologies:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Next.js 15 for server-side rendering and routing</li>
            <li>Tailwind CSS for styling</li>
            <li>shadcn/ui for UI components</li>
            <li>Vercel Serverless Functions for API handling</li>
            <li>html2canvas for image generation</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center">
            <div className="w-4 h-px bg-primary mr-2"></div>
            Credits
          </h2>
          <p>
            polaroidthis is powered by the TMDB API but is not endorsed or
            certified by TMDB. This product uses the TMDB API but is not
            endorsed or certified by TMDB.
          </p>

          <div className="mt-10 text-center relative">
            {/* Decorative border */}
            <div className="absolute -inset-4 border border-primary/5 rounded-md"></div>

            <Button asChild size="lg" className="relative">
              <Link href="/create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your Poster Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
