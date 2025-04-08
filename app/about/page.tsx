import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Camera, Code, Database, Film } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 relative">
          <div className="h-1 w-16 bg-primary mb-4"></div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground/90">
            About <span className="text-primary">polaroidthis</span>
          </h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          <div className="lg:col-span-3 space-y-8">
            <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
              <p className="text-xl leading-relaxed text-card-foreground">
                polaroidthis is a web application that allows movie enthusiasts
                to create beautiful minimalist movie posters in a Polaroid
                style.
              </p>
            </div>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <div className="h-px w-6 bg-primary"></div>
                Technology
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-card/80 flex items-start gap-3">
                  <Code className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Next.js 15</h3>
                    <p className="text-sm text-muted-foreground">
                      Server-side rendering and routing
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card/80 flex items-start gap-3">
                  <div className="h-5 w-5 text-primary mt-0.5 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 2h12l4 8-10 13L2 10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Tailwind CSS</h3>
                    <p className="text-sm text-muted-foreground">
                      Utility-first styling framework
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card/80 flex items-start gap-3">
                  <div className="h-5 w-5 text-primary mt-0.5 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                      <path d="M12 3v6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">shadcn/ui</h3>
                    <p className="text-sm text-muted-foreground">
                      Reusable UI components
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card/80 flex items-start gap-3">
                  <Database className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Vercel Functions</h3>
                    <p className="text-sm text-muted-foreground">
                      Serverless API handling
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card/80 flex items-start gap-3">
                  <Camera className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">html2canvas</h3>
                    <p className="text-sm text-muted-foreground">
                      Image generation
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <div className="h-px w-6 bg-primary"></div>
                Credits
              </h2>

              <div className="p-6 rounded-xl bg-card border border-border flex items-start gap-4">
                <Film className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-card-foreground">
                    polaroidthis is powered by the TMDB API but is not endorsed
                    or certified by TMDB.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center mt-8 lg:mt-0">
            <div className="p-8 rounded-xl border border-primary/50 bg-card shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Ready to create?</h3>
              <p className="text-muted-foreground mb-6">
                Turn your favorite movies into beautiful Polaroid-style posters
                with just a few clicks.
              </p>

              <Button asChild size="lg" className="w-full gap-2">
                <Link href="/create">
                  <Plus className="h-4 w-4" />
                  Create Your Poster Now
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
