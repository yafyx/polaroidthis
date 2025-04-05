"use client";

import Image from "next/image";
import { Film } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PolaroidPosterProps {
  title: string;
  year?: string;
  imageUrl: string;
  runningTime?: string;
  director?: string;
  producedBy?: string;
  starring?: string;
  className?: string;
  showDetails?: boolean;
  onClick?: () => void;
}

export default function PolaroidPoster({
  title,
  year,
  imageUrl,
  runningTime,
  director,
  producedBy,
  starring,
  className = "",
  showDetails = true,
  onClick,
}: PolaroidPosterProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleMargin, setTitleMargin] = useState("");
  const [titleParts, setTitleParts] = useState<{
    mainTitle: string;
    wrappedTitle: string;
  }>({
    mainTitle: title,
    wrappedTitle: "",
  });

  // Split title to prevent year from being alone on a new line
  useEffect(() => {
    // Truncate title if longer than 41 characters
    const truncatedTitle =
      title.length > 41 ? title.substring(0, 38) + "..." : title;

    // Maximum characters per line (approximate)
    const MAX_LINE_LENGTH = 18;

    if (titleRef.current) {
      const titleElement = titleRef.current;
      const titleWidth = titleElement.scrollWidth;
      const containerWidth = titleElement.clientWidth;

      // Check if entire title can fit on one line
      const canFitOnOneLine = titleWidth <= containerWidth * 0.9; // 90% of container width for safety margin

      // Check for really long words (longer than 10 chars) that should be wrapped
      const words = truncatedTitle.split(" ");
      const hasLongWord = words.some((word) => word.length > 10);

      // For short titles with no year or no long words, don't split at all
      if ((canFitOnOneLine && !hasLongWord) || truncatedTitle.length <= 10) {
        setTitleParts({ mainTitle: truncatedTitle, wrappedTitle: "" });
        return;
      }

      // If there's a year but title would fit on one line, only move the last word with year
      if (canFitOnOneLine && year && !hasLongWord) {
        if (words.length <= 1) {
          setTitleParts({ mainTitle: "", wrappedTitle: truncatedTitle });
        } else {
          const mainTitle = words.slice(0, -1).join(" ");
          const wrappedTitle = words[words.length - 1];
          setTitleParts({ mainTitle, wrappedTitle });
        }
        return;
      }

      // Find best split point - prioritize breaking before long words
      let splitIndex = 0;
      let currentLength = 0;

      // Find a good split point based on word boundaries
      for (let i = 0; i < words.length; i++) {
        const word = words[i];

        // If adding this word exceeds the line length or it's a very long word
        if (currentLength + word.length > MAX_LINE_LENGTH || word.length > 10) {
          // Split before this word
          splitIndex = truncatedTitle.indexOf(word, currentLength);
          break;
        }

        // Add word length plus a space
        currentLength += word.length + 1;

        // If we've processed all words, no split needed
        if (i === words.length - 1) {
          splitIndex = truncatedTitle.length;
        }
      }

      // If we didn't find a good split point but the title is long, force a split
      if (splitIndex === 0 && truncatedTitle.length > MAX_LINE_LENGTH) {
        // Find a space near the MAX_LINE_LENGTH
        const lastSpaceBeforeMax = truncatedTitle.lastIndexOf(
          " ",
          MAX_LINE_LENGTH
        );
        if (lastSpaceBeforeMax !== -1) {
          splitIndex = lastSpaceBeforeMax;
        } else {
          // No space found, split at MAX_LINE_LENGTH
          splitIndex = MAX_LINE_LENGTH;
        }
      }

      // Extract the main and wrapped parts
      const mainTitle = truncatedTitle.substring(0, splitIndex).trim();
      const wrappedTitle = truncatedTitle.substring(splitIndex).trim();

      setTitleParts({ mainTitle, wrappedTitle });
    }
  }, [title, year]);

  // Update checkTitleWrap to detect wrapping based on the title parts
  const checkTitleWrap = () => {
    if (titleRef.current) {
      const titleElement = titleRef.current;

      // If title is already split, we know it wraps
      const isWrapped = titleParts.wrappedTitle !== "";

      // Manual checks for edge cases
      const titleWidth = titleElement.scrollWidth;
      const containerWidth = titleElement.clientWidth;
      const widthExceeded = titleWidth > containerWidth;

      // Height-based check
      const heightRatio = titleElement.scrollHeight / titleElement.clientHeight;
      const heightExceeded = heightRatio > 1.2;

      // Length heuristics
      const textLength = title.length;
      const hasLongWords = title.split(" ").some((word) => word.length > 10);

      // Combined check
      const needsMargin =
        isWrapped || widthExceeded || heightExceeded || hasLongWords;

      // Adaptive margin based on title length and wrapping
      let margin = "mt-2";
      if (needsMargin) {
        if (textLength > 35) {
          margin = "mt-10"; // Extra margin for very long titles
        } else if (textLength > 25) {
          margin = "mt-6"; // More margin for medium-long titles
        } else if (textLength > 14) {
          margin = "mt-6"; // Standard margin for wrapped titles
        } else {
          margin = "mt-2"; // Default margin for short titles
        }
      }

      console.log("Title wrap check:", {
        title,
        textLength,
        titleWidth,
        containerWidth,
        widthExceeded,
        heightRatio,
        heightExceeded,
        isWrapped,
        titleParts,
        hasLongWords,
        finalDecision: needsMargin,
        appliedMargin: margin,
      });

      setTitleMargin(margin);
    }
  };

  useEffect(() => {
    // Check after DOM is fully painted
    setTimeout(checkTitleWrap, 100);

    // Check on window resize
    window.addEventListener("resize", checkTitleWrap);

    // Cleanup
    return () => window.removeEventListener("resize", checkTitleWrap);
  }, [title]);

  // Force check when component updates
  useEffect(() => {
    checkTitleWrap();
  });

  return (
    <div
      className={`bg-[#dddad3] px-[22px] py-[20.5px] shadow-md select-none ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        {/* Image Section */}
        <div className="relative w-full aspect-square bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title || "Movie poster"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 350px"
              priority={true}
              unoptimized={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Film className="h-10 w-10" />
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="font-black">
          <h3
            ref={titleRef}
            className="text-[23px] mt-0.5 uppercase text-black text-opacity-80 [transform:scaleY(1.7)] [transform-origin:top] [line-height:1]"
          >
            {titleParts.mainTitle}
            {titleParts.wrappedTitle && (
              <div className="flex items-baseline">
                <span>{titleParts.wrappedTitle}</span>
                {year && (
                  <span className="font-arial-narrow text-lg font-light text-black text-opacity-80 inline-block [transform:scaleY(0.8)] pb-2">
                    {"\u00A0" + year}
                  </span>
                )}
              </div>
            )}
            {!titleParts.wrappedTitle && year && (
              <span className="font-arial-narrow text-lg font-light text-black text-opacity-80 inline-block [transform:scaleY(0.8)] pb-2">
                {"\u00A0" + year}
              </span>
            )}
          </h3>
        </div>

        {/* Details Section - Only shown if showDetails is true */}
        {showDetails && (
          <div
            className={`font-din-condensed tracking-tight items-baseline ${titleMargin} text-black text-opacity-70 space-y-[1px] [transform:scaleY(1.1)] [transform-origin:top] [line-height:1]`}
          >
            {runningTime && (
              <div className="flex">
                <span className="w-[60px] text-[12px]">running time</span>
                <div className="font-din-condensed text-[13px] tracking-normal whitespace-pre-wrap">
                  {runningTime.replace(/,/g, "   ")}
                </div>
              </div>
            )}

            {director && (
              <div className="flex">
                <span className="w-[60px] text-[12px]">directed by</span>
                <div className="font-din-condensed text-[13px] tracking-normal whitespace-pre-wrap">
                  {director.replace(/,/g, "   ")}
                </div>
              </div>
            )}

            {producedBy && (
              <div className="flex">
                <span className="w-[60px] text-[12px]">produced by </span>
                <div className="font-din-condensed text-[13px] tracking-normal whitespace-pre-wrap">
                  {producedBy.replace(/,/g, "   ")}
                </div>
              </div>
            )}
            <div className="h-5"></div>
            {starring && (
              <div className="flex">
                <span className="w-[60px] text-[12px]">starring</span>
                <div className="font-din-condensed text-[13px] tracking-normal whitespace-pre-wrap">
                  {starring.replace(/,/g, "   ")}
                </div>
              </div>
            )}
            <div className="h-12"></div>
          </div>
        )}
      </div>
    </div>
  );
}
