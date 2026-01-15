import React, { useState, useEffect, useRef } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import StartPage from './components/StartPage';
import QuizPage from './components/QuizPage';
import ReportPage from './components/ReportPage';
import './styles/App.css';

function AppContent() {
  const { state } = useQuiz();
  const { quizStarted, quizCompleted } = state;
  const [isLoading, setIsLoading] = useState(false);
  const prevPageRef = useRef('start');

  const getPageKey = () => {
    if (quizCompleted) return 'report';
    if (quizStarted) return 'quiz';
    return 'start';
  };

  const currentPage = getPageKey();

  // Show loading screen on page change
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        prevPageRef.current = currentPage;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const renderPage = () => {
    if (quizCompleted) {
      return <ReportPage />;
    }
    if (quizStarted) {
      return <QuizPage />;
    }
    return <StartPage />;
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loader">
            <div className="box box-1">
              <div className="side-left"></div>
              <div className="side-right"></div>
              <div className="side-top"></div>
            </div>
            <div className="box box-2">
              <div className="side-left"></div>
              <div className="side-right"></div>
              <div className="side-top"></div>
            </div>
            <div className="box box-3">
              <div className="side-left"></div>
              <div className="side-right"></div>
              <div className="side-top"></div>
            </div>
            <div className="box box-4">
              <div className="side-left"></div>
              <div className="side-right"></div>
              <div className="side-top"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div key={currentPage} className="page-transition">
        {renderPage()}
      </div>
    </div>
  );
}

function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}

export default App;
