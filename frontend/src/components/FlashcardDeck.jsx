import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

export default function FlashcardDeck({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="flashcards-container">
      <div className="card-counter-badge">
        Card {currentIndex + 1} of {cards.length}
      </div>

      <div
        className="flip-card-wrapper"
        onClick={() => setIsFlipped(!isFlipped)}
        tabIndex={0}
        role="button"
        aria-label={`Flashcard ${currentIndex + 1}: ${isFlipped ? 'Answer' : 'Question'}. Click or press space to flip.`}
      >
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          <div className="flip-card-front">
            <span className="card-tag">Question</span>
            <p className="card-content-text">{currentCard.question}</p>
            <span className="flip-hint">
              <RotateCw size={14} /> Click to reveal answer
            </span>
          </div>
          <div className="flip-card-back">
            <span className="card-tag">Answer</span>
            <p className="card-content-text">{currentCard.answer}</p>
            <span className="flip-hint">
              <RotateCw size={14} /> Click to return to question
            </span>
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button
          type="button"
          className="btn-secondary"
          onClick={handlePrev}
          aria-label="Previous flashcard"
        >
          <ChevronLeft size={18} /> Previous
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RotateCw size={16} /> Flip Card
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={handleNext}
          aria-label="Next flashcard"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
