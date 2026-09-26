export async function generateStudyContent(topic) {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.2:latest';

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
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Instructions:
1. Provide 4 to 6 flashcards.
2. Provide 3 to 5 quiz questions.
3. Every quiz question MUST have exactly 4 options.
4. The "answer" string MUST match one of the items in the "options" array exactly.
5. Return ONLY the raw JSON object. Do not include markdown headers or conversational commentary.`;

  console.log(`[Ollama] Sending request to ${baseUrl}/api/generate using model: ${model}`);
  
  let response;
  try {
    response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: 'json'
      })
    });
  } catch (netErr) {
    console.error('[Ollama] Network error connecting to Ollama:', netErr.message);
    throw new Error(`Unable to connect to Ollama server at ${baseUrl}. Ensure Ollama is running.`);
  }

  console.log(`[Ollama] Ollama HTTP status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Ollama] Ollama returned non-OK status:', errorText);
    throw new Error(`Ollama API error (${response.status}): ${errorText}`);
  }

  const resData = await response.json();
  const rawText = resData.response;

  console.log(`[Ollama] Received response from model (length: ${rawText ? rawText.length : 0})`);

  if (!rawText || !rawText.trim()) {
    throw new Error('Ollama model returned an empty response.');
  }

  let cleanedText = rawText.trim();
  if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  let parsedJSON;
  try {
    parsedJSON = JSON.parse(cleanedText);
    console.log('[Ollama] Successfully parsed JSON output.');
  } catch (parseErr) {
    console.error('[Ollama] JSON parsing failed. Snippet of output:', cleanedText.slice(0, 200));
    throw new Error('MALFORMED_JSON');
  }

  return parsedJSON;
}
