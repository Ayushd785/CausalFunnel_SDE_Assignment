import React, { createContext, useContext, useReducer } from 'react';

const API_URL = 'http://localhost:5000/api/quiz';

const QuizContext = createContext();

const initialState = {
    email: '',
    quizId: null,
    questions: [],
    questionsWithAnswers: [],
    currentQuestion: 0,
    answers: {},
    visitedQuestions: new Set([0]),
    timeRemaining: 30 * 60,
    timeTaken: 0,
    quizStarted: false,
    quizCompleted: false,
    loading: false,
    error: null
};

const quizReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload, error: null };

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };

        case 'START_QUIZ':
            return {
                ...state,
                email: action.payload.email,
                quizId: action.payload.quizId,
                questions: action.payload.questions,
                questionsWithAnswers: action.payload.questionsWithAnswers || [],
                quizStarted: true,
                currentQuestion: 0,
                answers: {},
                visitedQuestions: new Set([0]),
                timeRemaining: action.payload.timeLimit || 30 * 60,
                timeTaken: 0,
                quizCompleted: false,
                loading: false
            };

        case 'SET_CURRENT_QUESTION':
            const newVisited = new Set(state.visitedQuestions);
            newVisited.add(action.payload);
            return {
                ...state,
                currentQuestion: action.payload,
                visitedQuestions: newVisited
            };

        case 'SET_ANSWER':
            return {
                ...state,
                answers: {
                    ...state.answers,
                    [action.payload.questionIndex]: action.payload.answerIndex
                }
            };

        case 'UPDATE_TIMER':
            return { ...state, timeRemaining: action.payload };

        case 'COMPLETE_QUIZ':
            return {
                ...state,
                quizCompleted: true,
                timeTaken: (30 * 60) - state.timeRemaining,
                questionsWithAnswers: action.payload?.questionsWithAnswers || state.questionsWithAnswers
            };

        case 'RESET_QUIZ':
            return {
                ...initialState,
                visitedQuestions: new Set([0])
            };

        default:
            return state;
    }
};

export const QuizProvider = ({ children }) => {
    const [state, dispatch] = useReducer(quizReducer, {
        ...initialState,
        visitedQuestions: new Set([0])
    });

    const startQuiz = async (email) => {
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const response = await fetch(`${API_URL}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Failed to start quiz');
            }

            const data = await response.json();

            dispatch({
                type: 'START_QUIZ',
                payload: {
                    email,
                    quizId: data.quizId,
                    questions: data.questions,
                    timeLimit: data.timeLimit
                }
            });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const setCurrentQuestion = (index) => {
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: index });
    };

    const setAnswer = (questionIndex, answerIndex) => {
        dispatch({ type: 'SET_ANSWER', payload: { questionIndex, answerIndex } });
    };

    const updateTimer = (seconds) => {
        dispatch({ type: 'UPDATE_TIMER', payload: seconds });
    };

    const completeQuiz = async () => {
        const timeTaken = (30 * 60) - state.timeRemaining;

        try {
            const response = await fetch(`${API_URL}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: state.quizId,
                    answers: state.answers,
                    timeTaken
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit quiz');
            }

            const data = await response.json();

            // Store results for getResults
            dispatch({
                type: 'COMPLETE_QUIZ',
                payload: { questionsWithAnswers: data.results }
            });
        } catch (error) {
            // Still complete quiz even if API fails
            dispatch({ type: 'COMPLETE_QUIZ', payload: {} });
        }
    };

    const resetQuiz = () => {
        dispatch({ type: 'RESET_QUIZ' });
    };

    const getResults = () => {
        const results = state.questionsWithAnswers.length > 0
            ? state.questionsWithAnswers
            : state.questions.map((q, index) => {
                const userAnswerIndex = state.answers[index];
                return {
                    id: q.id,
                    question: q.question,
                    category: q.category,
                    userAnswer: userAnswerIndex !== undefined ? q.options[userAnswerIndex] : 'Not answered',
                    correctAnswer: 'N/A',
                    isCorrect: false,
                    wasAnswered: userAnswerIndex !== undefined
                };
            });

        const correctCount = results.filter(r => r.isCorrect).length;
        const scorePercent = Math.round((correctCount / state.questions.length) * 100);

        return {
            results,
            correctCount,
            incorrectCount: state.questions.length - correctCount,
            answeredCount: results.filter(r => r.wasAnswered).length,
            totalQuestions: state.questions.length,
            scorePercent,
            passed: scorePercent >= 50
        };
    };

    const value = {
        state,
        startQuiz,
        setCurrentQuestion,
        setAnswer,
        updateTimer,
        completeQuiz,
        resetQuiz,
        getResults
    };

    return (
        <QuizContext.Provider value={value}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
};
