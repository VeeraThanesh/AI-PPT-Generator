import type { Slide } from "../types";
import { Download, MessageSquare, Zap, Loader } from "./Icons";
import PptxGenJS from "pptxgenjs";

interface Props {
  presentation: Slide[] | null;
  isLoading?: boolean;
}

const generatePPT = (presentation: Slide[]) => {
  if (!presentation || presentation.length === 0) return;

  const ppt = new PptxGenJS();
  ppt.layout = "LAYOUT_WIDE";

  ppt.defineSlideMaster({
    title: "MASTER_SLIDE",
    bkgd: "FFFFFF",
    objects: [
      {
        rect: { x: 0, y: 6.9, w: "100%", h: 0.2, fill: { color: "FF6600" } },
      },
    ],
  });

  presentation.forEach((slideData) => {
    const slide = ppt.addSlide({ masterName: "MASTER_SLIDE" });

    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 1,
      fontSize: 28,
      bold: true,
      color: "333333",
      align: "center",
      valign: "top",
    });

    if (slideData.points && slideData.points.length > 0) {
      slide.addText(slideData.points.join("\n"), {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 5,
        fontSize: 18,
        color: "555555",
        bullet: true,
        wrap: true,
        valign: "top",
      });
    }
  });

  const fileName =
    (presentation[0].title || "AI_Presentation")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase() + ".pptx";

  ppt.writeFile({ fileName }).catch((err) => {
    console.error("PPTX download failed:", err);
    alert("Failed to download PPT. Check console for details.");
  });
};

export const PresentationPreview = ({ presentation, isLoading }: Props) => (
  <div className="flex-1 p-4 h-full overflow-y-auto bg-gray-900 border-l border-gray-700 relative">
    {/* Loader overlay */}
    {isLoading && (
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center z-20 rounded-xl">
        <Loader className="w-12 h-12 animate-spin text-amber-400 mb-4" />
        <p className="text-white font-semibold">Generating slides...</p>
      </div>
    )}

    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-200 flex items-center">
        <Zap className="w-6 h-6 mr-2 text-amber-400" />
        Presentation Preview
      </h2>
      <button
        onClick={() => generatePPT(presentation || [])}
        disabled={!presentation || presentation.length === 0 || isLoading}
        className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg shadow-md transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5 mr-2" />
        Download PPTX
      </button>
    </div>

    {presentation ? (
      <div className="space-y-6">
        {presentation.map((slide: Slide, index: number) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-xl shadow-xl border-l-4 border-amber-500 hover:shadow-2xl transition duration-200"
          >
            <p className="text-xs text-amber-400 font-semibold mb-1">
              SLIDE {index + 1}
            </p>
            <h3 className="text-xl font-bold text-white mb-3 border-b border-gray-700 pb-2">
              {slide.title}
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {slide.points.map((point: string, i: number) => (
                <li key={i} className="text-sm">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center text-gray-600 p-20 mt-10 border-4 border-dashed border-gray-800 rounded-xl">
        <MessageSquare className="w-12 h-12 mx-auto mb-4" />
        <p className="font-medium">No presentation yet.</p>
        <p className="text-sm">
          Use the chat interface to generate your first draft!
        </p>
      </div>
    )}
  </div>
);
