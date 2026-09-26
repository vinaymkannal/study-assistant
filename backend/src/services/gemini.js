import { GoogleGenAI } from '@google/genai';

export async function generateStudyContent(topic) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('API_KEY_MISSING');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert study assistant. Generate a high-quality study set for the topic or notes provided below.

Topic / Notes:
"""
${topic}
"""

Return ONLY a JSON object with this exact structure:
{
  "title": "A concise title for the topic",
  "summary": "A 2-3 sentence overview explaining the key concepts",
  "flashcards": [
    {
      "question": "Clear, concept-testing question",
      "answer": "Direct, informative answer"
    }
  ],
  "quiz": [
    {
      "question": "Multiple choice question testing understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B",
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Requirements:
- Generate between 5 to 8 flashcards.
- Generate between 4 to 6 quiz questions.
- Each quiz question MUST have exactly 4 options.
- The "answer" field MUST be identical to one of the strings in the "options" array.
- Do NOT output any markdown formatting or preambles outside the raw JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const rawText = response.text;
    if (!rawText || !rawText.trim()) {
      throw new Error('EMPTY_RESPONSE');
    }

    let cleanedText = rawText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    let parsedJSON;
    try {
      parsedJSON = JSON.parse(cleanedText);
    } catch (parseErr) {
      throw new Error('MALFORMED_JSON');
    }

    return parsedJSON;
  } catch (err) {
    if (err.message === 'API_KEY_MISSING' || err.message === 'EMPTY_RESPONSE' || err.message === 'MALFORMED_JSON') {
      throw err;
    }
    
    const message = err.message || '';
    if (message.includes('API key') || message.includes('401') || message.includes('UNAUTHENTICATED')) {
      throw new Error('INVALID_API_KEY');
    }
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED') || message.includes('Quota')) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    throw new Error(`GEMINI_API_ERROR: ${err.message}`);
  }
}
