export interface Question {
    id: number;
    category: string;
    difficulty: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface QuizSession {
    quizId: string;
    email: string;
    questions: Question[];
    startTime: number;
}

export interface OpenTDBQuestion {
    type: string;
    difficulty: string;
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface OpenTDBResponse {
    response_code: number;
    results: OpenTDBQuestion[];
}

const quizSessions: Map<string, QuizSession> = new Map();

export const saveQuizSession = (session: QuizSession): void => {
    quizSessions.set(session.quizId, session);
};

export const getQuizSession = (quizId: string): QuizSession | undefined => {
    return quizSessions.get(quizId);
};

export const deleteQuizSession = (quizId: string): void => {
    quizSessions.delete(quizId);
};
