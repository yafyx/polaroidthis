"use client";

import Link from "next/link";
import { Menu, Plus, Search, X } from "lucide-react";
import Image from "next/image";
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
      {/* Top border gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="container mx-auto px-4 py-3 max-w-5xl">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="flex items-center space-x-2 z-10 group relative"
          >
            {/* Orbital circles around logo */}
            <div className="absolute -inset-1 rounded-full border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-3 rounded-full border border-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75"></div>

            <div className="p-1.5 relative">
              <Image
                src="/polaroidthislogo.svg"
                alt="polaroidthis Logo"
                width={80}
                height={80}
              />
              {/* Decorative plus in corner of logo */}
              <div className="absolute -right-1 -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-0.5 bg-primary"></div>
                <div className="w-0.5 h-1.5 bg-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 relative">
            {/* Replace grid pattern with diagonal lines */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
              <div className="absolute top-0 left-0 w-full h-px bg-primary"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-primary"></div>
              <div className="absolute top-0 left-0 h-full w-px bg-primary"></div>
              <div className="absolute top-0 right-0 h-full w-px bg-primary"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-primary/5 transform rotate-45"></div>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors relative
                  ${
                    pathname === item.path
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
              >
                {/* Active indicator line */}
                {pathname === item.path && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary"></div>
                )}
                {item.icon && item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2 hover:bg-secondary transition-colors relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-primary/20"></div>
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-primary/20"></div>

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
                  className={`py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center gap-2 relative
                    ${
                      pathname === item.path
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {pathname === item.path && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-1/2 bg-primary"></div>
                  )}
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
