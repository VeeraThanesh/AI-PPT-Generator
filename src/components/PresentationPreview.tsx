import { useState } from "react";
import type { Slide } from "../types";
import { Download, Layout, Sparkles, Loader, Check, Copy } from "./Icons";
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
        rect: { x: 0, y: 7.0, w: "100%", h: 0.2, fill: { color: "EA580C" } },
      },
      {
        rect: { x: 0, y: 6.95, w: "100%", h: 0.05, fill: { color: "FBBF24" } },
      },
    ],
  });

  presentation.forEach((slideData) => {
    const slide = ppt.addSlide({ masterName: "MASTER_SLIDE" });

    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.4,
      w: 12.33,
      h: 1,
      fontSize: 26,
      bold: true,
      color: "0B0F19",
      align: "left",
      valign: "top",
    });

    if (slideData.points && slideData.points.length > 0) {
      slide.addText(slideData.points.join("\n"), {
        x: 0.5,
        y: 1.6,
        w: 12.33,
        h: 4.8,
        fontSize: 16,
        color: "334155",
        bullet: true,
        wrap: true,
        valign: "top",
        lineSpacing: 28,
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

export const PresentationPreview = ({ presentation, isLoading }: Props) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopySlide = (slide: Slide, index: number) => {
    const text = `${slide.title}\n\n${slide.points.map((p) => `• ${p}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getSlideBadge = (index: number, total: number) => {
    if (index === 0) return "Title Slide";
    if (index === total - 1) return "Conclusion";
    return "Content";
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100/60 dark:bg-[#0B0F19] relative transition-colors duration-200">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/85 dark:bg-[#0B0F19]/80 backdrop-blur-md flex flex-col justify-center items-center z-30 transition-all">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-600/20 border border-orange-200 dark:border-orange-500/40 flex items-center justify-center shadow-lg shadow-orange-500/10">
              <Loader className="w-8 h-8 animate-spin text-orange-600 dark:text-amber-400" />
            </div>
            <div className="absolute -inset-2 bg-orange-500/20 blur-xl rounded-full" />
          </div>
          <p className="text-slate-900 dark:text-white font-semibold text-lg tracking-tight">
            Synthesizing Slide Deck...
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Formatting layouts, hierarchy, and presentation flow
          </p>
        </div>
      )}

      {/* Header Bar */}
      <div className="sticky top-0 z-20 px-3.5 py-3 md:px-6 md:py-3.5 bg-white/95 dark:bg-[#0E1422]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-4 transition-colors duration-200 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-50 dark:bg-orange-950/80 border border-orange-200/80 dark:border-orange-700/50 flex items-center justify-center shrink-0">
            <Layout className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0 flex items-center gap-2">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight shrink-0">
              <span className="sm:hidden">Deck</span>
              <span className="hidden sm:inline">Presentation Deck</span>
            </h2>
            {presentation && presentation.length > 0 && (
              <span className="shrink-0 whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/90 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30">
                {presentation.length} Slides
              </span>
            )}
          </div>
        </div>

        {/* Download Action */}
        <button
          type="button"
          onClick={() => generatePPT(presentation || [])}
          disabled={!presentation || presentation.length === 0 || isLoading}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs md:text-sm text-white bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:to-red-700 active:scale-[0.98] shadow-lg shadow-orange-600/30 border border-orange-400/30 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="hidden sm:inline">Download PPTX</span>
          <span className="sm:hidden font-medium">Export</span>
        </button>
      </div>

      {/* Slide Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
        {presentation && presentation.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {presentation.map((slide: Slide, index: number) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-[#111827]/90 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 hover:border-orange-400/60 dark:hover:border-orange-500/40 p-5 md:p-7 shadow-sm hover:shadow-md dark:shadow-xl dark:shadow-black/40 transition-all duration-200"
              >
                {/* Top Slide Meta Bar */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <span className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-700/40">
                      SLIDE {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
                      {getSlideBadge(index, presentation.length)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopySlide(slide, index)}
                      title="Copy slide content"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3.5 h-3.5 text-orange-600 dark:text-amber-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                      16:9
                    </span>
                  </div>
                </div>

                {/* Slide Title */}
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-snug">
                  {slide.title}
                </h3>

                {/* Slide Bullet Points */}
                <div className="space-y-3">
                  {slide.points.map((point: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 mt-2 shrink-0 shadow-sm shadow-orange-500/50" />
                      <p className="text-sm md:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bottom subtle progress hint */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                  <span>PowerPoint Compatible Master</span>
                  <span>
                    Slide {index + 1} of {presentation.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Deck State */
          <div className="h-full flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center px-4">
            <div className="relative mb-6">
              {/* Outer Glow */}
              <div className="absolute -inset-4 bg-orange-500/15 rounded-full blur-2xl animate-subtle-glow" />

              {/* Deck Skeleton Mockup */}
              <div className="relative w-28 h-20 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-2xl flex flex-col justify-between p-2.5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-6 h-1.5 rounded bg-orange-500/80" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-4/5 h-1.5 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-2/3 h-1.5 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="w-full h-0.5 rounded bg-orange-600/60" />
              </div>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Presentation Canvas Awaiting Content
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Describe your presentation in the studio panel. Your structured,
              ready-to-export slides will render here in real time.
            </p>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-500 dark:text-amber-400" />
              <span>Full PowerPoint (.pptx) download ready upon creation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

