import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import '../styles/StartPage.css';

function StartPage() {
    const [email, setEmail] = useState('');
    const { startQuiz } = useQuiz();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            startQuiz(email);
        }
    };

    const isValidEmail = email.includes('@') && email.includes('.');

    return (
        <div className="start-page">
            <div className="start-card">
                <div className="card-accent"></div>

                <div className="card-content">
                    {/* Quiz Icon */}
                    <div className="quiz-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M9 12h6M9 8h6M9 16h4" />
                        </svg>
                    </div>

                    <h1 className="card-title">CausalFunnel Quiz Application</h1>
                    <p className="card-subtitle">
                        Please identify yourself to start the quiz.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="M22 6l-10 7L2 6" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    className="email-input"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="start-button"
                            disabled={!isValidEmail}
                        >
                            Start Quiz
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </form>

                    <div className="card-footer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        <span>Time limit: 30 mins</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StartPage;
