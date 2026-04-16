import { Router } from 'express';
import * as questionController from '../controllers/questionController.js';
import * as examController from '../controllers/examController.js';
import * as submissionController from '../controllers/submissionController.js';
import upload from '../middlewares/multer.js';

const router: Router = Router();

// Questions
router.get('/questions', questionController.getAllQuestions);
router.post('/questions', upload.single('image'), questionController.createQuestion);
router.delete('/questions/:id', questionController.deleteQuestion);

// Exams
router.get('/exams', examController.getExams);
router.post('/exams', examController.createExam);
router.get('/exams/start/:examId', examController.startExam);

// Submissions
router.post('/exams/submit', submissionController.submitExam);
router.get('/results', submissionController.getResults);

export default router;
