import React, { createContext, useContext, useReducer } from 'react';

// Quiz questions data
const quizQuestions = [
    {
        id: 1,
        category: 'JavaScript',
        difficulty: 'easy',
        question: 'What is the output of 2+2 in JS?',
        options: ['3', '4', '22', 'undefined'],
        correctAnswer: 1
    },
    {
        id: 2,
        category: 'Web Development',
        difficulty: 'medium',
        question: 'Which HTTP method is used to update resources?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 2
    },
    {
        id: 3,
        category: 'Databases',
        difficulty: 'easy',
        question: 'What does SQL stand for?',
        options: ['Simple Query Language', 'Structured Query Language', 'Standard Query Logic', 'System Query Language'],
        correctAnswer: 1
    },
    {
        id: 4,
        category: 'Programming',
        difficulty: 'medium',
        question: 'Who created Python?',
        options: ['Dennis Ritchie', 'James Gosling', 'Guido van Rossum', 'Bjarne Stroustrup'],
        correctAnswer: 2
    },
    {
        id: 5,
        category: 'JavaScript',
        difficulty: 'easy',
        question: 'Is Java same as JavaScript?',
        options: ['Yes', 'No'],
        correctAnswer: 1
    },
    {
        id: 6,
        category: 'Algorithms',
        difficulty: 'medium',
        question: 'What is the complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1
    },
    {
        id: 7,
        category: 'Web Development',
        difficulty: 'easy',
        question: 'What is CSS used for?',
        options: ['Programming', 'Styling', 'Database', 'Networking'],
        correctAnswer: 1
    },
    {
        id: 8,
        category: 'React',
        difficulty: 'medium',
        question: 'What is a React Hook?',
        options: ['A class', 'A function', 'An object', 'A component'],
        correctAnswer: 1
    },
    {
        id: 9,
        category: 'Web Development',
        difficulty: 'easy',
        question: 'What does JSON stand for?',
        options: ['Java Standard Object Notation', 'JavaScript Object Notation', 'Java Source Object Network', 'JavaScript Online Notation'],
        correctAnswer: 1
    },
    {
        id: 10,
        category: 'JavaScript',
        difficulty: 'medium',
        question: 'Is 10 == "10" true in JS?',
        options: ['True', 'False'],
        correctAnswer: 0
    },
    {
        id: 11,
        category: 'Networking',
        difficulty: 'easy',
        question: 'What is the port for HTTP?',
        options: ['443', '80', '22', '21'],
        correctAnswer: 1
    },
    {
        id: 12,
        category: 'Tools',
        difficulty: 'easy',
        question: 'What is Git?',
        options: ['IDE', 'VCS', 'Database', 'Framework'],
        correctAnswer: 1
    },
    {
        id: 13,
        category: 'Tools',
        difficulty: 'easy',
        question: 'Command to clone repo?',
        options: ['git copy', 'git clone', 'git duplicate', 'git download'],
        correctAnswer: 1
    },
    {
        id: 14,
        category: 'DevOps',
        difficulty: 'medium',
        question: 'What is Docker?',
        options: ['Virtualization', 'Containerization', 'Orchestration', 'Compilation'],
        correctAnswer: 1
    },
    {
        id: 15,
        category: 'JavaScript',
        difficulty: 'hard',
        question: 'Output of console.log(typeof NaN)?',
        options: ['NaN', 'undefined', 'number', 'object'],
        correctAnswer: 2
    }
];

const QuizContext = createContext();

const initialState = {
    email: '',
    questions: quizQuestions,
    currentQuestion: 0,
    answers: {},
    visitedQuestions: new Set([0]),
    timeRemaining: 30 * 60,
    timeTaken: 0,
    quizStarted: false,
    quizCompleted: false
};

const quizReducer = (state, action) => {
    switch (action.type) {
        case 'START_QUIZ':
            return {
                ...state,
                email: action.payload,
                quizStarted: true,
                currentQuestion: 0,
                answers: {},
                visitedQuestions: new Set([0]),
                timeRemaining: 30 * 60,
                timeTaken: 0,
                quizCompleted: false
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
            return {
                ...state,
                timeRemaining: action.payload
            };

        case 'COMPLETE_QUIZ':
            return {
                ...state,
                quizCompleted: true,
                timeTaken: (30 * 60) - state.timeRemaining
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

    // Helper functions
    const startQuiz = (email) => {
        dispatch({ type: 'START_QUIZ', payload: email });
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

    const completeQuiz = () => {
        dispatch({ type: 'COMPLETE_QUIZ' });
    };

    const resetQuiz = () => {
        dispatch({ type: 'RESET_QUIZ' });
    };

    // Calculate results
    const getResults = () => {
        const results = state.questions.map((q, index) => {
            const userAnswerIndex = state.answers[index];
            const isCorrect = userAnswerIndex === q.correctAnswer;
            return {
                id: q.id,
                question: q.question,
                category: q.category,
                userAnswer: userAnswerIndex !== undefined ? q.options[userAnswerIndex] : 'Not answered',
                correctAnswer: q.options[q.correctAnswer],
                isCorrect: userAnswerIndex !== undefined && isCorrect,
                wasAnswered: userAnswerIndex !== undefined
            };
        });

        const correctCount = results.filter(r => r.isCorrect).length;
        const answeredCount = results.filter(r => r.wasAnswered).length;
        const scorePercent = Math.round((correctCount / state.questions.length) * 100);

        return {
            results,
            correctCount,
            incorrectCount: state.questions.length - correctCount,
            answeredCount,
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
