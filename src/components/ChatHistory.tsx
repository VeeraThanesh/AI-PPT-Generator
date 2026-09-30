import type { ChatMessage } from "../types";
import { Loader, Sparkles, Send, ArrowRight } from "./Icons";

interface Props {
  chatHistory: ChatMessage[];
  isLoading: boolean;
  onSelectSuggestion?: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    title: "Startup Pitch Deck",
    desc: "Seed-stage B2B SaaS raising $2M seed round",
    prompt: "Create a 5-slide pitch deck for a seed-stage B2B SaaS AI startup seeking $2M investment",
  },
  {
    title: "AI in Healthcare",
    desc: "Breakthroughs in medical diagnosis & patient care",
    prompt: "Create a 5-slide executive presentation on AI applications in healthcare and diagnostics",
  },
  {
    title: "Quarterly Business Review",
    desc: "Q3 revenue milestones, growth metrics & KPIs",
    prompt: "Create a 5-slide Q3 business review focusing on revenue growth, key milestones, and Q4 roadmap",
  },
  {
    title: "Green Energy Transition",
    desc: "Solar, wind, and carbon-neutral initiatives",
    prompt: "Create a 5-slide presentation on renewable energy trends and corporate sustainability goals",
  },
];

export const ChatHistory = ({
  chatHistory,
  isLoading,
  onSelectSuggestion,
}: Props) => (
  <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 space-y-6">
    {chatHistory.length === 0 ? (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-lg mx-auto text-center animate-fadeIn">
        {/* Glow ambient circle */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 bg-gradient-to-r from-orange-500/20 via-amber-500/25 to-red-500/20 dark:from-orange-500/30 dark:via-amber-500/25 dark:to-red-500/20 rounded-full blur-2xl animate-subtle-glow" />
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/30 border border-orange-400/40 bg-orange-500">
            <img
              src="/vite.png"
              alt="Magic PPT"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Design Slides with Intelligence
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md leading-relaxed mb-8">
          Type any topic, presentation theme, or business objective below. AI
          will generate and refine a high-impact slide deck for you.
        </p>

        {/* Suggestion Starter Cards */}
        <div className="w-full space-y-2.5 text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 dark:text-amber-400" />
            <span>Curated Starters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {STARTER_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSuggestion?.(item.prompt)}
                className="group p-3.5 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-orange-50/50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-orange-400/60 dark:hover:border-orange-500/40 shadow-xs hover:shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500 dark:text-amber-400" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="space-y-5 max-w-3xl mx-auto">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar Pill */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold border transition-colors ${
                msg.role === "user"
                  ? "bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white border-orange-400/30 shadow-md shadow-orange-500/20"
                  : "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-amber-400 border border-orange-200 dark:border-orange-800/50 shadow-xs"
              }`}
            >
              {msg.role === "user" ? (
                <Send className="w-3.5 h-3.5" />
              ) : (
                <Sparkles className="w-4 h-4 text-orange-500 dark:text-amber-400" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] md:max-w-[78%] px-4 py-3 rounded-2xl shadow-sm dark:shadow-lg transition-all ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-orange-600 via-orange-600 to-red-600 text-white rounded-tr-xs border border-orange-400/30 shadow-md shadow-orange-950/20"
                  : "bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/90 dark:border-slate-700/70 backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span
                  className={`text-[11px] font-bold tracking-wider uppercase ${
                    msg.role === "user"
                      ? "text-orange-200"
                      : "text-orange-600 dark:text-amber-400"
                  }`}
                >
                  {msg.role === "user" ? "You" : "Magic Slide AI"}
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/50 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-orange-500 dark:text-amber-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/70 text-slate-800 dark:text-slate-200 flex items-center gap-3 shadow-sm dark:shadow-lg">
              <Loader className="w-4 h-4 animate-spin text-orange-500 dark:text-amber-400 shrink-0" />
              <div className="text-sm">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  Architecting your presentation...
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Structuring slides, key insights, and flow
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

