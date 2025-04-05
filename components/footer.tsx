import Link from "next/link";
import { Film, Heart, Github, Twitter, Plus } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border/10 py-5 mt-auto bg-white relative">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        {/* Expanded and faded grid */}
        <div
          className="absolute inset-0 opacity-5 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          }}
        >
          {/* Dynamically generate grid lines */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 w-full h-px bg-primary"
              style={{ top: `${i * 2}rem` }} // 32px spacing
            />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 h-full w-px bg-primary"
              style={{ left: `${i * 2}rem` }} // 32px spacing
            />
          ))}
        </div>

        {/* Decorative plus patterns */}
        <div className="absolute top-8 left-16 hidden md:block">
          <Plus className="h-4 w-4 text-primary/10" />
        </div>
        <div className="absolute bottom-8 left-1/2 hidden md:block">
          <Plus className="h-3 w-3 text-primary/10" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 relative">
            {/* Decorative corner lines */}
            <div className="absolute -top-3 -left-3 w-3 h-3 hidden md:block">
              <div className="absolute top-0 left-0 w-full h-px bg-primary/20"></div>
              <div className="absolute top-0 left-0 h-full w-px bg-primary/20"></div>
            </div>

            <div className="p-1.5">
              <Image
                src="/polaroidthislogo.svg"
                alt="polaroidthis Logo"
                width={80}
                height={80}
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-muted-foreground relative">
            {/* Decorative underlines on hover */}
            <Link
              href="/create"
              className="hover:text-foreground transition-colors relative group"
            >
              Create
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/explore"
              className="hover:text-foreground transition-colors relative group"
            >
              Explore
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a
              href="#"
              className="hover:text-foreground transition-colors relative group"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-2 relative">
            <div className="flex items-center">
              <span>Made with</span>
              <Heart className="h-3 w-3 mx-1 text-red-500 animate-pulse" />
              <span>by</span>
              <Link
                href="https://github.com/yafyx"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-medium hover:text-foreground hover:underline transition-colors"
              >
                yfyx
              </Link>
            </div>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
