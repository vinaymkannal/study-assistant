export function validateStudySet(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Response is not a valid JSON object');
  }

  const { title, summary, flashcards, quiz } = data;

  if (typeof title !== 'string' || !title.trim()) {
    throw new Error('Missing or invalid "title" field in AI output');
  }

  if (typeof summary !== 'string' || !summary.trim()) {
    throw new Error('Missing or invalid "summary" field in AI output');
  }

  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    throw new Error('Field "flashcards" must be a non-empty array');
  }

  flashcards.forEach((card, index) => {
    if (!card || typeof card !== 'object') {
      throw new Error(`Flashcard at index ${index} is invalid`);
    }
    if (typeof card.question !== 'string' || !card.question.trim()) {
      throw new Error(`Flashcard at index ${index} missing valid "question"`);
    }
    if (typeof card.answer !== 'string' || !card.answer.trim()) {
      throw new Error(`Flashcard at index ${index} missing valid "answer"`);
    }
  });

  if (!Array.isArray(quiz) || quiz.length === 0) {
    throw new Error('Field "quiz" must be a non-empty array');
  }

  const normalizedQuiz = quiz.map((q, index) => {
    if (!q || typeof q !== 'object') {
      throw new Error(`Quiz question at index ${index} is invalid`);
    }
    if (typeof q.question !== 'string' || !q.question.trim()) {
      throw new Error(`Quiz question at index ${index} missing valid "question"`);
    }

    // Handle options: array of strings or array of objects with text property
    let cleanOptions = [];
    if (Array.isArray(q.options) && q.options.length === 4) {
      cleanOptions = q.options.map(opt => {
        if (typeof opt === 'string') return opt.trim();
        if (opt && typeof opt === 'object' && typeof opt.text === 'string') return opt.text.trim();
        return String(opt).trim();
      });
    } else {
      throw new Error(`Quiz question at index ${index} must have exactly 4 options`);
    }

    const validOptions = cleanOptions.every(opt => opt.length > 0);
    if (!validOptions) {
      throw new Error(`Quiz question at index ${index} has empty options`);
    }

    // Determine answer string
    let rawAnswer = q.answer;
    if (!rawAnswer && Array.isArray(q.options)) {
      const correctObj = q.options.find(o => typeof o === 'object' && o.isCorrect);
      if (correctObj && correctObj.text) {
        rawAnswer = correctObj.text;
      }
    }

    if (typeof rawAnswer !== 'string' || !rawAnswer.trim()) {
      throw new Error(`Quiz question at index ${index} missing valid "answer"`);
    }

    const trimmedAnswer = rawAnswer.trim();

    // 1. Exact match
    let matchedOption = cleanOptions.find(opt => opt === trimmedAnswer);

    // 2. Case-insensitive match
    if (!matchedOption) {
      matchedOption = cleanOptions.find(opt => opt.toLowerCase() === trimmedAnswer.toLowerCase());
    }

    // 3. Substring match
    if (!matchedOption) {
      matchedOption = cleanOptions.find(opt => trimmedAnswer.toLowerCase().includes(opt.toLowerCase()) || opt.toLowerCase().includes(trimmedAnswer.toLowerCase()));
    }

    // 4. Token prefix / similarity match (e.g., "Long-Job-First" vs "Longest-Job-First")
    if (!matchedOption) {
      const answerTokens = trimmedAnswer.toLowerCase().split(/[\s\-_]+/).filter(Boolean);
      let bestScore = 0;
      let bestMatch = null;
      let secondBestScore = 0;

      cleanOptions.forEach(opt => {
        const optTokens = opt.toLowerCase().split(/[\s\-_]+/).filter(Boolean);
        let score = 0;
        answerTokens.forEach(aToken => {
          if (optTokens.some(oToken => oToken.startsWith(aToken) || aToken.startsWith(oToken))) {
            score += 1;
          }
        });

        if (score > bestScore) {
          secondBestScore = bestScore;
          bestScore = score;
          bestMatch = opt;
        } else if (score > secondBestScore) {
          secondBestScore = score;
        }
      });

      // Require unambiguous best match with at least 50% token overlap
      if (bestMatch && bestScore > secondBestScore && (bestScore / answerTokens.length) >= 0.5) {
        matchedOption = bestMatch;
        console.log(`[Validator] Deterministically normalized answer "${trimmedAnswer}" to option "${matchedOption}"`);
      }
    }

    if (!matchedOption) {
      throw new Error(`Quiz question at index ${index} answer "${trimmedAnswer}" does not match any option [${cleanOptions.join(', ')}]`);
    }

    // Explanation extraction & fallback
    let rawExplanation = q.explanation || q.reason || q.details || q.rationale || q.exp;
    let finalExplanation = (typeof rawExplanation === 'string' && rawExplanation.trim())
      ? rawExplanation.trim()
      : `"${matchedOption}" is the correct answer for this question.`;

    return {
      question: q.question.trim(),
      options: cleanOptions,
      answer: matchedOption,
      explanation: finalExplanation
    };
  });

  return {
    title: title.trim(),
    summary: summary.trim(),
    flashcards: flashcards.map(c => ({
      question: c.question.trim(),
      answer: c.answer.trim()
    })),
    quiz: normalizedQuiz
  };
}
