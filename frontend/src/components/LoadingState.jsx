import React from 'react';

export default function LoadingState() {
  return (
    <div className="card-panel loading-card">
      <div className="spinner" />
      <h3 className="loading-title">Creating your study set...</h3>
      <p className="loading-subtext">
        Analyzing your topic, generating key flashcards, and crafting quiz questions.
      </p>
    </div>
  );
}
