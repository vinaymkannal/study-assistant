# Deployment Guide - Study Assistant

This guide explains how to deploy the Study Assistant backend to **Render** (or Railway) and the frontend to **Vercel** (or Netlify).

---

## 1. Backend Deployment (Render)

1. Push your project repository to GitHub.
2. Log into [Render.com](https://render.com/) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Name**: `study-assistant-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: `your_actual_gemini_api_key`
   - `PORT`: `5000` (or leave default assigned by Render)
6. Click **Create Web Service**.
7. Copy your deployed backend URL (e.g., `https://study-assistant-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

1. Log into [Vercel.com](https://vercel.com/) and click **Add New** -> **Project**.
2. Select your GitHub repository.
3. Set the following configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_URL`: `https://study-assistant-backend.onrender.com` (use your Render URL from step 1)
5. Click **Deploy**.

---

## 3. Testing Deployed Application

1. Open your Vercel deployment URL.
2. Enter a sample topic (e.g. `Operating Systems CPU Scheduling`).
3. Verify that the request successfully hits your Render backend.
4. Verify flashcards flip, quiz answers evaluate, score calculates, and "Retry Wrong Answers" functions.
