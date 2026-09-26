import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="card-panel error-card">
      <div className="error-icon">
        <AlertCircle size={28} />
      </div>
      <h3 className="error-title">Generation Failed</h3>
      <p className="error-desc">{message}</p>
      {onRetry && (
        <button type="button" className="btn-secondary" onClick={onRetry}>
          <RotateCcw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}
