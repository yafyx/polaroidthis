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

export const defaultMovieData: MovieData = {
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
export const mockMovieData: MovieData = {
    title: "Your Poster Title",
    runningTime: "120 minutes",
    director: "Your Name",
    producedBy: "PolaroidThis",
    starring: "Add your favorite actor",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Preview",
    year: "2023",
};

export interface PosterGeneratorProps {
    initialData?: any;
    initialTab?: string;
} 