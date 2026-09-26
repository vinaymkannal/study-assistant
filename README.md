# Study Assistant

Study Assistant is a full-stack learning platform that converts any free-form study topic or notes into structured 3D flashcards and multiple-choice quizzes using Google Gemini AI.

---

## 🚀 Features

- **Topic to Study Set**: Input any lecture notes, concept name, or topic to instantly generate tailored study materials.
- **Interactive 3D Flashcards**: Flip cards with smooth CSS transitions, navigate with Next/Previous, and use keyboard shortcuts (`Left`/`Right` arrow keys to navigate, `Space`/`Enter` to flip).
- **Multiple-Choice Quizzes**: Test knowledge with 1-question-at-a-time flow, immediate feedback, and detailed explanations.
- **Retry Wrong Answers**: Practice missed questions without re-querying the LLM (zero API overhead).
- **Robust Error Handling**: Server-side JSON validation prevents invalid, empty, or malformed AI output from breaking the UI.
- **Race Condition Prevention**: Built-in request cancellation using `AbortController` ensures newer requests overwrite pending older ones seamlessly.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), JavaScript (ES6+), React Hooks, Lucide Icons, Modern Vanilla CSS
- **Backend**: Node.js, Express.js, Cors, Dotenv
- **AI Provider**: Google Gemini API (`@google/genai` SDK)

---

## 🏗️ Architecture

```text
[ React Frontend ] 
       │
       ▼  (POST /api/generate with AbortController)
[ Express Backend ]
       │
       ▼  (Google Gemini API prompt + JSON Schema)
[ Google Gemini Model ]
       │
       ▼  (Raw JSON output)
[ Backend Validator ]  ──(If invalid)──> Returns Standardized 4xx/5xx Error
       │
       ▼  (Validated JSON structure)
[ React UI Rendering ] (Flashcards & Quiz Components)
```

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Start the backend server:

```bash
npm start
```

Backend will run on `http://localhost:5000`.

### 2. Setup Frontend

Open a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
| :--- | :--- |
| `PORT` | Port number for Express server (default: `5000`) |
| `GEMINI_API_KEY` | Secret Google Gemini API key |

### Frontend (`frontend/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL of the backend API server |

---

## 🛡️ Failure & Error Handling

- **Malformed JSON**: Caught on the backend, sanitized of markdown formatting, and safely parsed. If JSON parsing fails, returns a `502 Bad Gateway` error with a friendly retry prompt.
- **Wrong JSON Shape**: Validated by `backend/src/services/validator.js`. Verifies titles, summary text, flashcard arrays, quiz option lengths (must be 4), and option matching before reaching the frontend.
- **API Errors & Rate Limits**: Distinguishes between missing keys (`500`), invalid credentials (`401`), rate limit exhaustion (`429`), and network drops (`502`), showing user-focused messages.
- **Stale Responses**: Handled via `AbortController` in `frontend/src/services/api.js`. Rapid consecutive requests cancel previous in-flight requests.

---

## 🤖 AI Usage Note

AI tools (specifically Gemini 3.6 Flash) were utilized during development for code generation and refactoring assistance. All resulting code, server routes, validation rules, and React component structures were reviewed, verified, and understood by the author.

---

## ⏱️ Development Time & Limitations

- **Time Spent**: ~4 hours (Architecture design, prompt engineering, validation rules, CSS animations, and docs).
- **Known Limitations**: Gemini free tier rate limits (15 RPM); long inputs may require truncated prompt payloads depending on context limits.

---

## 📦 Suggested Git Commit Sequence

1. `init: Initialize React Vite frontend and Express backend structure`
2. `feat(backend): Implement Gemini API client and strict JSON validator`
3. `feat(frontend): Create TopicInput, LoadingState, and ErrorState components`
4. `feat(frontend): Implement 3D interactive FlashcardDeck with keyboard controls`
5. `feat(frontend): Implement QuizSection with score calculation and Retry Wrong Answers`
6. `feat(frontend): Add AbortController support for request cancellation`
7. `style: Refine dark violet theme, glassmorphism UI, and mobile layouts`
8. `docs: Add README.md, DEPLOYMENT.md, and environment variable templates`
