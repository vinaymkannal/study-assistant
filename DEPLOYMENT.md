# Deployment Guide - Study Assistant (Render)

This guide provides step-by-step instructions for deploying the Study Assistant full-stack application on **Render**.

---

## Architecture Overview

- **Backend**: Render Web Service (Node.js Express API)
- **Frontend**: Render Static Site (React Vite application)

---

## Part 1: Deploy Backend (Render Web Service)

1. Push your repository to **GitHub**.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Fill in the service configuration:
   - **Name**: `study-assistant-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Scroll to **Environment Variables** and add:

| Key | Value | Note |
| :--- | :--- | :--- |
| `AI_PROVIDER` | `ollama_cloud` | Specifies cloud provider mode |
| `OLLAMA_CLOUD_BASE_URL` | `https://ollama.com` | Base URL for Ollama Cloud API |
| `OLLAMA_CLOUD_API_KEY` | `your_server_side_secret_key` | Secret server-side API key |
| `OLLAMA_MODEL` | `llama3.2:latest` | Target cloud model |
| `FRONTEND_URL` | `https://study-assistant-frontend.onrender.com` | Allowed CORS origin |

6. Click **Create Web Service**.
7. Once deployed, copy your backend service URL (e.g. `https://study-assistant-backend.onrender.com`).

---

## Part 2: Deploy Frontend (Render Static Site)

1. In Render Dashboard, click **New +** -> **Static Site**.
2. Connect the same GitHub repository.
3. Fill in the static site configuration:
   - **Name**: `study-assistant-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment Variables**, add:

| Key | Value | Note |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://study-assistant-backend.onrender.com` | Deployed backend URL |

5. Click **Create Static Site**.

---

## Part 3: Verification

1. Test backend health check:
   ```http
   GET https://study-assistant-backend.onrender.com/api/health
   ```
   Should return `{ "status": "ok", "service": "Study Assistant API", ... }`.

2. Open your deployed static site (`https://study-assistant-frontend.onrender.com`).
3. Enter a study topic (e.g. `Operating Systems Process Scheduling`) and click **Generate Study Set**.
4. Open browser DevTools -> Network tab to verify requests target:
   `POST https://study-assistant-backend.onrender.com/api/generate`
