import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateStudyContent } from './services/ollama.js';
import { validateStudySet } from './services/validator.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const frontendUrl = process.env.FRONTEND_URL;
app.use(cors({
  origin: frontendUrl ? [frontendUrl, 'http://localhost:3000'] : '*'
}));

app.use(express.json({ limit: '1mb' }));

app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'Study Assistant API',
    provider: process.env.AI_PROVIDER || 'ollama_local',
    model: process.env.OLLAMA_MODEL || 'llama3.2:latest'
  });
});

app.post('/api/generate', async (req, res, next) => {
  const { topic } = req.body;
  console.log('\n--------------------------------------------------');
  console.log(`[API] POST /api/generate received.`);
  console.log(`[API] Topic received: "${topic}"`);

  try {
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      console.warn('[API] Request rejected: missing topic');
      return res.status(400).json({
        success: false,
        error: 'Please provide a study topic or notes.'
      });
    }

    if (topic.trim().length < 3) {
      console.warn('[API] Request rejected: topic too short');
      return res.status(400).json({
        success: false,
        error: 'Study topic must be at least 3 characters long.'
      });
    }

    console.log('[API] Starting study content generation...');
    const rawData = await generateStudyContent(topic.trim());

    console.log('[API] Validating output structure...');
    const validatedData = validateStudySet(rawData);

    console.log('[API] Validation successful! Sending 200 OK response to frontend.');
    return res.json({
      success: true,
      data: validatedData
    });
  } catch (err) {
    console.error(`[API Error]: ${err.message}`);
    next(err);
  }
});

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Study Assistant backend running on http://${HOST}:${PORT}`);
  console.log(`AI Provider: ${process.env.AI_PROVIDER || 'ollama_local'}`);
  console.log(`Model: ${process.env.OLLAMA_MODEL || 'llama3.2:latest'}`);
});
