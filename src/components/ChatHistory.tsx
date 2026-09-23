import type { ChatMessage } from "../types";
import { Loader, Zap } from "./Icons";

interface Props {
  chatHistory: ChatMessage[];
  isLoading: boolean;
}

export const ChatHistory = ({ chatHistory, isLoading }: Props) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {chatHistory.length === 0 ? (
        <div className="text-center text-gray-400 p-8">
          <Zap className="w-8 h-8 mx-auto mb-2 text-amber-400" />
          <p className="font-semibold">Start your presentation here!</p>
          <p className="text-sm">
            e.g., "Create a 5-slide presentation on the future of AI in
            medicine."
          </p>
        </div>
      ) : (
        chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xl p-3 rounded-xl shadow-lg ${
                msg.role === "user"
                  ? "bg-amber-600 text-white rounded-br-none"
                  : "bg-gray-700 text-white rounded-tl-none"
              }`}
            >
              <p className="text-sm font-medium mb-1 opacity-70">
                {msg.role === "user" ? "You" : "AI"}
              </p>
              <p>{msg.content}</p>
            </div>
          </div>
        ))
      )}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-xl p-3 rounded-xl shadow-lg bg-gray-700 text-white rounded-tl-none flex items-center">
            <Loader className="w-5 h-5 mr-2 animate-spin text-amber-400" />
            <p>AI is processing the request...</p>
          </div>
        </div>
      )}
    </div>
  </div>
);
