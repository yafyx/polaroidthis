import Image from "next/image";
import { Film } from "lucide-react";

interface MovieCardProps {
  title: string;
  year?: string;
  imageUrl: string;
  className?: string;
}

export default function MovieCard({
  title,
  year,
  imageUrl,
  className = "",
}: MovieCardProps) {
  return (
    <div
      className={`movie-card group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-border/5 ${className}`}
    >
      <div className="relative aspect-[2/3] bg-secondary rounded-t-lg overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 right-2 bg-black/70 rounded-sm px-1 py-0.5 text-[9px] text-white/90 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              TMDB
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Film className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{title}</h3>
        {year && <p className="text-xs text-muted-foreground mt-0.5">{year}</p>}
      </div>
    </div>
  );
}
