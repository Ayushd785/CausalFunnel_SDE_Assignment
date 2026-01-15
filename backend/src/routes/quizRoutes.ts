import { Router } from 'express';
import { startQuiz, submitQuiz } from '../controllers/quizController';

const router = Router();

router.post('/start', startQuiz);
router.post('/submit', submitQuiz);

export default router;
