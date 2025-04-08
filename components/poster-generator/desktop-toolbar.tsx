"use client";

import { FloatingActionButton } from "./floating-action-button";
import { DraggableDialog } from "./draggable-dialog";
import { Search, Link2, FileEdit, Upload } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import TmdbSearchForm from "../tmdb-search-form";
import UrlInputForm from "../url-input-form";
import ManualInputForm from "../manual-input-form";
import { MovieData } from "./types";

interface DesktopToolbarProps {
  movieData: MovieData;
  onUpdateMovieData: (data: Partial<MovieData>) => void;
  triggerFileInput: () => void;
}

export const DesktopToolbar = ({
  movieData,
  onUpdateMovieData,
  triggerFileInput,
}: DesktopToolbarProps) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const togglePanel = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName);
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

  return (
    <>
      {/* Desktop toolbar */}
      <div className="absolute right-4 md:right-36 top-1/2 -translate-y-1/2 flex-col items-start gap-2 z-50 hidden md:flex">
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
              <TmdbSearchForm onUpdateMovieData={onUpdateMovieData} />
            )}

            {activePanel === "url" && (
              <UrlInputForm onUpdateMovieData={onUpdateMovieData} />
            )}

            {activePanel === "manual" && (
              <ManualInputForm
                movieData={movieData}
                onUpdateMovieData={onUpdateMovieData}
              />
            )}
          </DraggableDialog>
        )}
      </AnimatePresence>
    </>
  );
};
