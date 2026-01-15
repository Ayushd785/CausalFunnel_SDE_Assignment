import mongoose, { Document, Schema } from 'mongoose';

interface IQuestionResult {
    questionId: number;
    question: string;
    category: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    wasAnswered: boolean;
}

export interface IQuizResult extends Document {
    quizId: string;
    userId: mongoose.Types.ObjectId;
    email: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    timeTaken: number;
    submittedAt: Date;
    results: IQuestionResult[];
}

const questionResultSchema = new Schema<IQuestionResult>({
    questionId: { type: Number, required: true },
    question: { type: String, required: true },
    category: { type: String, required: true },
    userAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    wasAnswered: { type: Boolean, required: true }
}, { _id: false });

const quizResultSchema = new Schema<IQuizResult>({
    quizId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    correctCount: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    timeTaken: {
        type: Number,
        default: 0
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    results: [questionResultSchema]
});

const QuizResult = mongoose.model<IQuizResult>('QuizResult', quizResultSchema);

export default QuizResult;
