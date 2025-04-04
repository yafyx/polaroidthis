import Link from "next/link";
import { Film, Heart, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/10 py-5 mt-auto bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-md p-1">
              <Film className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium">polaroidthis</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-muted-foreground">
            <Link
              href="/create"
              className="hover:text-foreground transition-colors"
            >
              Create
            </Link>
            <Link
              href="/explore"
              className="hover:text-foreground transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="flex items-center">
              <span>Made with</span>
              <Heart className="h-3 w-3 mx-1 text-red-500" />
            </div>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
