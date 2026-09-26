# Study Assistant

Study Assistant is a full-stack learning platform that converts any free-form study topic or notes into structured 3D flashcards and multiple-choice quizzes using Ollama AI (`llama3.2:latest` locally or Ollama Cloud in production).

---

## 🚀 Features

- **Topic to Study Set**: Input any lecture notes or concept topic to generate structured study materials.
- **Interactive 3D Flashcards**: Flip cards with smooth CSS transitions, navigate with Next/Previous, or use keyboard shortcuts (`Left`/`Right` arrow keys to navigate, `Space`/`Enter` to flip).
- **Multiple-Choice Quizzes**: Test understanding with single question steps, immediate feedback, and explanations.
- **Retry Wrong Answers**: Re-run missed quiz questions directly in-memory without calling the AI API again.
- **Dual AI Provider Architecture**: Switch seamlessly between local Ollama (`AI_PROVIDER=ollama_local`) for offline development and Ollama Cloud (`AI_PROVIDER=ollama_cloud`) for production hosting.
- **Request Cancellation**: Built-in `AbortController` support guarantees that stale requests never overwrite newer user inputs.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), JavaScript (ES6+), React Hooks, Lucide Icons, Modern Vanilla CSS
- **Backend**: Node.js, Express.js, Cors, Dotenv
- **AI Provider**: Ollama (Local Server / Ollama Cloud API)

---

## 🏗️ Architecture

```text
[ React Frontend ] 
       │
       ▼  (POST /api/generate with AbortController)
[ Express Backend ]
       │
       ├─► (AI_PROVIDER=ollama_local) ──► Local Ollama Server (http://localhost:11434)
       │
       └─► (AI_PROVIDER=ollama_cloud) ──► Ollama Cloud API (https://ollama.com + Bearer Key)
       │
       ▼  (Raw JSON output)
[ Backend Validator ] ──► Returns Standardized Validated JSON
```

---

## 🔒 Security & Secrets Management

- **API Keys are Server-Side Only**: `OLLAMA_CLOUD_API_KEY` is stored strictly in backend environment variables (`backend/.env` or Render environment settings).
- **No Client Exposure**: Frontend JavaScript and Vite bundles never contain API keys or secret credentials.

---

## 💻 Local Development Workflow

### Prerequisites
- Node.js (v18 or higher)
- [Ollama](https://ollama.com) installed locally with model `llama3.2:latest` (`ollama run llama3.2:latest`)

### 1. Setup Backend

```bash
cd backend
npm install
```

Ensure `backend/.env` contains:
```env
PORT=5000
AI_PROVIDER=ollama_local
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:latest
FRONTEND_URL=http://localhost:3000
```

Start the backend server:
```bash
npm start
```
Backend will run on `http://localhost:5000`.

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Ensure `frontend/.env` contains:
```env
VITE_API_URL=http://localhost:5000
```

Start Vite dev server:
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`.

---

## ☁️ Production Configuration (Render)

### Backend Environment Variables (Render Web Service)
| Variable | Value / Description |
| :--- | :--- |
| `PORT` | Assigned dynamically by Render |
| `AI_PROVIDER` | `ollama_cloud` |
| `OLLAMA_CLOUD_BASE_URL` | `https://ollama.com` |
| `OLLAMA_CLOUD_API_KEY` | Secret Cloud API Key |
| `OLLAMA_MODEL` | Cloud model name |
| `FRONTEND_URL` | `https://<your-render-frontend>.onrender.com` |

### Frontend Environment Variables (Render Static Site)
| Variable | Value / Description |
| :--- | :--- |
| `VITE_API_URL` | `https://<your-render-backend>.onrender.com` |

---

## ⚙️ Health Check Endpoint

```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "service": "Study Assistant API",
  "provider": "ollama_local",
  "model": "llama3.2:latest"
}
```
