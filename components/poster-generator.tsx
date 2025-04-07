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
  X,
  Upload,
  GripVertical,
  Menu,
  Plus,
  ChevronLeft,
  Check,
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
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "./ui/animated-grid-pattern";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

// Mock data for placeholder
const mockMovieData: MovieData = {
  title: "Your Poster Title",
  runningTime: "120 minutes",
  director: "Your Name",
  producedBy: "PolaroidThis",
  starring: "Add your favorite actor",
  imageUrl: "/placeholder.svg?height=300&width=300&text=Preview",
  year: "2023",
};

interface PosterGeneratorProps {
  initialData?: any;
  initialTab?: string;
}

interface FloatingActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  color?: string;
}

const FloatingActionButton = ({
  icon: Icon,
  label,
  onClick,
  isActive,
  color = "bg-white",
}: FloatingActionButtonProps) => (
  <Button
    onClick={onClick}
    variant="outline"
    size="sm"
    className={cn(
      "h-9 shadow-sm rounded-md flex items-center gap-1.5 px-3 transition-all",
      color,
      isActive ? "ring-2 ring-primary" : "hover:bg-slate-50"
    )}
  >
    <Icon className="h-4 w-4" />
    <span className="text-xs font-medium">{label}</span>
  </Button>
);

// Draggable Dialog component
interface DraggableDialogProps {
  title: string;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  children: React.ReactNode;
}

