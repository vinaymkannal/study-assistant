import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

export default function QuizSection({ quizData }) {
  const [activeQuestions, setActiveQuestions] = useState(quizData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRetryMode, setIsRetryMode] = useState(false);

  if (!activeQuestions || activeQuestions.length === 0) return null;

  const currentQ = activeQuestions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / activeQuestions.length) * 100);

  const handleSelect = (option) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption.trim() === currentQ.answer.trim();
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => [
        ...prev,
        {
          question: currentQ.question,
          userAnswer: selectedOption,
          correctAnswer: currentQ.answer,
          explanation: currentQ.explanation,
          originalItem: currentQ
        }
      ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRetryWrong = () => {
    const wrongQuestionsList = wrongAnswers.map((w) => w.originalItem);
    setActiveQuestions(wrongQuestionsList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setWrongAnswers([]);
    setIsCompleted(false);
    setIsRetryMode(true);
  };

  const handleRestartFull = () => {
    setActiveQuestions(quizData);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setWrongAnswers([]);
    setIsCompleted(false);
    setIsRetryMode(false);
  };

  if (isCompleted) {
    const totalQ = activeQuestions.length;
    const isPerfect = score === totalQ;

    return (
      <div className="card-panel quiz-results-card">
        <Award size={48} color="#8b5cf6" />
        <h2>{isRetryMode ? 'Retry Quiz Completed!' : 'Quiz Completed!'}</h2>
        <div className="score-badge">
          Score: {score} / {totalQ}
        </div>

        <p className="loading-subtext">
          {isPerfect
            ? 'Outstanding job! You answered all questions correctly!'
            : `You answered ${score} correctly and missed ${wrongAnswers.length}.`}
        </p>

        {wrongAnswers.length > 0 && (
          <div className="results-breakdown">
            <h4 className="breakdown-title">Review Missed Questions:</h4>
            {wrongAnswers.map((item, idx) => (
              <div key={idx} className="wrong-item">
                <div className="wrong-q">{item.question}</div>
                <div className="wrong-a">Your answer: {item.userAnswer}</div>
                <div className="correct-a">Correct answer: {item.correctAnswer}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {wrongAnswers.length > 0 && (
            <button type="button" className="btn-primary" onClick={handleRetryWrong}>
              <RotateCcw size={18} /> Retry Wrong Answers
            </button>
          )}

          <button type="button" className="btn-secondary" onClick={handleRestartFull}>
            Restart Full Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-panel quiz-container">
      <div className="quiz-header">
        <span className="quiz-progress-text">
          Question {currentIndex + 1} of {activeQuestions.length} {isRetryMode && '(Retry Mode)'}
        </span>
        <span className="char-counter">{progressPercent}% Completed</span>
      </div>

      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <h3 className="quiz-question-text">{currentQ.question}</h3>

      <div className="quiz-options-grid">
        {currentQ.options.map((option, idx) => {
          let stateClass = '';
          if (isSubmitted) {
            if (option.trim() === currentQ.answer.trim()) {
              stateClass = 'correct';
            } else if (option === selectedOption) {
              stateClass = 'incorrect';
            }
          } else if (option === selectedOption) {
            stateClass = 'selected';
          }

          return (
            <button
              key={idx}
              type="button"
              className={`quiz-option-btn ${stateClass}`}
              onClick={() => handleSelect(option)}
              disabled={isSubmitted}
            >
              <span>{option}</span>
              {isSubmitted && option.trim() === currentQ.answer.trim() && (
                <CheckCircle2 size={18} color="#10b981" />
              )}
              {isSubmitted && option === selectedOption && option.trim() !== currentQ.answer.trim() && (
                <XCircle size={18} color="#ef4444" />
              )}
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div className="explanation-box">
          <div className="explanation-title">Explanation</div>
          <p className="explanation-text">{currentQ.explanation}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        {!isSubmitted ? (
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit Answer
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={handleNextQuestion}>
            {currentIndex + 1 < activeQuestions.length ? 'Next Question' : 'View Final Results'}
          </button>
        )}
      </div>
    </div>
  );
}
