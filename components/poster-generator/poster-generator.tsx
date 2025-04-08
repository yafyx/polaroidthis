"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download, RotateCcw, ImageIcon, Palette } from "lucide-react";
import PosterPreview from "../poster-preview";
import { generatePosterImage, downloadPoster } from "@/lib/poster-export";
import { motion } from "framer-motion";
import { AnimatedGridPattern } from "../ui/animated-grid-pattern";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MobileToolbar } from "./mobile-toolbar";
import { DesktopToolbar } from "./desktop-toolbar";
import { defaultMovieData, PosterGeneratorProps, MovieData } from "./types";

export default function PosterGenerator({
  initialData,
  initialTab = "tmdb",
}: PosterGeneratorProps) {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [movieData, setMovieData] = useState<MovieData>(defaultMovieData);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

  // Compute form validity based on movie data
  const isFormValid = movieData.title.trim() !== "" || !!movieData.imageFile;

  useEffect(() => {
    if (initialData) {
      setMovieData({
        ...movieData,
        ...initialData,
      });
    }
  }, [initialData]);

  useEffect(() => {
    const calculateScale = () => {
      if (canvasRef.current) {
        const containerWidth = canvasRef.current.offsetWidth;
        const containerHeight = canvasRef.current.offsetHeight;

        // Use a consistent width for scale calculation regardless of empty/filled state
        const contentWidth = 386; // Standard polaroid width
        const contentHeight = 550; // Approximate standard polaroid height

        // Calculate available space, accounting for toolbar and margins
        // Applying different constraints for mobile vs desktop
        const isMobile = window.innerWidth < 768;

        // More conservative scaling for mobile
        const effectiveContainerWidth = isMobile
          ? containerWidth * 0.85
          : containerWidth - 140;

        const effectiveContainerHeight = isMobile
          ? containerHeight * 0.85
          : containerHeight - 40;

        const scaleX = effectiveContainerWidth / contentWidth;
        const scaleY = effectiveContainerHeight / contentHeight;

        // Use more conservative scaling, but allow more zoom on mobile
        const maxScale = isMobile ? 0.95 : 1;
        setPreviewScale(Math.min(scaleX, scaleY, maxScale));
      }
    };

    calculateScale();

    const containerElement = canvasRef.current;
    if (!containerElement) return;

    const observer = new ResizeObserver(calculateScale);
    observer.observe(containerElement);

    // Also recalculate on window resize for better responsiveness
    window.addEventListener("resize", calculateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculateScale);
    };
  }, [canvasRef]);

  const handleUpdateMovieData = (data: Partial<MovieData>) => {
    setMovieData((prev) => ({ ...prev, ...data }));
  };

  const handleGeneratePoster = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    try {
      const { dataUrl, filename } = await generatePosterImage(
        posterRef.current,
        movieData.title
      );
      downloadPoster(dataUrl, filename);
    } catch (error) {
      console.error("Error generating poster:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPosterAndForm = () => {
    setMovieData(defaultMovieData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleUpdateMovieData({
          imageUrl: event.target.result as string,
          imageFile: file,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-120px)] overflow-hidden rounded-2xl shadow-sm border border-gray-200/80">
      <CardHeader className="px-4 py-3 bg-white border-b border-gray-200/80 sticky top-0 z-10 flex-row flex justify-between items-center space-y-0 gap-x-2">
        <div className="flex items-center space-x-2.5">
          <Palette className="h-5 w-5 text-gray-500 hidden sm:block" />
          <div>
            <CardTitle className="font-semibold text-sm text-gray-800">
              Poster Canvas
            </CardTitle>
            <CardDescription className="text-xs hidden sm:block">
              Use the toolbar to edit your poster
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={resetPosterAndForm}
            variant="outline"
            size="sm"
            className="rounded-full text-xs h-8 hidden sm:flex"
            disabled={!isFormValid || isGenerating}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            onClick={handleGeneratePoster}
            disabled={!isFormValid || isGenerating}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-3 shadow-sm text-xs h-8"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                <span className="sm:inline hidden">Exporting...</span>
                <span className="sm:hidden inline">Export</span>
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                <span className="sm:inline hidden">Export PNG</span>
                <span className="sm:hidden inline">Export</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-grow relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-6">
        <AnimatedGridPattern
          width={30}
          height={30}
          maxOpacity={0.1}
          numSquares={5}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        <div
          ref={canvasRef}
          className="w-full h-full relative flex items-center justify-center"
        >
          {/* Placeholder or real poster */}
          <div className="relative">
            {!isFormValid ? (
              <div className="w-full max-w-[386px] aspect-[386/550] relative bg-gray-100/60 rounded-lg flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200">
                <ImageIcon className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-base font-medium text-gray-600 text-center">
                  Create Your Poster
                </p>
                <p className="text-sm text-gray-500 text-center mt-2 max-w-[250px]">
                  Use the toolbar to search for a movie or add content
                </p>
              </div>
            ) : (
              <motion.div
                key="poster-preview"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: previewScale, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                }}
                className="relative max-w-full max-h-full"
                style={{ transformOrigin: "center center" }}
              >
                <PosterPreview ref={posterRef} movieData={movieData} />
              </motion.div>
            )}
          </div>

          {/* Desktop Toolbar */}
          <DesktopToolbar
            movieData={movieData}
            onUpdateMovieData={handleUpdateMovieData}
            triggerFileInput={triggerFileInput}
          />

          {/* Mobile Toolbar */}
          <MobileToolbar
            movieData={movieData}
            onUpdateMovieData={handleUpdateMovieData}
            triggerFileInput={triggerFileInput}
          />
        </div>
      </CardContent>
    </Card>
  );
}
