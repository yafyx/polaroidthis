"use client";

import Link from "next/link";
import { Film, Menu, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Create", path: "/create", icon: <Plus className="h-4 w-4" /> },
    { name: "Explore", path: "/explore", icon: <Search className="h-4 w-4" /> },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isMenuOpen
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center space-x-2 z-10 group">
            <div className="bg-primary rounded-md p-1.5 group-hover:bg-primary/90 transition-colors">
              <Film className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-medium">polaroidthis</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors 
                  ${
                    pathname === item.path
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
              >
                {item.icon && item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2 hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-[calc(100%-1px)] left-0 right-0 bg-white border-t border-b border-border shadow-sm fade-in">
            <nav className="container mx-auto py-2 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center gap-2
                    ${
                      pathname === item.path
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
