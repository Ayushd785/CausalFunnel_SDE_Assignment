import { Request, Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
    Question,
    OpenTDBResponse,
    OpenTDBQuestion,
    saveQuizSession,
    getQuizSession
} from '../model/Quiz';
import User from '../model/User';
import QuizResult from '../model/QuizResult';

const decodeHTML = (text: string): string => {
    const entities: { [key: string]: string } = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'",
        '&apos;': "'",
        '&eacute;': 'é',
        '&Eacute;': 'É'
    };
    return text.replace(/&[^;]+;/g, (match) => entities[match] || match);
};

const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const transformQuestion = (q: OpenTDBQuestion, id: number): Question => {
    const correctAnswer = decodeHTML(q.correct_answer);
    const incorrectAnswers = q.incorrect_answers.map(decodeHTML);

    const allOptions = [...incorrectAnswers, correctAnswer];
    const shuffledOptions = shuffleArray(allOptions);
    const correctIndex = shuffledOptions.indexOf(correctAnswer);

    return {
        id,
        category: decodeHTML(q.category),
        difficulty: q.difficulty,
        question: decodeHTML(q.question),
        options: shuffledOptions,
        correctAnswer: correctIndex
    };
};

export const startQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            user = await User.create({ email: email.toLowerCase() });
            console.log('New user created:', user.email);
        }

        const apiUrl = process.env.OPENTDB_API_URL || 'https://opentdb.com/api.php?amount=15';
        const response = await axios.get<OpenTDBResponse>(apiUrl);

        if (response.data.response_code !== 0) {
            res.status(500).json({ error: 'Failed to fetch questions' });
            return;
        }

        const questions = response.data.results.map((q, index) =>
            transformQuestion(q, index + 1)
        );

        const quizId = uuidv4();
        const session = {
            quizId,
            email,
            questions,
            startTime: Date.now()
        };

        saveQuizSession(session);

        const questionsForClient = questions.map(q => ({
            id: q.id,
            category: q.category,
            difficulty: q.difficulty,
            question: q.question,
            options: q.options
        }));

        res.json({
            quizId,
            questions: questionsForClient,
            timeLimit: 1800
        });

    } catch (error) {
        console.error('Error starting quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const submitQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
        const { quizId, answers, timeTaken } = req.body;

        if (!quizId) {
            res.status(400).json({ error: 'Quiz ID is required' });
            return;
        }

        const session = getQuizSession(quizId);

        if (!session) {
            res.status(404).json({ error: 'Quiz session not found' });
            return;
        }

        const results = session.questions.map((q, index) => {
            const userAnswerIndex = answers?.[index];
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
        const totalQuestions = session.questions.length;
        const scorePercent = Math.round((correctCount / totalQuestions) * 100);
        const passed = scorePercent >= 50;

        try {
            const user = await User.findOne({ email: session.email.toLowerCase() });
            if (user) {
                await QuizResult.create({
                    quizId,
                    userId: user._id,
                    email: session.email,
                    score: scorePercent,
                    correctCount,
                    totalQuestions,
                    passed,
                    timeTaken: timeTaken || 0,
                    results: results.map(r => ({
                        questionId: r.id,
                        question: r.question,
                        category: r.category,
                        userAnswer: r.userAnswer,
                        correctAnswer: r.correctAnswer,
                        isCorrect: r.isCorrect,
                        wasAnswered: r.wasAnswered
                    }))
                });
                console.log('Quiz result saved to MongoDB for:', session.email);
            }
        } catch (dbError) {
            console.error('Error saving to MongoDB:', dbError);
        }

        res.json({
            email: session.email,
            results,
            correctCount,
            incorrectCount: totalQuestions - correctCount,
            totalQuestions,
            scorePercent,
            passed,
            timeTaken: timeTaken || 0
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
