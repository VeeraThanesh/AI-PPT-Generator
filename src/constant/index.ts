export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const MODEL = "gemini-3.6-flash";

export const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export const presentationSchema = {
  type: "ARRAY",
  description:
    "An array of slides for a professional presentation. The first slide must be a title slide and the last slide a conclusion.",
  items: {
    type: "OBJECT",
    properties: {
      title: {
        type: "STRING",
        description: "The concise, professional title of the slide.",
      },
      points: {
        type: "ARRAY",
        description:
          "3 to 6 key bullet points for the slide content. Use clear, descriptive language.",
        items: { type: "STRING" },
      },
    },
    required: ["title", "points"],
  },
};
