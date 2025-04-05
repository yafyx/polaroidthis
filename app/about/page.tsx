import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About polaroidthis</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-lg">
            polaroidthis is a web application that allows movie enthusiasts to
            create beautiful minimalist movie posters in a Polaroid style.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Technology</h2>
          <p>polaroidthis is built with modern web technologies:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Next.js 15 for server-side rendering and routing</li>
            <li>Tailwind CSS for styling</li>
            <li>shadcn/ui for UI components</li>
            <li>Vercel Serverless Functions for API handling</li>
            <li>html2canvas for image generation</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Credits</h2>
          <p>
            polaroidthis is powered by the TMDB API but is not endorsed or
            certified by TMDB. This product uses the TMDB API but is not
            endorsed or certified by TMDB.
          </p>

          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/create">Create Your Poster Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
