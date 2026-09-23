export interface Slide {
  title: string;
  points: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
}