const DraggableDialog = ({
  title,
  onClose,
  initialPosition = { x: 20, y: 20 },
  children,
}: DraggableDialogProps) => {
  const [position, setPosition] = useState(initialPosition);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, ...initialPosition }}
      animate={{ opacity: 1, x: position.x, y: position.y }}
      exit={{ opacity: 0 }}
      className="absolute top-0 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-0 w-[320px] max-h-[500px] flex flex-col"
      style={{ zIndex: 40 }}
      onDragEnd={(e, info) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        });
      }}
    >
      <div className="flex justify-between items-center p-3 border-b border-gray-100 cursor-move">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full"
          onClick={onClose}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="p-4 overflow-y-auto flex-1">{children}</div>
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
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [mobileView, setMobileView] = useState<string | null>(null);

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

        // Calculate available space, accounting for toolbar
        const effectiveContainerWidth = containerWidth - 140;
        const effectiveContainerHeight = containerHeight - 40;

        const scaleX = effectiveContainerWidth / contentWidth;
        const scaleY = effectiveContainerHeight / contentHeight;

        // Use consistent scaling regardless of content state
        setPreviewScale(Math.min(scaleX, scaleY, 1));
      }
    };

    calculateScale();

    const containerElement = canvasRef.current;
    if (!containerElement) return;

    const observer = new ResizeObserver(calculateScale);
    observer.observe(containerElement);

    return () => {
      observer.disconnect();
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
    setActivePanel(null);
  };

  const togglePanel = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName);
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

  // Get initial dialog positions
  const getDialogPosition = (type: string) => {
    switch (type) {
      case "tmdb":
        return { x: 20, y: 20 };
      case "url":
        return { x: 20, y: 60 };
      case "manual":
        return { x: 20, y: 100 };
      default:
        return { x: 20, y: 20 };
    }
  };

  const handleMobileAction = (action: string) => {
    setMobileView(action);
  };

  const handleMobileComplete = () => {
    setMobileView(null);
    setIsMobileSheetOpen(false);
  };

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm flex flex-col h-[calc(100vh-120px)]">
      <div className="bg-white border-b border-gray-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2.5">
          <Palette className="h-5 w-5 text-gray-500" />
          <div>
            <h2 className="font-semibold text-sm text-gray-800">
              Poster Canvas
            </h2>
            <p className="text-xs text-gray-500">
              Use the toolbar to edit your poster
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={resetPosterAndForm}
            variant="outline"
            size="sm"
            className="rounded-full text-xs h-8"
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
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export PNG
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-grow relative overflow-hidden flex flex-col items-center justify-center p-6">
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
                className="relative"
                style={{ transformOrigin: "center center" }}
              >
                <PosterPreview ref={posterRef} movieData={movieData} />
              </motion.div>
            )}

            {/* Desktop toolbar - hidden on mobile */}
            <div className="absolute top-1/2 right-0 -mr-[10rem] -translate-y-1/2 flex flex-col items-start gap-2 z-50 md:flex">
              <FloatingActionButton
                icon={Search}
                label="Search Movie"
                isActive={activePanel === "tmdb"}
                onClick={() => togglePanel("tmdb")}
                color="bg-blue-50"
              />

              <FloatingActionButton
                icon={Link2}
                label="URL"
                isActive={activePanel === "url"}
                onClick={() => togglePanel("url")}
                color="bg-green-50"
              />

              <FloatingActionButton
                icon={FileEdit}
                label="Edit"
                isActive={activePanel === "manual"}
                onClick={() => togglePanel("manual")}
                color="bg-purple-50"
              />

              <FloatingActionButton
                icon={Upload}
                label="Upload"
                onClick={triggerFileInput}
                color="bg-amber-50"
              />
            </div>
          </div>

          {/* Mobile floating action button */}
          <div className="md:hidden absolute bottom-4 right-4 z-50">
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg bg-primary text-white hover:bg-primary/90"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-xl h-auto max-h-[92vh] overflow-hidden p-0"
              >
                {!mobileView ? (
                  <div className="flex flex-col h-full">
                    <SheetHeader className="px-6 py-4 text-left border-b">
                      <SheetTitle>Edit Poster</SheetTitle>
                      <SheetDescription>
                        Choose an option to customize your poster
                      </SheetDescription>
                    </SheetHeader>
                    <div className="p-4 flex-1 overflow-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start h-auto py-4 px-4"
                          onClick={() => handleMobileAction("tmdb")}
                        >
                          <div className="flex items-center">
                            <div className="bg-blue-50 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                              <Search className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Search Movie</p>
                              <p className="text-xs text-muted-foreground">
                                Find a movie by title
                              </p>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start h-auto py-4 px-4"
                          onClick={() => handleMobileAction("url")}
                        >
                          <div className="flex items-center">
                            <div className="bg-green-50 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                              <Link2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Streaming URL</p>
                              <p className="text-xs text-muted-foreground">
                                Use a streaming service link
                              </p>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start h-auto py-4 px-4"
                          onClick={() => handleMobileAction("manual")}
                        >
                          <div className="flex items-center">
                            <div className="bg-purple-50 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                              <FileEdit className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Manual Edit</p>
                              <p className="text-xs text-muted-foreground">
                                Enter details manually
                              </p>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start h-auto py-4 px-4"
                          onClick={() => {
                            triggerFileInput();
                            setTimeout(() => setIsMobileSheetOpen(false), 100);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="bg-amber-50 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                              <Upload className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Upload Image</p>
                              <p className="text-xs text-muted-foreground">
                                Use your own image
                              </p>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => setMobileView(null)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Back</span>
                      </Button>
                      <h3 className="font-medium text-center flex-1 mr-[72px]">
                        {mobileView === "tmdb" && "Search Movie"}
                        {mobileView === "url" && "Enter Streaming URL"}
                        {mobileView === "manual" && "Edit Details"}
                      </h3>
                    </div>

                    <div className="p-4 flex-1 overflow-auto">
                      {mobileView === "tmdb" && (
                        <TmdbSearchForm
                          onUpdateMovieData={handleUpdateMovieData}
                        />
                      )}

                      {mobileView === "url" && (
                        <UrlInputForm
                          onUpdateMovieData={handleUpdateMovieData}
                        />
                      )}

                      {mobileView === "manual" && (
                        <ManualInputForm
                          movieData={movieData}
                          onUpdateMovieData={handleUpdateMovieData}
                        />
                      )}
                    </div>

                    <div className="p-4 border-t">
                      <Button className="w-full" onClick={handleMobileComplete}>
                        <Check className="mr-2 h-4 w-4" />
                        Apply Changes
                      </Button>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {/* Draggable edit panels - desktop only */}
          <AnimatePresence>
            {activePanel && window.innerWidth >= 768 && (
              <DraggableDialog
                title={
                  activePanel === "tmdb"
                    ? "Search Movie"
                    : activePanel === "url"
                    ? "Enter Streaming URL"
                    : "Edit Details"
                }
                onClose={() => setActivePanel(null)}
                initialPosition={getDialogPosition(activePanel)}
              >
                {activePanel === "tmdb" && (
                  <TmdbSearchForm onUpdateMovieData={handleUpdateMovieData} />
                )}

                {activePanel === "url" && (
                  <UrlInputForm onUpdateMovieData={handleUpdateMovieData} />
                )}

                {activePanel === "manual" && (
                  <ManualInputForm
                    movieData={movieData}
                    onUpdateMovieData={handleUpdateMovieData}
                  />
                )}
              </DraggableDialog>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
