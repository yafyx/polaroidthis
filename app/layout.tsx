import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Oswald } from "next/font/google";
import { Roboto_Condensed } from "next/font/google";
import { arialNarrow, dincondensed, dincondensedbold } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  weight: ["300", "400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "polaroidthis",
  description:
    "transform your favorite movies into beautiful minimalist posters with just a few clicks",
  keywords: [
    "movie polaroid posters",
    "movie polaroid",
    "movie art",
    "movie polaroid generator",
    "polaroid style",
    "minimalist movie posters",
    "custom movie posters",
    "film poster creator",
    "movie poster generator",
    "personalized movie art",
    "digital polaroid",
    "movie memorabilia",
    "film art generator",
    "cinema poster maker",
    "retro movie posters",
    "pinterest movie posters",
    "movie poster generator",
    "movie poster maker",
    "movie poster design",
    "movie poster template",
    "movie poster generator",
    "movie poster maker",
  ],
  authors: [{ name: "yfyx" }],
  openGraph: {
    title: "polaroidthis",
    description:
      "transform your favorite movies into minimalist polaroid posters with just a few clicks.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${oswald.variable} ${robotoCondensed.variable} ${arialNarrow.variable} ${dincondensed.variable} ${dincondensedbold.variable} font-sans min-h-screen flex flex-col bg-white antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
        >
          <Navbar />
          <main className="flex-grow pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
