"use client";
import { useState, useCallback, type ChangeEvent, type FormEvent } from "react";
import { ChatHistory } from "./components/ChatHistory";
import { PresentationPreview } from "./components/PresentationPreview";
import type { ChatMessage, Slide } from "./types";
import { fetchWithExponentialBackoff, uuid } from "./utils/helper";
import { Send } from "./components/Icons";
import { API_URL, presentationSchema } from "./constant";

export default function App() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [presentation, setPresentation] = useState<Slide[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Chat panel */}
      <div className="w-1/2 flex flex-col border-r border-gray-800">
        <ChatHistory chatHistory={chatHistory} isLoading={isLoading} />

        <footer className="p-4 border-t border-gray-700 bg-gray-900 sticky bottom-0 z-10">
          <form onSubmit={handlePrompt} className="flex gap-2">
            <input
              type="text"
              value={currentPrompt}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCurrentPrompt(e.target.value)
              }
              placeholder={
                presentation
                  ? "Edit or enhance presentation (e.g., 'Make slide 3 more detailed')"
                  : "Start with a topic (e.g., 'Future of Robotics')"
              }
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-amber-500 focus:border-amber-500 transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-3 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-xl disabled:opacity-50 transition"
              disabled={isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          {error && (
            <div className="mt-2 p-2 bg-red-800 text-white text-xs rounded-lg animate-pulse">
              Error: {error}
            </div>
          )}
        </footer>
      </div>

      {/* Presentation panel */}
      <div className="w-1/2 h-screen overflow-y-auto">
        <PresentationPreview
          presentation={presentation}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
