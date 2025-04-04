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
} from "lucide-react";
import ManualInputForm from "./manual-input-form";
import TmdbSearchForm from "./tmdb-search-form";
import PosterPreview from "./poster-preview";
import { toPng } from "html-to-image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (initialData) {
      setMovieData({
        ...defaultMovieData,
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
      posterRef.current.classList.add("exporting");
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
          return true;
        },
      });

      posterRef.current.classList.remove("exporting");

      const link = document.createElement("a");
      link.href = dataUrl;

      const filename = movieData.title
        ? `polaroid-${movieData.title
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")}.png`
        : "polaroid-poster.png";

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  const isFormValid = movieData.title.trim() !== "" || !!movieData.imageFile;

  const handleSelectInputMethod = (method: string) => {
    setActiveTab(method);
  };

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

  const InputPanel = () => (
    <motion.div
      className="bg-white rounded-lg overflow-hidden border border-gray-200/80 shadow-sm flex flex-col h-[calc(100vh-120px)] max-h-[800px]"
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <PanelHeader icon={Type} title="Poster Details"></PanelHeader>

      <div className="p-5 flex-grow overflow-y-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col h-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="tmdb"
              className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Search className="h-3.5 w-3.5 mr-1.5" /> Search Movie
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
              initial={{ opacity: 0, x: activeTab === "tmdb" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "tmdb" ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              className="flex-grow"
            >
              {activeTab === "tmdb" && (
                <TabsContent value="tmdb" className="mt-0">
                  <TmdbSearchForm onUpdateMovieData={handleUpdateMovieData} />
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

  const CanvasPanel = () => (
    <motion.div
      className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200/80 shadow-sm flex flex-col h-[calc(100vh-120px)] max-h-[800px]"
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <PanelHeader icon={Palette} title="Canvas Preview">
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

      <div className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:30px_30px] opacity-50"></div>

        <div
          ref={canvasRef}
          className="absolute inset-0 grid place-items-center p-6"
        >
          <AnimatePresence>
            {isFormValid && (
              <motion.div
                key="poster-preview"
                className="relative transition-all duration-300 ease-out"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-screen-xl mx-auto">
      <InputPanel />
      <CanvasPanel />
    </div>
  );
}
