import React, { useState, useRef } from 'react';
import Header from './components/Header';
import TopicInput from './components/TopicInput';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import SummaryCard from './components/SummaryCard';
import FlashcardDeck from './components/FlashcardDeck';
import QuizSection from './components/QuizSection';
import { generateStudySet } from './services/api';
import { Layers, HelpCircle } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studySet, setStudySet] = useState(null);
  const [activeTab, setActiveTab] = useState('flashcards');

  const abortControllerRef = useRef(null);

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setStudySet(null);

    try {
      const data = await generateStudySet(topic.trim(), controller.signal);
      setStudySet(data);
      setActiveTab('flashcards');
    } catch (err) {
      if (err.isAborted) return;
      setError(err.message || 'An error occurred while generating study materials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />

      <TopicInput
        topic={topic}
        setTopic={setTopic}
        onGenerate={handleGenerate}
        loading={loading}
      />

      {loading && <LoadingState />}

      {error && !loading && (
        <ErrorState message={error} onRetry={handleGenerate} />
      )}

      {studySet && !loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <SummaryCard title={studySet.title} summary={studySet.summary} />

          <div className="tab-navigation">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
              onClick={() => setActiveTab('flashcards')}
            >
              <Layers size={18} /> Flashcards ({studySet.flashcards.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <HelpCircle size={18} /> Quiz ({studySet.quiz.length} Questions)
            </button>
          </div>

          {activeTab === 'flashcards' ? (
            <FlashcardDeck cards={studySet.flashcards} />
          ) : (
            <QuizSection quizData={studySet.quiz} />
          )}
        </div>
      )}
    </div>
  );
}
