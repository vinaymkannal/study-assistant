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
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Quiz question at index ${index} must have exactly 4 options`);
    }

    const validOptions = q.options.every(opt => typeof opt === 'string' && opt.trim().length > 0);
    if (!validOptions) {
      throw new Error(`Quiz question at index ${index} has empty or non-string options`);
    }

    if (typeof q.answer !== 'string' || !q.answer.trim()) {
      throw new Error(`Quiz question at index ${index} missing valid "answer"`);
    }

    const trimmedAnswer = q.answer.trim();
    const cleanOptions = q.options.map(o => o.trim());

    // Exact match check
    let matchedOption = cleanOptions.find(opt => opt === trimmedAnswer);

    // Case-insensitive fallback
    if (!matchedOption) {
      matchedOption = cleanOptions.find(opt => opt.toLowerCase() === trimmedAnswer.toLowerCase());
    }

    // Substring fallback (e.g., if answer is "B) Round Robin" and option is "Round Robin")
    if (!matchedOption) {
      matchedOption = cleanOptions.find(opt => trimmedAnswer.toLowerCase().includes(opt.toLowerCase()) || opt.toLowerCase().includes(trimmedAnswer.toLowerCase()));
    }

    if (!matchedOption) {
      throw new Error(`Quiz question at index ${index} answer "${trimmedAnswer}" does not match any option [${cleanOptions.join(', ')}]`);
    }

    if (typeof q.explanation !== 'string' || !q.explanation.trim()) {
      throw new Error(`Quiz question at index ${index} missing valid "explanation"`);
    }

    return {
      question: q.question.trim(),
      options: cleanOptions,
      answer: matchedOption,
      explanation: q.explanation.trim()
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
