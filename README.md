# AI PPT Generator

A React + Vite application that generates professional presentation slides using AI (Gemini model). Users can chat with the AI to create, edit, and download PowerPoint presentations.

---

## Features

- **AI-powered Slide Generation**: Create a 5-slide professional presentation from a simple topic or prompt.
- **Interactive Dark / Light Theme Toggle**: Click the project title icon in the navbar to toggle between dark and light modes, with automatic `localStorage` persistence and zero-flicker loading.
- **PowerPoint-Inspired Design System**: Cohesive presentation aesthetic themed with signature PowerPoint warm orange and amber hues, micro-animations, and glassmorphism.
- **Curated Starter Prompts**: Ready-to-use executive and business presentation templates to get started in one click.
- **Edit Existing Slides**: Conversational refinement to modify, expand, or rewrite slides in real time.
- **Download PPTX**: Export fully editable presentations to PowerPoint (`.pptx`) format with matching slide master styles.
- **Copy Slide Content**: One-click slide clipboard export for rapid notes and sharing.
- **Responsive Dual-Pane UI**: Studio prompt chat on the left, live slide deck canvas on the right with mobile tab switching.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
- **AI Model**: Google Gemini (via Gemini API)
- **Presentation Library**: [PptxGenJS](https://gitbrent.github.io/PptxGenJS/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

---

## Installation

**Clone the repository:**
```bash
git clone https://github.com/VeeraThanesh/AI-PPT-Generator.git
cd AI-PPT-Generator
```

**Install dependencies:**
```bash
npm install
```

**Create a `.env` file in the root directory with your Gemini API key:**
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Start the development server:**
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Usage

1. **Choose Theme**: Click the logo icon in the top navbar anytime to switch between Dark and Light themes.
2. **Generate Presentation**: Enter a topic in the chat input or click one of the curated starter cards (e.g., "Startup Pitch Deck").
3. **Review Slides**: The live deck preview renders instantly on the right-hand canvas.
4. **Refine & Polish**: Ask the AI in the chat to edit slides (e.g., "Add statistics to slide 2").
5. **Download**: Click **Download PPTX** to save the presentation to your computer.

---

## Folder Structure

```
AI-PPT-Generator/
 ├─ public/
 │   └─ vite.png                # App icon & favicon
 ├─ src/
 │   ├─ components/
 │   │   ├─ ChatHistory.tsx     # Studio chat & starter suggestions
 │   │   ├─ Icons.tsx           # React icons bundle
 │   │   └─ PresentationPreview.tsx # Deck preview & PPTX export
 │   ├─ constant/
 │   │   └─ index.ts            # API URL, model config & slide schema
 │   ├─ types/
 │   │   └─ index.ts            # TypeScript interfaces
 │   ├─ utils/
 │   │   ├─ helper.ts           # Fetch backoff & UUID utilities
 │   │   └─ useTheme.ts         # Dark/Light theme state & storage hook
 │   ├─ App.tsx                 # Main layout & chat state
 │   ├─ index.css               # Tailwind & custom scrollbar styles
 │   └─ main.tsx                # React entry point
 ├─ index.html                  # HTML shell & theme preloader
 └─ package.json
```

---

## Customization

- **Theme & Colors:** Theme variables and dark mode variants are defined in `src/index.css` and managed via `src/utils/useTheme.ts`.
- **Presentation Style:** Modify `PresentationPreview.tsx` and the `generatePPT` slide master function to adjust fonts, background colors, and accent stripes.
- **AI Model:** Change the `MODEL` constant in `src/constant/index.ts` to use any supported Gemini model.
- **Slide Schema:** Adjust `presentationSchema` in `src/constant/index.ts` to enforce custom slide properties.

---

## Notes

- ***Ensure your Gemini API key has proper permissions for content generation.***