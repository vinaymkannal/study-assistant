export async function generateStudyContent(topic) {
  const provider = process.env.AI_PROVIDER || 'ollama_local';
  const model = process.env.OLLAMA_MODEL || 'llama3.2:latest';

  let baseUrl;
  const headers = {
    'Content-Type': 'application/json'
  };

  if (provider === 'ollama_cloud') {
    baseUrl = process.env.OLLAMA_CLOUD_BASE_URL || 'https://ollama.com';
    const apiKey = process.env.OLLAMA_CLOUD_API_KEY;
    if (!apiKey) {
      throw new Error('OLLAMA_CLOUD_API_KEY is required when AI_PROVIDER is set to "ollama_cloud".');
    }
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  }

  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const endpoint = `${cleanBaseUrl}/api/generate`;

  const prompt = `You are an expert study assistant. Generate a high-quality study set for the topic below:

Topic: "${topic}"

Respond strictly with a valid JSON object following this exact schema:
{
  "title": "Concise topic title",
  "summary": "Clear 2-3 sentence overview explaining the key concepts",
  "flashcards": [
    {
      "question": "Clear concept-testing question",
      "answer": "Direct, informative answer"
    }
  ],
  "quiz": [
    {
      "question": "Multiple choice question testing understanding",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "Option B",
      "explanation": "Detailed 1-2 sentence explanation of why Option B is the correct choice."
    }
  ]
}

Instructions:
1. Provide 4 to 6 flashcards.
2. Provide 3 to 5 quiz questions.
3. Every quiz question MUST have an "options" array with exactly 4 strings.
4. The "answer" string MUST match one of the items in the "options" array exactly.
5. EVERY quiz question MUST include a mandatory, non-empty "explanation" string explaining why the answer is correct.
6. Return ONLY the raw JSON object. Do not include markdown headers or conversational commentary.`;

  console.log(`[AI Service] Provider: "${provider}" | Model: "${model}" | Endpoint: ${endpoint}`);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: 'json'
      })
    });
  } catch (netErr) {
    console.error(`[AI Service] Network error connecting to provider (${provider}):`, netErr.message);
    throw new Error(`Unable to connect to AI provider (${provider}) at ${cleanBaseUrl}. Please check server connectivity.`);
  }

  console.log(`[AI Service] HTTP Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[AI Service] Provider returned non-OK response:', errorText);
    throw new Error(`AI Provider API error (${response.status}): ${errorText}`);
  }

  const resData = await response.json();
  const rawText = resData.response;

  console.log(`[AI Service] Received response from model (length: ${rawText ? rawText.length : 0})`);

  if (!rawText || !rawText.trim()) {
    throw new Error('AI model returned an empty response.');
  }

  let cleanedText = rawText.trim();
  if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  let parsedJSON;
  try {
    parsedJSON = JSON.parse(cleanedText);
    console.log('[AI Service] Successfully parsed JSON output.');
  } catch (parseErr) {
    console.error('[AI Service] JSON parsing failed. Output snippet:', cleanedText.slice(0, 200));
    throw new Error('MALFORMED_JSON');
  }

  return parsedJSON;
}
