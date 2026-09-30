"use client";
import {
  useState,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ChatHistory } from "./components/ChatHistory";
import { PresentationPreview } from "./components/PresentationPreview";
import type { ChatMessage, Slide } from "./types";
import { fetchWithExponentialBackoff, uuid } from "./utils/helper";
import {
  Send,
  MessageSquare,
  Layout,
  Loader,
  Sun,
  Moon,
} from "./components/Icons";
import { API_URL, presentationSchema } from "./constant";
import { useTheme } from "./utils/useTheme";

export default function App() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [presentation, setPresentation] = useState<Slide[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("chat");

  // handle prompt
  const handlePrompt = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!currentPrompt.trim()) return;

      setIsLoading(true);
      setError(null);

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: uuid(),
        role: "user",
        content: currentPrompt,
      };
      setChatHistory((prev) => [...prev, userMessage]);
      setCurrentPrompt("");

      const isInitialGeneration: boolean = !presentation;

      let promptText: string;
      let systemInstruction: string;

      if (isInitialGeneration) {
        promptText = `Generate a 5-slide professional presentation outline on the topic: "${userMessage.content}". The response must be an array of slides.`;
        systemInstruction = `You are an expert presentation designer. Create a compelling, professional, and well-structured 5-slide outline. The entire response must be a single JSON array that strictly adheres to the provided schema.`;
      } else {
        const currentPresentationJson: string = JSON.stringify(
          presentation,
          null,
          2
        );
        promptText = `The current presentation outline is:\n\n---\n${currentPresentationJson}\n---\n\nThe user's request for modification is: "${userMessage.content}".\n\nBased on this request, return the COMPLETE, UPDATED JSON for the entire presentation. Ensure the JSON strictly adheres to the schema and includes all slides, even unmodified ones.`;
        systemInstruction = `You are an AI presentation editor. Your task is to update the provided JSON structure based on the user's instructions. Respond ONLY with the complete, valid, updated JSON array that strictly follows the schema. Do not include any explanatory text outside the JSON.`;
      }

      const payload = {
        contents: [{ parts: [{ text: promptText }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: presentationSchema,
        },
      };

      let aiResponseText =
        "An error occurred or the AI returned an invalid response.";

      try {
        const result = await fetchWithExponentialBackoff(API_URL, payload);
        const jsonText: string | undefined =
          result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText)
          throw new Error(
            "Received an empty or malformed response from the AI."
          );

        const generatedSlides: Slide[] = JSON.parse(jsonText);

        if (Array.isArray(generatedSlides)) {
          setPresentation(generatedSlides);
          // On mobile, auto-switch to preview so user sees results immediately
          setActiveTab("preview");
          aiResponseText = isInitialGeneration
            ? `I have successfully generated a ${generatedSlides.length}-slide presentation on "${userMessage.content}".`
            : `I have updated the presentation based on your request.`;
        } else throw new Error("AI did not return a valid array of slides.");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("AI interaction failed:", err);
        setError(
          `Failed to process request: ${err.message}. Please try again.`
        );
        aiResponseText =
          "I ran into an issue processing your request. Please try rephrasing your prompt.";
      } finally {
        setChatHistory((prev) => [
          ...prev,
          { id: uuid(), role: "ai", content: aiResponseText },
        ]);
        setIsLoading(false);
      }
    },
    [currentPrompt, presentation]
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Top Application Navbar */}
      <header className="h-14 md:h-16 px-4 md:px-6 bg-white/95 dark:bg-[#0E1422]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between z-30 shrink-0 shadow-xs transition-colors duration-200">
        {/* Brand with interactive Theme Toggle Icon */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="relative group cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            title={`Current theme: ${theme === "dark" ? "Dark" : "Light"}. Click icon to switch to ${theme === "dark" ? "Light" : "Dark"} mode!`}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg shadow-orange-500/25 border border-orange-400/40 group-hover:scale-105 group-hover:shadow-orange-500/45 group-active:scale-95 transition-all duration-200 bg-orange-500">
              <img
                src="/vite.png"
                alt="Magic PPT Logo"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {/* Status indicator badge (Moon for dark, Sun for light) */}
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border shadow-xs transition-all duration-200 ${
                isDark
                  ? "bg-slate-900 border-orange-500/50 text-amber-300"
                  : "bg-white border-orange-300 text-orange-600 shadow-xs"
              }`}
            >
              {isDark ? (
                <Moon className="w-2.5 h-2.5" />
              ) : (
                <Sun className="w-2.5 h-2.5" />
              )}
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 dark:text-white">
                Magic PPT
              </h1>
              <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-orange-50 text-orange-700 border border-orange-200/90 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30 transition-colors">
                PRO STUDIO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block leading-none">
              AI Presentation Architect
            </p>
          </div>
        </div>

        {/* Mobile Device Tab Switcher (< lg) */}
        <div className="flex lg:hidden items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "preview"
                ? "bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Deck</span>
            {presentation && presentation.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Engine status badge (Desktop) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 transition-colors">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
            Gemini Flash 2.5
          </span>
        </div>
      </header>

      {/* Main Workspace Panels */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Studio & Chat Panel */}
        <section
          className={`w-full lg:w-[45%] xl:w-[40%] flex flex-col border-r border-slate-200/80 dark:border-slate-800/90 h-full bg-white dark:bg-[#0B0F19] transition-colors duration-200 ${
            activeTab === "chat" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Subheader */}
          <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-[#0D121F]/70 border-b border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 transition-colors">
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
              Prompt Studio
            </span>
            <span>
              {chatHistory.length > 0
                ? `${chatHistory.length} messages`
                : "Ready to prompt"}
            </span>
          </div>

          {/* Chat Messages */}
          <ChatHistory
            chatHistory={chatHistory}
            isLoading={isLoading}
            onSelectSuggestion={(prompt) => setCurrentPrompt(prompt)}
          />

          {/* Footer Input Area */}
          <footer className="p-3 md:p-4 bg-white/95 dark:bg-[#0E1422]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/90 sticky bottom-0 z-10 transition-colors duration-200">
            {error && (
              <div className="mb-2.5 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/70 text-red-700 dark:text-red-200 text-xs rounded-xl flex items-center justify-between gap-2 animate-fadeIn">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-500 dark:text-red-400 hover:text-red-800 dark:hover:text-white font-bold px-1"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handlePrompt} className="relative flex items-center">
              <input
                type="text"
                value={currentPrompt}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCurrentPrompt(e.target.value)
                }
                placeholder={
                  presentation
                    ? "Edit presentation (e.g., 'Add statistics to slide 2')"
                    : "Describe presentation topic or outline..."
                }
                className="w-full pl-4 pr-14 py-3.5 bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-500/25 transition-all shadow-inner focus:bg-white dark:focus:bg-slate-900"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-2 p-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:to-red-700 active:scale-95 text-white rounded-xl shadow-md shadow-orange-600/30 border border-orange-400/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center cursor-pointer"
                disabled={isLoading || !currentPrompt.trim()}
                title="Send instruction"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin text-amber-200" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <span>
                {presentation
                  ? "Tip: Ask to rewrite, add, or polish slides"
                  : "Tip: Click a suggestion card to get started"}
              </span>
              <span className="hidden sm:inline font-mono">↵ Enter to send</span>
            </div>
          </footer>
        </section>

        {/* Right Presentation Deck Canvas */}
        <section
          className={`w-full lg:w-[55%] xl:w-[60%] flex flex-col h-full bg-slate-100/60 dark:bg-[#0B0F19] transition-colors duration-200 ${
            activeTab === "preview" ? "flex" : "hidden lg:flex"
          }`}
        >
          <PresentationPreview
            presentation={presentation}
            isLoading={isLoading}
          />
        </section>
      </main>
    </div>
  );
}

