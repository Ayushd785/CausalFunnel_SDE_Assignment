import React from 'react';
import { useQuiz } from '../context/QuizContext';
import '../styles/ReportPage.css';

function ReportPage() {
    const { state, getResults, resetQuiz } = useQuiz();
    const { email, timeTaken } = state;

    const {
        results,
        correctCount,
        incorrectCount,
        totalQuestions,
        scorePercent,
        passed
    } = getResults();

    const handleHome = () => {
        resetQuiz();
    };

    const handleRetake = () => {
        resetQuiz();
    };

    // Get user's first name or email prefix for display
    const displayName = email.split('@')[0] || 'Candidate';

    // Format time taken
    const formatTimeTaken = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins === 0) return `${secs} sec`;
        return `${mins} min ${secs} sec`;
    };

    return (
        <div className="report-page">
            {/* Header */}
            <header className="report-header">
                <div className="report-header-left">
                    <div className="report-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M9 12h6M9 8h6M9 16h4" />
                        </svg>
                    </div>
                    <span className="report-header-title">Quiz Results</span>
                </div>

                <div className="report-header-right">
                    <div className="user-info">
                        <span>Welcome, {displayName}</span>
                        <div className="user-avatar">{displayName.charAt(0).toUpperCase()}</div>
                    </div>
                    <button className="logout-btn" onClick={handleHome}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="report-content">
                {/* Summary Card */}
                <div className="summary-card">
                    <div className="summary-left">
                        <div className={`passed-badge ${!passed ? 'failed-badge' : ''}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {passed ? (
                                    <path d="M20 6L9 17l-5-5" />
                                ) : (
                                    <path d="M18 6L6 18M6 6l12 12" />
                                )}
                            </svg>
                            {passed ? 'Passed' : 'Failed'}
                        </div>
                        <h1 className="summary-title">Quiz Complete</h1>
                        <p className="summary-subtitle">
                            Review your detailed performance breakdown below.
                        </p>
                    </div>

                    <div className="summary-middle">
                        <div
                            className="score-circle"
                            style={{ '--score-percent': `${scorePercent * 3.6}deg` }}
                        >
                            <span className="score-value">{scorePercent}%</span>
                        </div>
                        <span className="score-label">Score</span>
                    </div>

                    <div className="summary-right">
                        <div className="stat-item">
                            <span className="stat-label">Total Questions</span>
                            <span className="stat-value">{totalQuestions}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Correct</span>
                            <span className="stat-value correct">{correctCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Incorrect</span>
                            <span className="stat-value incorrect">{incorrectCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Time Taken</span>
                            <span className="stat-value">{formatTimeTaken(timeTaken)}</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Analysis */}
                <div className="analysis-section">
                    <div className="analysis-header">
                        <h2 className="analysis-title">Detailed Analysis</h2>
                        <div className="legend">
                            <span className="legend-correct">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                                Correct
                            </span>
                            <span className="legend-incorrect">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                                Incorrect
                            </span>
                        </div>
                    </div>

                    <table className="analysis-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Question</th>
                                <th>Your Answer</th>
                                <th>Correct Answer</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={result.id}>
                                    <td>
                                        <span className={`row-number ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td>{result.question}</td>
                                    <td>
                                        <span className={result.isCorrect ? 'answer-correct' : 'answer-incorrect'}>
                                            {result.userAnswer}
                                        </span>
                                    </td>
                                    <td>{result.correctAnswer}</td>
                                    <td>
                                        <div className="status-icon">
                                            {result.isCorrect ? (
                                                <div className="status-correct">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="status-incorrect">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 6L6 18M6 6l12 12" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="report-actions">
                <button className="home-btn" onClick={handleHome}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        <path d="M9 22V12h6v10" />
                    </svg>
                    Home
                </button>
                <button className="retake-btn" onClick={handleRetake}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 4v6h-6M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                    </svg>
                    Retake Quiz
                </button>
            </div>
        </div>
    );
}

export default ReportPage;
