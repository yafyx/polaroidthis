"use client";

import { forwardRef } from "react";
import type { MovieData } from "./poster-generator";
import PolaroidPoster from "./polaroid-poster";

interface PosterPreviewProps {
  movieData: MovieData;
}

const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  ({ movieData }, ref) => {
    const {
      title,
      year,
      runningTime,
      director,
      producedBy,
      starring,
      imageUrl,
    } = movieData;

    const isMovieSelected = title.trim() !== "";

    return (
      <div ref={ref} className="w-full max-w-[386px] mx-auto relative">
        {/* Main poster component */}
        {isMovieSelected ? (
          <PolaroidPoster
            title={title}
            year={year}
            imageUrl={
              imageUrl || "/placeholder.svg?height=300&width=300&text=No+Image"
            }
            runningTime={runningTime}
            director={director}
            producedBy={producedBy}
            starring={starring}
            showDetails={true}
            className="w-full relative shadow-lg"
          />
        ) : (
          <div className="bg-[#dddad3] px-[22px] py-[20.5px] shadow-md w-full relative select-none">
            <div className="flex flex-col h-full">
              {/* Empty Image Section */}
              <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-gray-600 mb-2 font-medium">
                    No Movie Selected
                  </p>
                  <p className="text-xs text-gray-500">
                    Use the sidebar to search for a movie or enter details
                    manually
                  </p>
                </div>
              </div>

              {/* Empty Title Section */}
              <div className="font-black">
                <h3 className="text-[26px] mt-0.5 uppercase text-black/50 text-opacity-80 [transform:scaleY(1.7)] [transform-origin:top] [line-height:1]">
                  Your Movie
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PosterPreview.displayName = "PosterPreview";

export default PosterPreview;
