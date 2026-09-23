# AI PPT Generator

A React + Vite application that generates professional presentation slides using AI (Gemini model). Users can chat with the AI to create, edit, and download PowerPoint presentations.

---

## Features

- **AI-powered Slide Generation**: Create a 5-slide professional presentation from a simple topic.
- **Edit Existing Slides**: Ask the AI to modify slides or enhance content.
- **Download PPTX**: Generate and download presentations in PowerPoint format.
- **Real-time Chat Interface**: Keep track of your conversation with the AI.
- **Responsive UI**: Chat on the left, presentation preview on the right.
- **Loader & Feedback**: Shows when AI is processing your request.

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **AI Model**: Google Gemini (via API)
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
**Create a .env file in the root directory with your Gemini API key:**
```bash
env
VITE_GEMINI_API_KEY=your_api_key_here
```
**Start the development server:**
```bash
npm run dev
Open http://localhost:5173 in your browser.
```
---
## Usage

- Enter a topic in the chat input (e.g., "Future of Robotics").
- Press Send to generate the presentation.
- View the slides in the Presentation Preview panel.
- Edit slides by typing instructions in the chat (e.g., "Make slide 3 more detailed").
- Click Download PPTX to save the presentation to your device.

---
## Folder Structure

```
src/
 ├─ components/
 │   ├─ ChatHistory.tsx
 │   ├─ PresentationPreview.tsx
 │   ├─ Icons.tsx
 │   └─ PptxGenScript.tsx
 ├─ constant/
 |   └─ index.ts
 ├─ types/
 │   └─ index.ts
 ├─ utils/
 │   └─ helper.ts
 ├─ App.tsx
 └─ main.tsx
 ```
 ---
## Customization
- **Presentation Style:** Modify PresentationPreview.tsx and generatePPT function to change fonts, colors, layouts, and bullet styles.
- **AI Model:** Change the MODEL constant in constant.ts to use a different Gemini model.
- **Slide Schema:** Adjust presentationSchema in constant.ts to enforce different slide structures.
---
## Notes

-  ***Ensure your Gemini API key has proper permissions for content generation.***
---