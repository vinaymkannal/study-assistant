import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-badge">
        <Sparkles size={16} />
        <span>AI-Powered Learning Tool</span>
      </div>
      <h1 className="header-title">Study Assistant</h1>
      <p className="header-description">
        Transform any study topic or notes into interactive 3D flashcards and multiple-choice quizzes in seconds.
      </p>
    </header>
  );
}
