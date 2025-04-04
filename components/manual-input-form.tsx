"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Image as ImageIcon,
  Film,
  X,
  Check,
  RefreshCw,
} from "lucide-react";
import type { MovieData } from "./poster-generator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ManualInputFormProps {
  movieData: MovieData;
  onUpdateMovieData: (data: Partial<MovieData>) => void;
}

export default function ManualInputForm({
  movieData,
  onUpdateMovieData,
}: ManualInputFormProps) {
  const [localImageUrl, setLocalImageUrl] = useState<string>("");
  const [isImageHovered, setIsImageHovered] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image and not too large (5MB)
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    // Create a local URL for the image
    const url = URL.createObjectURL(file);
    setLocalImageUrl(url);

    onUpdateMovieData({
      imageFile: file,
      imageUrl: url,
    });
  };

  const handleRemoveImage = () => {
    setLocalImageUrl("");
    onUpdateMovieData({
      imageFile: null,
      imageUrl: "",
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-medium">
            Movie Title
          </Label>
          <Input
            id="title"
            placeholder="e.g., The Truman Show"
            value={movieData.title}
            onChange={(e) => onUpdateMovieData({ title: e.target.value })}
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year" className="text-xs font-medium">
              Year
            </Label>
            <Input
              id="year"
              placeholder="e.g., 1998"
              value={movieData.year || ""}
              onChange={(e) => onUpdateMovieData({ year: e.target.value })}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="runningTime" className="text-xs font-medium">
              Running Time
            </Label>
            <Input
              id="runningTime"
              placeholder="e.g., 103 MINUTES"
              value={movieData.runningTime}
              onChange={(e) =>
                onUpdateMovieData({ runningTime: e.target.value })
              }
              className="h-9"
            />
          </div>
        </div>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Movie Credits</h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="director" className="text-xs font-medium">
                Director
              </Label>
              <Input
                id="director"
                placeholder="e.g., PETER WEIR"
                value={movieData.director}
                onChange={(e) =>
                  onUpdateMovieData({ director: e.target.value })
                }
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="producedBy" className="text-xs font-medium">
                Produced By
              </Label>
              <Input
                id="producedBy"
                placeholder="e.g., SCOTT RUDIN, ANDREW NICCOL"
                value={movieData.producedBy}
                onChange={(e) =>
                  onUpdateMovieData({ producedBy: e.target.value })
                }
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="starring" className="text-xs font-medium">
                Starring
              </Label>
              <Input
                id="starring"
                placeholder="e.g., JIM CARREY, LAURA LINNEY"
                value={movieData.starring}
                onChange={(e) =>
                  onUpdateMovieData({ starring: e.target.value })
                }
                className="h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="image" className="text-xs font-medium">
                Movie Image
              </Label>
              {localImageUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={handleRemoveImage}
                >
                  <X className="h-3 w-3 mr-1" /> Remove
                </Button>
              )}
            </div>

            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-md p-4 bg-background relative"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {localImageUrl ? (
                <div className="space-y-3 w-full">
                  <div className="relative group">
                    <img
                      src={localImageUrl}
                      alt="Preview"
                      className="max-h-64 object-contain mx-auto rounded-md"
                    />

                    {isImageHovered && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    document.getElementById("image")?.click()
                                  }
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Replace image</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={handleRemoveImage}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Remove image</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground justify-center">
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    <span>Image uploaded</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
                  <Button
                    type="button"
                    variant="secondary"
                    className="mb-1"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select Image
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended: square format, JPG or PNG
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
