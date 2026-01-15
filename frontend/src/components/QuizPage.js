import React, { useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import '../styles/QuizPage.css';

function QuizPage() {
    const {
        state,
        setCurrentQuestion,
        setAnswer,
        updateTimer,
        completeQuiz
    } = useQuiz();

    const { questions, currentQuestion, answers, visitedQuestions, timeRemaining } = state;

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            if (timeRemaining <= 1) {
                clearInterval(timer);
                completeQuiz();
                return;
            }
            updateTimer(timeRemaining - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, updateTimer, completeQuiz]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (optionIndex) => {
        setAnswer(currentQuestion, optionIndex);
    };

    const goToQuestion = (index) => {
        setCurrentQuestion(index);
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            goToQuestion(currentQuestion - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            goToQuestion(currentQuestion + 1);
        }
    };

    const handleSubmit = () => {
        completeQuiz();
    };

    const getQuestionStatus = (index) => {
        if (answers[index] !== undefined) return 'attempted';
        if (visitedQuestions.has(index)) return 'visited';
        return 'remaining';
    };

    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'difficulty-easy';
            case 'medium': return 'difficulty-medium';
            case 'hard': return 'difficulty-hard';
            default: return 'difficulty-medium';
        }
    };

    const currentQ = questions[currentQuestion];
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="quiz-page">
            {/* Header */}
            <header className="quiz-header">
                <div className="header-left">
                    <div className="header-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M9 12h6M9 8h6M9 16h4" />
                        </svg>
                    </div>
                    <span className="header-title">CausalFunnel Quiz Application</span>
                </div>

                <div className="header-right">
                    <div className={`time-badge ${timeRemaining < 300 ? 'time-warning' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        {formatTime(timeRemaining)}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="quiz-content">
                {/* Question Section */}
                <div className="question-section">
                    <div className="question-card">
                        <div className="question-accent"></div>
                        <div className="question-content">
                            {/* Meta Info */}
                            <div className="question-meta">
                                <span className="question-category">{currentQ.category}</span>
                                <span className={`difficulty-badge ${getDifficultyClass(currentQ.difficulty)}`}>
                                    {currentQ.difficulty} difficulty
                                </span>
                            </div>

                            {/* Question Number */}
                            <h2 className="question-number">
                                Question {currentQuestion + 1} <span>/ {questions.length}</span>
                            </h2>

                            {/* Question Text */}
                            <p className="question-text">{currentQ.question}</p>

                            {/* Options */}
                            <div className="options-list">
                                {currentQ.options.map((option, index) => (
                                    <div
                                        key={index}
                                        className={`option-item ${answers[currentQuestion] === index ? 'selected' : ''}`}
                                        onClick={() => handleOptionSelect(index)}
                                    >
                                        <div className="option-radio"></div>
                                        <span className="option-text">{option}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="question-navigation">
                                <button
                                    className="nav-btn nav-btn-prev"
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>
                                <button
                                    className="nav-btn nav-btn-next"
                                    onClick={currentQuestion === questions.length - 1 ? handleSubmit : handleNext}
                                >
                                    {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="quiz-sidebar">
                    <div className="overview-card">
                        <div className="overview-header">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                            </svg>
                            <span className="overview-title">Question Overview</span>
                        </div>

                        {/* Legend */}
                        <div className="overview-legend">
                            <div className="legend-item">
                                <span className="legend-dot attempted"></span>
                                <span>Attempted</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-dot visited"></span>
                                <span>Visited</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-dot remaining"></span>
                                <span>Remaining</span>
                            </div>
                        </div>

                        {/* Question Grid */}
                        <div className="question-grid">
                            {questions.map((_, index) => (
                                <button
                                    key={index}
                                    className={`grid-btn ${getQuestionStatus(index)} ${currentQuestion === index ? 'current' : ''}`}
                                    onClick={() => goToQuestion(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        {/* Progress Info */}
                        <div className="progress-info">
                            <span>{answeredCount} of {questions.length} answered</span>
                        </div>

                        {/* Submit Button */}
                        <button className="submit-btn" onClick={handleSubmit}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                            Submit Quiz
                        </button>
                        <p className="save-note">All progress is saved automatically.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;
