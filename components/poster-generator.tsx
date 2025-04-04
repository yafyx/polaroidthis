"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Download,
  PanelLeft,
  PanelRight,
  RotateCcw,
  Zap,
  Move,
  Image as ImageIcon,
  Type,
  Search,
  FileEdit,
  Film,
} from "lucide-react";
import ManualInputForm from "./manual-input-form";
import TmdbSearchForm from "./tmdb-search-form";
import PosterPreview from "./poster-preview";
import { toPng } from "html-to-image";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export type MovieData = {
  title: string;
  runningTime: string;
  director: string;
  producedBy: string;
  starring: string;
  imageUrl: string;
  imageFile?: File | null;
  year?: string;
};

const defaultMovieData: MovieData = {
  title: "",
  runningTime: "",
  director: "",
  producedBy: "",
  starring: "",
  imageUrl: "",
  imageFile: null,
  year: "",
};

interface PosterGeneratorProps {
  initialData?: any;
}

export default function PosterGenerator({ initialData }: PosterGeneratorProps) {
  const [movieData, setMovieData] = useState<MovieData>(defaultMovieData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("tmdb");
  const posterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [hasSelectedMovie, setHasSelectedMovie] = useState(false);

  // Set initial data if provided
  useEffect(() => {
    if (initialData) {
      setMovieData({
        ...defaultMovieData,
        ...initialData,
      });
      setHasSelectedMovie(true);
    }
  }, [initialData]);

  const handleUpdateMovieData = (data: Partial<MovieData>) => {
    setMovieData((prev) => ({ ...prev, ...data }));
    // If title is set, consider a movie has been selected
    if (data.title && data.title.trim() !== "") {
      setHasSelectedMovie(true);
    } else if (data.title === "") {
      setHasSelectedMovie(false);
    }
  };

  const handleGeneratePoster = async () => {
    if (!posterRef.current) return;

    setIsGenerating(true);

    try {
      // Temporarily add a class for export to ensure all elements are rendered
      posterRef.current.classList.add("exporting");

      // Allow time for fonts to load and render
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await toPng(posterRef.current, {
        quality: 1,
        pixelRatio: 4,
        cacheBust: true,
        backgroundColor: "#ffffff",
        style: {
          fontKerning: "normal",
          textRendering: "optimizeLegibility",
        },
        filter: (node) => {
          // Make sure all text nodes are captured
          return true;
        },
      });

      // Remove the temporary class
      posterRef.current.classList.remove("exporting");

      const link = document.createElement("a");
      link.href = dataUrl;

      // Create a clean filename from the title
      const filename = movieData.title
        ? `polaroid-${movieData.title
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")}.png`
        : "polaroid-poster.png";

      link.download = filename;
      link.click();
    } catch (error) {
      console.error("Error generating poster:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPoster = () => {
    // Reset any other state if needed
  };

  const isFormValid = movieData.title.trim() !== "";

  const handleSelectInputMethod = (method: string) => {
    setActiveTab(method);
    setHasSelectedMovie(true);
  };

  // Input Panel Component
  const InputPanel = () => (
    <div className="bg-[#F5F5F7] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Type className="h-5 w-5 text-primary" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-sm">Create Poster</h2>
              <Badge
                variant="outline"
                className="uppercase text-[9px] font-medium"
              >
                Beta
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Design a minimalist movie poster in the iconic polaroid style
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={resetPoster}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset view</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="bg-white h-[calc(100vh-200px)] min-h-[500px] w-full max-w-[500px] mx-auto">
        <div className="p-4 h-full overflow-y-auto">
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="tmdb">Search Movie</TabsTrigger>
              <TabsTrigger value="manual">Manual Input</TabsTrigger>
            </TabsList>
            <TabsContent value="tmdb" className="fade-in">
              <TmdbSearchForm onUpdateMovieData={handleUpdateMovieData} />
            </TabsContent>
            <TabsContent value="manual" className="fade-in">
              <ManualInputForm
                movieData={movieData}
                onUpdateMovieData={handleUpdateMovieData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  // Canvas Component
  const CanvasPanel = () => (
    <div className="bg-[#F5F5F7] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-sm">Canvas</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Preview and export your movie poster
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={resetPoster}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset view</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] min-h-[500px] bg-[#F5F5F7] relative">
        <div
          ref={canvasRef}
          className="absolute inset-0 grid place-items-center grid-pattern"
        >
          {/* Toolbar - only shown when movie is selected */}
          <motion.div
            className="absolute top-4 right-4 flex items-center space-x-2 z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleGeneratePoster}
              disabled={!isFormValid || isGenerating}
              size="sm"
              className="rounded-full px-3 shadow-md"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-1 h-3 w-3" />
                  Export
                </>
              )}
            </Button>
          </motion.div>

          <AnimatePresence>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <PosterPreview ref={posterRef} movieData={movieData} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  // New standalone Onboarding UI component
  const OnboardingUI = () => (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Film className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-2">Polaroid This</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create stylish minimalist movie posters in the iconic polaroid style
          </p>
        </motion.div>
      </div>

      <motion.div
        className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-2xl overflow-hidden shadow-lg group cursor-pointer bg-white"
          onClick={() => handleSelectInputMethod("tmdb")}
        >
          <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
            <Search className="h-20 w-20 text-white opacity-90" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              Search for a Movie
            </h3>
            <p className="text-muted-foreground">
              Find and select a movie from our extensive movie database with
              cover art and details automatically filled in for you.
            </p>
            <div className="mt-4">
              <Button
                className="group-hover:bg-primary group-hover:text-white transition-colors"
                variant="outline"
              >
                Search Movies
                <motion.div
                  className="inline-block ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  →
                </motion.div>
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-2xl overflow-hidden shadow-lg group cursor-pointer bg-white"
          onClick={() => handleSelectInputMethod("manual")}
        >
          <div className="h-48 bg-gradient-to-br from-amber-500 to-pink-600 grid place-items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
            <FileEdit className="h-20 w-20 text-white opacity-90" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              Manual Entry
            </h3>
            <p className="text-muted-foreground">
              Create a custom poster by entering all the details yourself
              including title, director, stars, and upload your own image.
            </p>
            <div className="mt-4">
              <Button
                className="group-hover:bg-primary group-hover:text-white transition-colors"
                variant="outline"
              >
                Enter Details
                <motion.div
                  className="inline-block ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  →
                </motion.div>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="text-center mt-10 text-sm text-muted-foreground">
        <p>
          Export high-resolution posters in PNG format ready for printing or
          sharing
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {!hasSelectedMovie ? (
        <OnboardingUI />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputPanel />
          <CanvasPanel />
        </div>
      )}
    </div>
  );
}
