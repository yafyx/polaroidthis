import { toPng } from "html-to-image";

interface ExportOptions {
    quality?: number;
    pixelRatio?: number;
    backgroundColor?: string;
}

export async function generatePosterImage(
    element: HTMLElement,
    title: string,
    options: ExportOptions = {}
) {
    const defaultOptions = {
        quality: 1,
        pixelRatio: 4,
        cacheBust: true,
        backgroundColor: "#ffffff",
        style: {
            fontKerning: "normal",
            textRendering: "optimizeLegibility",
        },
        filter: (node: HTMLElement) => true,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
        const dataUrl = await toPng(element, mergedOptions);
        const filename = title
            ? `polaroid-${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`
            : "polaroid-poster.png";

        return { dataUrl, filename };
    } catch (error) {
        console.error("Error generating poster:", error);
        throw error;
    }
}

export function downloadPoster(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
} 