"use client";

import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronLeft,
  Check,
  Search,
  Link2,
  FileEdit,
  Upload,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import TmdbSearchForm from "../tmdb-search-form";
import UrlInputForm from "../url-input-form";
import ManualInputForm from "../manual-input-form";
import { MovieData } from "./types";

interface MobileToolbarProps {
  movieData: MovieData;
  onUpdateMovieData: (data: Partial<MovieData>) => void;
  triggerFileInput: () => void;
}

export const MobileToolbar = ({
  movieData,
  onUpdateMovieData,
  triggerFileInput,
}: MobileToolbarProps) => {
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [mobileView, setMobileView] = useState<string | null>(null);

  const handleMobileAction = (action: string) => {
    setMobileView(action);
  };

  const handleMobileComplete = () => {
    setMobileView(null);
    setIsMobileSheetOpen(false);
  };

  return (
    <div className="md:hidden absolute top-4 right-4 z-50">
      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full shadow-lg bg-primary text-white hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
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
                  <TmdbSearchForm onUpdateMovieData={onUpdateMovieData} />
                )}

                {mobileView === "url" && (
                  <UrlInputForm onUpdateMovieData={onUpdateMovieData} />
                )}

                {mobileView === "manual" && (
                  <ManualInputForm
                    movieData={movieData}
                    onUpdateMovieData={onUpdateMovieData}
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
  );
};
