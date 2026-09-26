import React from 'react';
import { BookOpen } from 'lucide-react';

export default function SummaryCard({ title, summary }) {
  return (
    <div className="card-panel summary-section">
      <div className="input-label">
        <BookOpen size={20} />
        <span>Overview</span>
      </div>
      <h2 className="summary-title">{title}</h2>
      <p className="summary-body">{summary}</p>
    </div>
  );
}
