"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Download,
  RotateCcw,
  Zap,
  ImageIcon,
  Type,
  Search,
  FileEdit,
  Film,
  Settings2,
  Palette,
  Info,
  Link2,
} from "lucide-react";
import ManualInputForm from "./manual-input-form";
import TmdbSearchForm from "./tmdb-search-form";
import UrlInputForm from "./url-input-form";
import PosterPreview from "./poster-preview";
import { generatePosterImage, downloadPoster } from "@/lib/poster-export";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "./ui/animated-grid-pattern";

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
  initialTab?: string;
}

const PanelHeader = ({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) => (
  <div className="bg-white border-b border-gray-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
    <div className="flex items-center space-x-2.5">
      <Icon className="h-5 w-5 text-gray-500" />
      <div>
        <h2 className="font-semibold text-sm text-gray-800">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
    <div className="flex items-center space-x-1">{children}</div>
  </div>
);

interface InputPanelProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  movieData: MovieData;
  handleUpdateMovieData: (data: Partial<MovieData>) => void;
}

const InputPanel = ({
  activeTab,
  setActiveTab,
  movieData,
  handleUpdateMovieData,
}: InputPanelProps) => (
  <motion.div
    className="bg-white rounded-lg overflow-hidden border border-gray-200/80 shadow-sm flex flex-col h-[calc(100vh-120px)]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.1 }}
  >
    <PanelHeader icon={Type} title="Details"></PanelHeader>

    <div className="p-5 flex-grow overflow-y-auto">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col h-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="tmdb"
            className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <Search className="h-3.5 w-3.5 mr-1.5" /> Search Movie
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <Link2 className="h-3.5 w-3.5 mr-1.5" /> Streaming URL
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <FileEdit className="h-3.5 w-3.5 mr-1.5" /> Manual Input
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              x: activeTab === "tmdb" ? -10 : activeTab === "url" ? 0 : 10,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: activeTab === "tmdb" ? 10 : activeTab === "url" ? 0 : -10,
            }}
            transition={{ duration: 0.2 }}
            className="flex-grow"
          >
            {activeTab === "tmdb" && (
              <TabsContent value="tmdb" className="mt-0">
                <TmdbSearchForm onUpdateMovieData={handleUpdateMovieData} />
              </TabsContent>
            )}
            {activeTab === "url" && (
              <TabsContent value="url" className="mt-0">
                <UrlInputForm onUpdateMovieData={handleUpdateMovieData} />
              </TabsContent>
            )}
            {activeTab === "manual" && (
              <TabsContent value="manual" className="mt-0">
                <ManualInputForm
                  movieData={movieData}
                  onUpdateMovieData={handleUpdateMovieData}
                />
              </TabsContent>
            )}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  </motion.div>
);

interface CanvasPanelProps {
  handleGeneratePoster: () => void;
  isFormValid: boolean;
  isGenerating: boolean;
  posterRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  movieData: MovieData;
}

const CanvasPanel = ({
  handleGeneratePoster,
  isFormValid,
  isGenerating,
  posterRef,
  canvasRef,
  movieData,
}: CanvasPanelProps) => {
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (
        canvasRef.current &&
        posterRef.current &&
        isFormValid &&
        posterRef.current.offsetWidth > 0 &&
        posterRef.current.offsetHeight > 0
      ) {
        const containerWidth = canvasRef.current.offsetWidth;
        const containerHeight = canvasRef.current.offsetHeight;
        const contentWidth = posterRef.current.offsetWidth;
        const contentHeight = posterRef.current.offsetHeight;

        // Add some padding (e.g., 60px total, 30px on each side) to the container size
        const effectiveContainerWidth = containerWidth - 60;
        const effectiveContainerHeight = containerHeight - 60;

        const scaleX = effectiveContainerWidth / contentWidth;
        const scaleY = effectiveContainerHeight / contentHeight;

        setPreviewScale(Math.min(scaleX, scaleY, 1)); // Use the smaller scale, don't scale up beyond 1
      } else {
        setPreviewScale(1); // Reset scale
      }
    };

    calculateScale(); // Initial calculation

    const containerElement = canvasRef.current;
    const contentElement = posterRef.current;

    if (!containerElement || !contentElement || !isFormValid) {
      // If elements aren't ready or poster isn't shown, reset scale and skip observer
      setPreviewScale(1);
      return;
    }

    const observer = new ResizeObserver(calculateScale);
    observer.observe(containerElement);
    // Only observe contentElement if it's expected to be there
    if (contentElement) {
      observer.observe(contentElement);
    }

    return () => {
      observer.disconnect();
    };
    // Rerun when refs are assigned, form validity changes (poster appears/disappears)
    // or movieData changes that might affect poster size (like title length)
  }, [canvasRef, posterRef, isFormValid, movieData]);

  return (
    <motion.div
      className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200/80 shadow-sm flex flex-col h-[calc(100vh-120px)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <PanelHeader icon={Palette} title="Preview">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleGeneratePoster}
                disabled={!isFormValid || isGenerating}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white rounded-md px-3 shadow-sm text-xs"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Export PNG
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Export Poster</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PanelHeader>

      <div className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex items-center justify-center p-6">
        <AnimatedGridPattern
          width={30}
          height={30}
          className="fill-gray-300/70 stroke-gray-300/70"
          maxOpacity={0.1}
          numSquares={25}
        />

        <div
          ref={canvasRef}
          className="w-full h-full relative flex items-center justify-center"
        >
          <AnimatePresence>
            {isFormValid && (
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
                className="relative"
                style={{ transformOrigin: "center center" }}
              >
                <PosterPreview ref={posterRef} movieData={movieData} />
              </motion.div>
            )}
          </AnimatePresence>

          {!isFormValid && (
            <div className="text-center text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-medium">Poster preview appears here</p>
              <p className="text-xs">
                Search for a movie or add details manually.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function PosterGenerator({
  initialData,
  initialTab = "tmdb",
}: PosterGeneratorProps) {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [movieData, setMovieData] = useState<MovieData>(defaultMovieData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosterReset, setIsPosterReset] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

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
    setActiveTab("tmdb");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2">
        <InputPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          movieData={movieData}
          handleUpdateMovieData={handleUpdateMovieData}
        />
      </div>
      <div className="lg:col-span-3">
        <CanvasPanel
          handleGeneratePoster={handleGeneratePoster}
          isFormValid={isFormValid}
          isGenerating={isGenerating}
          posterRef={posterRef}
          canvasRef={canvasRef}
          movieData={movieData}
        />
      </div>
    </div>
  );
}
