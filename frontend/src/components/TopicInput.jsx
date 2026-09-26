import React from 'react';
import { Sparkles, BookMarked } from 'lucide-react';

const SAMPLES = [
  'Operating Systems Process Scheduling',
  'DBMS Normalization & BCNF',
  'React Hooks & State Management'
];

export default function TopicInput({ topic, setTopic, onGenerate, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (topic.trim().length >= 3 && !loading) {
        onGenerate();
      }
    }
  };

  return (
    <div className="card-panel input-section">
      <div className="input-header">
        <label htmlFor="topic-input" className="input-label">
          <BookMarked size={20} />
          Enter Topic or Paste Notes
        </label>
        <span className="char-counter">{topic.length} characters</span>
      </div>

      <textarea
        id="topic-input"
        className="topic-textarea"
        placeholder="Enter a study topic (e.g. 'Operating Systems CPU Scheduling') or paste your lecture notes here..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <div className="sample-chips">
        <span className="chip-label">Try an example:</span>
        {SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            className="chip-btn"
            onClick={() => setTopic(sample)}
            disabled={loading}
          >
            {sample}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn-primary"
        onClick={onGenerate}
        disabled={loading || topic.trim().length < 3}
      >
        <Sparkles size={18} />
        {loading ? 'Creating Study Set...' : 'Generate Study Set'}
      </button>
    </div>
  );
}
